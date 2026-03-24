import { createHash } from "node:crypto";
import {
  createEntityId,
  nowIso,
  type ChannelId,
  type DraftId,
  type IsoDateTimeString,
  type SourceItemId,
  type SourceId,
  type UserId,
} from "../domain/identifiers.js";
import {
  canTransitionEditorialState,
  canTransitionPublishJobState,
  type Channel,
  type DetectedEvent,
  type DetectedEventBundle,
  type Draft,
  type EditorialLifecycleState,
  type EditorialReview,
  type PublishJob,
  type PublishJobState,
  type PublishedPost,
  type ReviewActionType,
  type Rubric,
  type SafetyPolicyFlags,
  type Source,
  type SourceAnchor,
  type SourceItem,
  type VoiceProfile,
} from "../domain/model.js";
import type { DraftGenerationRequest, ManualSourceSubmission } from "./ports.js";
import { assertDomainRule } from "../shared/domain-error.js";

export const DEFAULT_SAFETY_POLICY_FLAGS: SafetyPolicyFlags = {
  blockUnsupportedClaims: true,
  blockRecommendationStyleOutput: true,
  requireHumanReviewForHighRiskContent: true,
};

export const createSourceAnchor = (sourceItem: SourceItem): SourceAnchor => ({
  sourceItemId: sourceItem.id,
  sourceId: sourceItem.sourceId,
  title: sourceItem.title,
  excerpt: sourceItem.body?.slice(0, 240),
  observedAt: sourceItem.observedAt,
});

const normalizeText = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

export const buildManualDedupeFingerprint = (params: {
  readonly sourceId: SourceId;
  readonly externalId?: string;
  readonly title?: string;
  readonly body?: string;
}): string => {
  const seed = [
    params.sourceId,
    normalizeText(params.externalId),
    normalizeText(params.title),
    normalizeText(params.body),
  ]
    .filter(Boolean)
    .join("|");

  return createHash("sha256").update(seed).digest("hex");
};

export const normalizeManualSourceSubmission = (params: {
  readonly channelId: ChannelId;
  readonly source: Source;
  readonly submission: ManualSourceSubmission;
}): SourceItem => {
  const { channelId, source, submission } = params;
  const createdAt = nowIso();
  const dedupeSeed = buildManualDedupeFingerprint({
    sourceId: source.id,
    externalId: submission.externalId,
    title: submission.title,
    body: submission.body,
  });

  return {
    id: createEntityId<"SourceItem">("source_item"),
    channelId,
    sourceId: source.id,
    externalId: submission.externalId,
    title: submission.title,
    body: submission.body,
    observedAt: submission.observedAt,
    normalizedAt: createdAt,
    dedupeKey: dedupeSeed,
    rawPayload: submission.rawPayload ?? {},
    createdAt,
    updatedAt: createdAt,
  };
};

export const createDetectedEventFromSourceItems = (params: {
  readonly channelId: ChannelId;
  readonly headline: string;
  readonly summary: string;
  readonly sourceItems: readonly SourceItem[];
  readonly scores: DetectedEvent["scores"];
}): DetectedEvent => {
  const createdAt = nowIso();
  assertDomainRule(
    params.sourceItems.length > 0,
    "DetectedEvent requires at least one source item.",
  );

  return {
    id: createEntityId<"DetectedEvent">("detected_event"),
    channelId: params.channelId,
    headline: params.headline,
    summary: params.summary,
    scores: params.scores,
    sourceAnchors: params.sourceItems.map(createSourceAnchor),
    sourceItemIds: params.sourceItems.map((sourceItem) => sourceItem.id),
    createdAt,
    updatedAt: createdAt,
  };
};

export const assembleDetectedEventBundle = (params: {
  readonly channel: Channel;
  readonly detectedEvent: DetectedEvent;
  readonly rubric: Rubric;
  readonly promptTemplate: DetectedEventBundle["promptTemplate"];
  readonly sourceItems: readonly SourceItem[];
  readonly safetyFlags?: SafetyPolicyFlags;
  readonly voiceProfile?: VoiceProfile;
}): DetectedEventBundle => {
  const {
    channel,
    detectedEvent,
    promptTemplate,
    rubric,
    sourceItems,
    voiceProfile,
  } = params;
  assertDomainRule(
    detectedEvent.channelId === channel.id,
    "DetectedEvent must belong to the same channel as the bundle.",
  );
  assertDomainRule(
    rubric.channelId === channel.id,
    "Rubric must belong to the same channel as the bundle.",
  );
  assertDomainRule(
    promptTemplate.channelId === channel.id &&
      promptTemplate.rubricId === rubric.id,
    "PromptTemplate must match the bundled rubric and channel.",
  );

  return {
    channel,
    detectedEvent,
    rubric,
    promptTemplate,
    voiceProfile,
    safetyFlags: params.safetyFlags ?? DEFAULT_SAFETY_POLICY_FLAGS,
    sourceItems,
    sourceAnchors: detectedEvent.sourceAnchors,
  };
};

export const createMockDraft = (
  request: DraftGenerationRequest & { readonly modelVersion?: string },
): Draft => {
  const createdAt = nowIso();
  const sourceSummary = request.bundle.sourceItems
    .map((sourceItem) => sourceItem.title ?? sourceItem.body ?? "Untitled source")
    .join(" | ");

  return {
    id: createEntityId<"Draft">("draft"),
    channelId: request.bundle.channel.id,
    state: "drafted",
    content: [
      `[${request.bundle.rubric.configuration.code}] ${request.bundle.detectedEvent.headline}`,
      "",
      request.bundle.detectedEvent.summary,
      "",
      `Sources: ${sourceSummary}`,
    ].join("\n"),
    modelVersion: request.modelVersion ?? "mock-llm-v1",
    lineage: {
      detectedEventId: request.bundle.detectedEvent.id,
      rubricId: request.bundle.rubric.id,
      promptTemplateId: request.bundle.promptTemplate.id,
      sourceItemIds: request.bundle.detectedEvent.sourceItemIds,
    },
    sourceAnchors: request.bundle.sourceAnchors,
    createdAt,
    updatedAt: createdAt,
  };
};

export const transitionDraftState = (
  draft: Draft,
  toState: EditorialLifecycleState,
): Draft => {
  assertDomainRule(
    canTransitionEditorialState(draft.state, toState),
    `Invalid editorial state transition: ${draft.state} -> ${toState}.`,
  );

  return {
    ...draft,
    state: toState,
    updatedAt: nowIso(),
  };
};

export const applyEditorialReview = (params: {
  readonly draft: Draft;
  readonly actorUserId: UserId;
  readonly action: ReviewActionType;
  readonly toState: EditorialLifecycleState;
  readonly notes?: string;
  readonly editedContent?: string;
}): { readonly draft: Draft; readonly review: EditorialReview } => {
  const reviewedAt = nowIso();
  assertDomainRule(
    canTransitionEditorialState(params.draft.state, params.toState),
    `Review cannot transition draft from ${params.draft.state} to ${params.toState}.`,
  );

  const nextDraft: Draft = {
    ...params.draft,
    state: params.toState,
    content: params.editedContent ?? params.draft.content,
    updatedAt: reviewedAt,
  };

  return {
    draft: nextDraft,
    review: {
      id: createEntityId<"EditorialReview">("review"),
      draftId: params.draft.id,
      actorUserId: params.actorUserId,
      action: params.action,
      fromState: params.draft.state,
      toState: params.toState,
      happenedAt: reviewedAt,
      notes: params.notes,
      editedContent: params.editedContent,
      createdAt: reviewedAt,
      updatedAt: reviewedAt,
    },
  };
};

export const createPublishJobIntent = (params: {
  readonly draft: Draft;
  readonly scheduledFor?: IsoDateTimeString;
}): PublishJob => {
  assertDomainRule(
    params.draft.state === "approved" || params.draft.state === "scheduled",
    "Publish intent can only be created from approved or scheduled drafts.",
  );

  const createdAt = nowIso();
  return {
    id: createEntityId<"PublishJob">("publish_job"),
    channelId: params.draft.channelId,
    draftId: params.draft.id,
    state: params.scheduledFor ? "scheduled" : "pending",
    scheduledFor: params.scheduledFor,
    idempotencyKey: `${params.draft.id}:${params.scheduledFor ?? "immediate"}`,
    attempts: 0,
    createdAt,
    updatedAt: createdAt,
  };
};

export const transitionPublishJobState = (
  publishJob: PublishJob,
  toState: PublishJobState,
): PublishJob => {
  assertDomainRule(
    canTransitionPublishJobState(publishJob.state, toState),
    `Invalid publish job transition: ${publishJob.state} -> ${toState}.`,
  );

  return {
    ...publishJob,
    state: toState,
    attempts:
      toState === "dispatching"
        ? publishJob.attempts + 1
        : publishJob.attempts,
    updatedAt: nowIso(),
  };
};

export const createPublishedPost = (params: {
  readonly publishJob: PublishJob;
  readonly draft: Draft;
  readonly telegramMessageId?: string;
}): PublishedPost => {
  assertDomainRule(
    params.publishJob.state === "published",
    "PublishedPost requires a publish job in published state.",
  );

  const createdAt = nowIso();
  return {
    id: createEntityId<"PublishedPost">("published_post"),
    channelId: params.draft.channelId,
    publishJobId: params.publishJob.id,
    telegramMessageId: params.telegramMessageId,
    publishedAt: createdAt,
    contentSnapshot: params.draft.content,
    lineage: {
      publishJobId: params.publishJob.id,
      sourceItemIds: params.draft.lineage.sourceItemIds,
      detectedEventId: params.draft.lineage.detectedEventId,
      rubricId: params.draft.lineage.rubricId,
      promptTemplateId: params.draft.lineage.promptTemplateId,
      draftId: params.draft.id,
    },
    createdAt,
    updatedAt: createdAt,
  };
};

export const collectLineageIds = (draft: Draft): readonly SourceItemId[] =>
  draft.lineage.sourceItemIds;

export const buildManualSubmissionObservedAt = (): IsoDateTimeString => nowIso();
