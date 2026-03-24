import {
  createEntityId,
  nowIso,
  type ChannelId,
  type DraftId,
  type IsoDateTimeString,
  type PublishJobId,
  type SourceId,
  type UserId,
} from "../domain/identifiers.js";
import {
  DEFAULT_SAFETY_POLICY_FLAGS,
  applyEditorialReview,
  assembleDetectedEventBundle,
  createDetectedEventFromSourceItems,
  createMockDraft,
  createPublishJobIntent,
  createPublishedPost,
  transitionDraftState,
  transitionPublishJobState,
} from "./workflows.js";
import { normalizeManualSourceSubmission } from "./workflows.js";
import type { ManualSourceSubmission } from "./ports.js";
import { InMemoryM1Store } from "./store.js";
import { assertDomainRule } from "../shared/domain-error.js";
import type {
  AuditEvent,
  Channel,
  DetectedEvent,
  Draft,
  EditorialLifecycleState,
  PromptTemplate,
  PublishJob,
  PublishedPost,
  ReviewActionType,
  Rubric,
  Source,
  SourceItem,
  User,
} from "../domain/model.js";
import { STARTER_RUBRIC_CODES } from "../domain/model.js";

type ReviewTransitionInput = {
  readonly action: ReviewActionType;
  readonly toState?: EditorialLifecycleState;
};

export type ManualSourceProcessingRequest = {
  readonly channelId: ChannelId;
  readonly sourceId: SourceId;
  readonly actorUserId: UserId;
  readonly submission: Omit<ManualSourceSubmission, "sourceId">;
  readonly preferredModel?: string;
};

export type ManualSourceProcessingResult = {
  readonly duplicate: boolean;
  readonly sourceItem: SourceItem;
  readonly detectedEvent: DetectedEvent;
  readonly drafts: readonly Draft[];
  readonly matchedRubrics: readonly Rubric[];
  readonly auditEvents: readonly AuditEvent[];
};

export type ReviewDraftRequest = {
  readonly draftId: DraftId;
  readonly actorUserId: UserId;
  readonly action: ReviewActionType;
  readonly notes?: string;
  readonly editedContent?: string;
  readonly preferredModel?: string;
};

export type ReviewDraftResult = {
  readonly draft: Draft;
  readonly review: ReturnType<typeof applyEditorialReview>["review"];
  readonly regeneratedDraft?: Draft;
  readonly auditEvents: readonly AuditEvent[];
};

export type PublishIntentResult = {
  readonly publishJob?: PublishJob;
  readonly idempotentReuse: boolean;
  readonly blocked: boolean;
  readonly blockedReasons: readonly string[];
  readonly auditEvents: readonly AuditEvent[];
};

export type PublishDispatchExecutionResult = {
  readonly publishJob: PublishJob;
  readonly publishedPost?: PublishedPost;
  readonly failed: boolean;
  readonly idempotentReuse: boolean;
  readonly auditEvents: readonly AuditEvent[];
};

const mapActionToTargetState = (
  input: ReviewTransitionInput,
  currentState: EditorialLifecycleState,
): EditorialLifecycleState => {
  if (input.toState) {
    return input.toState;
  }

  const mapping: Record<ReviewActionType, EditorialLifecycleState> = {
    approve: "approved",
    edit: "needs_revision",
    reject: "archived",
    regenerate: "in_review",
    reschedule: "scheduled",
  };

  if (input.action === "regenerate") {
    return currentState === "needs_revision" ? "in_review" : "needs_revision";
  }

  return mapping[input.action];
};

const scoreDetectedEvent = (sourceItem: SourceItem): DetectedEvent["scores"] => {
  const text = `${sourceItem.title ?? ""} ${sourceItem.body ?? ""}`.toLowerCase();
  const hasBreakingSignals = /\bbreaking\b|\burgent\b|\bjust in\b/.test(text);
  const hasMarketSignals =
    /\bmarket\b|\bstock\b|\bindex\b|\bbtc\b|\beth\b|\bprice\b|%/.test(text);

  const urgency = hasBreakingSignals ? 0.9 : 0.65;
  const relevance = hasMarketSignals ? 0.88 : 0.7;
  const evidence = sourceItem.externalId ? 0.84 : 0.76;
  const confidence = Number(((urgency + relevance + evidence) / 3).toFixed(2));

  return {
    urgency,
    relevance,
    evidence,
    confidence,
  };
};

const createAuditEvent = (params: {
  readonly entityType: AuditEvent["entityType"];
  readonly entityId: string;
  readonly action: string;
  readonly actorUserId?: UserId;
  readonly payload?: Readonly<Record<string, unknown>>;
}): AuditEvent => ({
  id: createEntityId<"AuditEvent">("audit_event"),
  entityType: params.entityType,
  entityId: params.entityId,
  actorUserId: params.actorUserId,
  action: params.action,
  happenedAt: nowIso(),
  payload: params.payload ?? {},
});

const matchStarterRubrics = (
  event: DetectedEvent,
  rubrics: readonly Rubric[],
): Rubric[] => {
  const text = `${event.headline} ${event.summary}`.toLowerCase();
  const breakingNews =
    /\bbreaking\b|\burgent\b|\bjust in\b|\balert\b|\bconfirmed\b/.test(text);
  const marketMove =
    /\bmarket\b|\bstock\b|\bindex\b|\bbtc\b|\beth\b|\bprice\b|%/.test(text);

  const matchedCodes = new Set<string>();
  if (breakingNews) {
    matchedCodes.add("breaking_news");
  }
  if (marketMove) {
    matchedCodes.add("market_move");
  }

  if (matchedCodes.size === 0) {
    matchedCodes.add("breaking_news");
  }

  const starterCodes: readonly string[] = STARTER_RUBRIC_CODES;

  return rubrics.filter(
    (rubric) =>
      starterCodes.includes(rubric.configuration.code) &&
      matchedCodes.has(rubric.configuration.code),
  );
};

const ensureSource = (source: Source | undefined): Source => {
  if (!source) {
    throw new Error("Source is not configured.");
  }
  return source;
};

const ensureUser = (user: User | undefined): User => {
  if (!user) {
    throw new Error("User is not configured.");
  }
  return user;
};

const ensurePromptTemplate = (
  promptTemplate: PromptTemplate | undefined,
  rubric: Rubric,
): PromptTemplate => {
  if (!promptTemplate) {
    throw new Error(
      `Active prompt template is required for rubric ${rubric.configuration.code}.`,
    );
  }
  return promptTemplate;
};

const ensureChannel = (channel: Channel | undefined): Channel => {
  if (!channel) {
    throw new Error("Channel is not configured.");
  }
  return channel;
};

const ensureDetectedEvent = (
  event: DetectedEvent | undefined,
): DetectedEvent => {
  if (!event) {
    throw new Error("Detected event is not found.");
  }
  return event;
};

const ensureDraft = (draft: Draft | undefined): Draft => {
  if (!draft) {
    throw new Error("Draft is not found.");
  }
  return draft;
};

const ensureRubric = (rubric: Rubric | undefined): Rubric => {
  if (!rubric) {
    throw new Error("Rubric is not found.");
  }
  return rubric;
};

const ensurePublishJob = (publishJob: PublishJob | undefined): PublishJob => {
  if (!publishJob) {
    throw new Error("Publish job is not found.");
  }
  return publishJob;
};

const evaluateDraftSafety = (params: {
  readonly draft: Draft;
  readonly blockedPhrases: readonly string[];
}): { readonly allowed: boolean; readonly reasons: readonly string[] } => {
  const text = params.draft.content.toLowerCase();
  const reasons: string[] = [];

  if (DEFAULT_SAFETY_POLICY_FLAGS.blockUnsupportedClaims) {
    const unsupportedClaimPattern =
      /\bguaranteed\b|\brisk[- ]free\b|\bno risk\b|\bcertain profit\b|\binsider certainty\b/;
    if (unsupportedClaimPattern.test(text)) {
      reasons.push("unsupported_claim_pattern_detected");
    }
  }

  if (DEFAULT_SAFETY_POLICY_FLAGS.blockRecommendationStyleOutput) {
    const recommendationPattern =
      /\bbuy now\b|\bsell now\b|\bmust buy\b|\bmust sell\b|\bstrong buy\b|\bstrong sell\b/;
    if (recommendationPattern.test(text)) {
      reasons.push("recommendation_style_pattern_detected");
    }
  }

  for (const bannedPhrase of params.blockedPhrases) {
    if (bannedPhrase && text.includes(bannedPhrase.toLowerCase())) {
      reasons.push(`voice_profile_banned_phrase:${bannedPhrase}`);
    }
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
};

export class M1ManualSourceBoundary {
  constructor(private readonly store: InMemoryM1Store) {}

  processSubmission(
    request: ManualSourceProcessingRequest,
  ): ManualSourceProcessingResult {
    const source = ensureSource(this.store.getSource(request.sourceId));
    const actor = ensureUser(this.store.getUser(request.actorUserId));
    assertDomainRule(
      source.channelId === request.channelId,
      "Source must belong to the requested channel.",
    );
    assertDomainRule(
      source.configuration.sourceKind === "manual" &&
        source.configuration.manualInputEnabled,
      "Manual source boundary accepts only manual-enabled sources.",
    );

    const normalized = normalizeManualSourceSubmission({
      channelId: request.channelId,
      source,
      submission: {
        ...request.submission,
        sourceId: request.sourceId,
      },
    });

    const existingSourceItem = this.store.getSourceItemByDedupeKey(
      normalized.dedupeKey,
    );

    if (existingSourceItem) {
      const existingEvent = ensureDetectedEvent(
        this.store.getDetectedEventByDedupeKey(normalized.dedupeKey),
      );
      const existingDrafts = this.store.listDraftsForDetectedEvent(existingEvent.id);
      const duplicateAudit = createAuditEvent({
        entityType: "source_item",
        entityId: existingSourceItem.id,
        actorUserId: actor.id,
        action: "manual_input.duplicate_collapsed",
        payload: {
          dedupeKey: normalized.dedupeKey,
          sourceId: source.id,
          detectedEventId: existingEvent.id,
        },
      });
      this.store.appendAuditEvents([duplicateAudit]);

      return {
        duplicate: true,
        sourceItem: existingSourceItem,
        detectedEvent: existingEvent,
        drafts: existingDrafts,
        matchedRubrics: this.resolveRubricsForDrafts(existingDrafts),
        auditEvents: [duplicateAudit],
      };
    }

    this.store.upsertSourceItem(normalized);

    const event = createDetectedEventFromSourceItems({
      channelId: request.channelId,
      headline: normalized.title ?? "Manual source update",
      summary:
        normalized.body?.slice(0, 420) ??
        "Manual source item submitted without body text.",
      sourceItems: [normalized],
      scores: scoreDetectedEvent(normalized),
    });
    this.store.upsertDetectedEvent(event, normalized.dedupeKey);

    const eventAudit = createAuditEvent({
      entityType: "detected_event",
      entityId: event.id,
      actorUserId: actor.id,
      action: "detected_event.created",
      payload: {
        sourceItemId: normalized.id,
        sourceId: normalized.sourceId,
        confidence: event.scores.confidence,
      },
    });

    const sourceAudit = createAuditEvent({
      entityType: "source_item",
      entityId: normalized.id,
      actorUserId: actor.id,
      action: "source_item.normalized",
      payload: {
        sourceId: normalized.sourceId,
        dedupeKey: normalized.dedupeKey,
      },
    });

    const channel = ensureChannel(this.store.getChannel(request.channelId));

    const voiceProfile = this.store.getDefaultVoiceProfileForChannel(channel.id);
    const allActiveRubrics = this.store.listActiveRubricsForChannel(channel.id);
    const matchedRubrics = matchStarterRubrics(event, allActiveRubrics);
    const generatedDrafts: Draft[] = [];
    const draftAuditEvents: AuditEvent[] = [];

    for (const rubric of matchedRubrics) {
      const existingDraft = this.store.getDraftForEventRubric(event.id, rubric.id);
      if (existingDraft) {
        generatedDrafts.push(existingDraft);
        continue;
      }

      const promptTemplate = ensurePromptTemplate(
        this.store.getActivePromptTemplateForRubric(rubric.id),
        rubric,
      );

      const bundle = assembleDetectedEventBundle({
        channel,
        detectedEvent: event,
        rubric,
        promptTemplate,
        sourceItems: [normalized],
        voiceProfile,
      });

      const drafted = createMockDraft({
        bundle,
        modelVersion: request.preferredModel ?? "mock-llm-v1",
      });
      const draftInReview = transitionDraftState(drafted, "in_review");
      this.store.upsertDraft(draftInReview);
      generatedDrafts.push(draftInReview);

      draftAuditEvents.push(
        createAuditEvent({
          entityType: "draft",
          entityId: draftInReview.id,
          actorUserId: actor.id,
          action: "draft.generated_from_detected_event",
          payload: {
            detectedEventId: event.id,
            rubricCode: rubric.configuration.code,
            promptVersion: promptTemplate.configuration.version,
            modelVersion: draftInReview.modelVersion,
          },
        }),
      );
      draftAuditEvents.push(
        createAuditEvent({
          entityType: "draft",
          entityId: draftInReview.id,
          actorUserId: actor.id,
          action: "draft.state_changed_to_in_review",
          payload: {
            fromState: drafted.state,
            toState: draftInReview.state,
          },
        }),
      );
    }

    const audits = [sourceAudit, eventAudit, ...draftAuditEvents];
    this.store.appendAuditEvents(audits);

    return {
      duplicate: false,
      sourceItem: normalized,
      detectedEvent: event,
      drafts: generatedDrafts,
      matchedRubrics,
      auditEvents: audits,
    };
  }

  reviewDraft(request: ReviewDraftRequest): ReviewDraftResult {
    const actor = ensureUser(this.store.getUser(request.actorUserId));
    const draft = ensureDraft(this.store.getDraft(request.draftId));

    const toState = mapActionToTargetState(
      { action: request.action },
      draft.state,
    );
    const result = applyEditorialReview({
      draft,
      actorUserId: actor.id,
      action: request.action,
      toState,
      notes: request.notes,
      editedContent: request.editedContent,
    });

    this.store.upsertDraft(result.draft);
    this.store.upsertEditorialReview(result.review);

    const auditEvents: AuditEvent[] = [
      createAuditEvent({
        entityType: "editorial_review",
        entityId: result.review.id,
        actorUserId: actor.id,
        action: `editorial_review.${request.action}`,
        payload: {
          draftId: result.review.draftId,
          fromState: result.review.fromState,
          toState: result.review.toState,
        },
      }),
    ];

    let regeneratedDraft: Draft | undefined;

    if (request.action === "regenerate") {
      regeneratedDraft = this.regenerateDraft(result.draft, actor.id, request.preferredModel);
      auditEvents.push(
        createAuditEvent({
          entityType: "draft",
          entityId: regeneratedDraft.id,
          actorUserId: actor.id,
          action: "draft.regenerated",
          payload: {
            fromDraftId: result.draft.id,
            detectedEventId: regeneratedDraft.lineage.detectedEventId,
            rubricId: regeneratedDraft.lineage.rubricId,
          },
        }),
      );
    }

    this.store.appendAuditEvents(auditEvents);

    return {
      draft: result.draft,
      review: result.review,
      regeneratedDraft,
      auditEvents,
    };
  }

  createPublishIntent(params: {
    readonly draftId: DraftId;
    readonly actorUserId: UserId;
    readonly scheduledFor?: IsoDateTimeString;
  }): PublishIntentResult {
    const actor = ensureUser(this.store.getUser(params.actorUserId));
    const draft = ensureDraft(this.store.getDraft(params.draftId));
    const voiceProfile = this.store.getDefaultVoiceProfileForChannel(draft.channelId);
    const safetyCheck = evaluateDraftSafety({
      draft,
      blockedPhrases: voiceProfile?.configuration.bannedPhrases ?? [],
    });

    if (!safetyCheck.allowed) {
      const blockedAudit = createAuditEvent({
        entityType: "publish_job",
        entityId: draft.id,
        actorUserId: actor.id,
        action: "publish_intent.blocked_by_safety",
        payload: {
          draftId: draft.id,
          reasons: safetyCheck.reasons,
        },
      });
      this.store.appendAuditEvents([blockedAudit]);
      return {
        idempotentReuse: false,
        blocked: true,
        blockedReasons: safetyCheck.reasons,
        auditEvents: [blockedAudit],
      };
    }

    const intended = createPublishJobIntent({
      draft,
      scheduledFor: params.scheduledFor,
    });
    const existing = this.store.getPublishJobByIdempotencyKey(
      intended.idempotencyKey,
    );

    if (existing) {
      const reusedAudit = createAuditEvent({
        entityType: "publish_job",
        entityId: existing.id,
        actorUserId: actor.id,
        action: "publish_intent.idempotent_reuse",
        payload: {
          draftId: existing.draftId,
          idempotencyKey: existing.idempotencyKey,
        },
      });
      this.store.appendAuditEvents([reusedAudit]);
      return {
        publishJob: existing,
        idempotentReuse: true,
        blocked: false,
        blockedReasons: [],
        auditEvents: [reusedAudit],
      };
    }

    this.store.upsertPublishJob(intended);
    const createdAudit = createAuditEvent({
      entityType: "publish_job",
      entityId: intended.id,
      actorUserId: actor.id,
      action: "publish_intent.created",
      payload: {
        draftId: intended.draftId,
        state: intended.state,
        idempotencyKey: intended.idempotencyKey,
      },
    });
    this.store.appendAuditEvents([createdAudit]);

    return {
      publishJob: intended,
      idempotentReuse: false,
      blocked: false,
      blockedReasons: [],
      auditEvents: [createdAudit],
    };
  }

  dispatchPublishJob(params: {
    readonly publishJobId: PublishJobId;
    readonly actorUserId: UserId;
    readonly simulateFailure?: boolean;
  }): PublishDispatchExecutionResult {
    const actor = ensureUser(this.store.getUser(params.actorUserId));
    const existingJob = ensurePublishJob(
      this.store.getPublishJobById(params.publishJobId),
    );
    const draft = ensureDraft(this.store.getDraft(existingJob.draftId));
    const existingPost = this.store.getPublishedPostByPublishJobId(existingJob.id);

    if (existingPost && existingJob.state === "published") {
      const reusedAudit = createAuditEvent({
        entityType: "publish_job",
        entityId: existingJob.id,
        actorUserId: actor.id,
        action: "publish_dispatch.idempotent_reuse",
        payload: {
          publishJobId: existingJob.id,
          publishedPostId: existingPost.id,
        },
      });
      this.store.appendAuditEvents([reusedAudit]);
      return {
        publishJob: existingJob,
        publishedPost: existingPost,
        failed: false,
        idempotentReuse: true,
        auditEvents: [reusedAudit],
      };
    }

    const dispatchingJob = transitionPublishJobState(existingJob, "dispatching");
    this.store.upsertPublishJob(dispatchingJob);
    const startAudit = createAuditEvent({
      entityType: "publish_job",
      entityId: dispatchingJob.id,
      actorUserId: actor.id,
      action: "publish_dispatch.started",
      payload: {
        previousState: existingJob.state,
        attempts: dispatchingJob.attempts,
      },
    });

    const shouldFail = params.simulateFailure === true;
    if (shouldFail) {
      const failedJob = transitionPublishJobState(dispatchingJob, "failed");
      this.store.upsertPublishJob(failedJob);
      const failedAudit = createAuditEvent({
        entityType: "publish_job",
        entityId: failedJob.id,
        actorUserId: actor.id,
        action: "publish_dispatch.failed",
        payload: {
          attempts: failedJob.attempts,
          reason: "mock_dispatch_failure",
        },
      });
      this.store.appendAuditEvents([startAudit, failedAudit]);
      return {
        publishJob: failedJob,
        failed: true,
        idempotentReuse: false,
        auditEvents: [startAudit, failedAudit],
      };
    }

    const publishedJob = transitionPublishJobState(dispatchingJob, "published");
    this.store.upsertPublishJob(publishedJob);
    const publishedPost = createPublishedPost({
      publishJob: publishedJob,
      draft,
      telegramMessageId: `mock_msg_${publishedJob.id}`,
    });
    this.store.upsertPublishedPost(publishedPost);
    const publishedAudit = createAuditEvent({
      entityType: "publish_job",
      entityId: publishedJob.id,
      actorUserId: actor.id,
      action: "publish_dispatch.published",
      payload: {
        attempts: publishedJob.attempts,
        publishedPostId: publishedPost.id,
      },
    });
    this.store.appendAuditEvents([startAudit, publishedAudit]);

    return {
      publishJob: publishedJob,
      publishedPost,
      failed: false,
      idempotentReuse: false,
      auditEvents: [startAudit, publishedAudit],
    };
  }

  private regenerateDraft(
    draft: Draft,
    actorUserId: UserId,
    preferredModel?: string,
  ): Draft {
    const event = ensureDetectedEvent(
      this.store.getDetectedEventById(draft.lineage.detectedEventId),
    );

    const rubric = ensureRubric(
      this.store
        .listActiveRubricsForChannel(draft.channelId)
        .find((candidate) => candidate.id === draft.lineage.rubricId),
    );

    const promptTemplate = ensurePromptTemplate(
      this.store.getActivePromptTemplateForRubric(rubric.id),
      rubric,
    );
    const channel = ensureChannel(this.store.getChannel(draft.channelId));
    const sourceItems = this.store.listSourceItemsByIds(draft.lineage.sourceItemIds);
    assertDomainRule(
      sourceItems.length > 0,
      "At least one source item is required for draft regeneration.",
    );

    const bundle = assembleDetectedEventBundle({
      channel,
      detectedEvent: event,
      rubric,
      promptTemplate,
      sourceItems,
      voiceProfile: this.store.getDefaultVoiceProfileForChannel(channel.id),
    });

    const regeneratedDraft = createMockDraft({
      bundle,
      modelVersion: preferredModel ?? `${draft.modelVersion}-regen`,
    });
    const inReviewDraft = transitionDraftState(
      {
        ...regeneratedDraft,
        regeneratedFromDraftId: draft.id,
      },
      "in_review",
    );

    this.store.upsertDraft(inReviewDraft);
    this.store.appendAuditEvents([
      createAuditEvent({
        entityType: "draft",
        entityId: inReviewDraft.id,
        actorUserId,
        action: "draft.regenerated_to_in_review",
        payload: {
          regeneratedFromDraftId: draft.id,
          detectedEventId: draft.lineage.detectedEventId,
          rubricId: draft.lineage.rubricId,
        },
      }),
    ]);

    return inReviewDraft;
  }

  private resolveRubricsForDrafts(drafts: readonly Draft[]): Rubric[] {
    const rubrics: Rubric[] = [];

    for (const draft of drafts) {
      const rubric = this.store
        .listActiveRubricsForChannel(draft.channelId)
        .find((candidate) => candidate.id === draft.lineage.rubricId);
      if (rubric) {
        rubrics.push(rubric);
      }
    }

    return rubrics;
  }
}
