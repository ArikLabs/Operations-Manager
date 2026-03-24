import type {
  AuditEventId,
  ChannelId,
  DetectedEventId,
  DraftId,
  EditorialReviewId,
  FeedbackEventId,
  IsoDateTimeString,
  MetricSnapshotId,
  PromptTemplateId,
  PublishJobId,
  PublishedPostId,
  RubricId,
  SourceId,
  SourceItemId,
  UserId,
  VoiceProfileId,
} from "./identifiers.js";

export const STARTER_RUBRIC_CODES = ["breaking_news", "market_move"] as const;
export const EDITORIAL_LIFECYCLE_STATES = [
  "queued",
  "drafted",
  "in_review",
  "needs_revision",
  "approved",
  "scheduled",
  "published",
  "failed",
  "archived",
] as const;

export type SourceKind =
  | "manual"
  | "rss"
  | "market_api"
  | "news_api"
  | "telegram_source";

export type UserRole =
  | "owner_editor"
  | "analyst"
  | "reviewer"
  | "operations_manager"
  | "tenant_admin";

export type DraftKind =
  | "breaking_news"
  | "market_move"
  | "daily_digest"
  | "educational_explainer"
  | "what_it_means_for_investors"
  | "weekly_summary";

export type PublishMode = "review_required" | "urgent_review";
export type TriggerType = "event";
export type EditorialLifecycleState =
  (typeof EDITORIAL_LIFECYCLE_STATES)[number];
export type ReviewActionType =
  | "approve"
  | "edit"
  | "reject"
  | "regenerate"
  | "reschedule";
export type PublishJobState =
  | "pending"
  | "scheduled"
  | "dispatching"
  | "published"
  | "failed";
export type PromptTemplateStatus = "draft" | "active" | "retired";
export type FeedbackKind = "review_signal" | "publish_outcome";
export type AuditEntityType =
  | "channel"
  | "user"
  | "source"
  | "source_item"
  | "detected_event"
  | "rubric"
  | "prompt_template"
  | "draft"
  | "editorial_review"
  | "publish_job"
  | "published_post"
  | "voice_profile"
  | "feedback_event"
  | "metric_snapshot";

export type ChannelConfiguration = {
  readonly telegramChannelId: string;
  readonly timezone: string;
  readonly defaultPublishMode: PublishMode;
  readonly urgentPublishEnabled: boolean;
};

export type SourceConfiguration = {
  readonly sourceKind: SourceKind;
  readonly manualInputEnabled: boolean;
  readonly pollIntervalSeconds?: number;
  readonly externalIdentifierKey?: string;
};

export type RubricConfiguration = {
  readonly code: DraftKind;
  readonly purpose: string;
  readonly triggerType: TriggerType;
  readonly publishMode: PublishMode;
  readonly reviewChecklist: readonly string[];
};

export type VoiceProfileConfiguration = {
  readonly tone: string;
  readonly persona: string;
  readonly formattingRules: readonly string[];
  readonly bannedPhrases: readonly string[];
};

export type PromptVersionConfiguration = {
  readonly version: string;
  readonly modelFamily: string;
  readonly schemaVersion: string;
};

export type SafetyPolicyFlags = {
  readonly blockUnsupportedClaims: boolean;
  readonly blockRecommendationStyleOutput: boolean;
  readonly requireHumanReviewForHighRiskContent: boolean;
};

export type UrgencyScore = {
  readonly urgency: number;
  readonly relevance: number;
  readonly evidence: number;
  readonly confidence: number;
};

export type SourceAnchor = {
  readonly sourceItemId: SourceItemId;
  readonly sourceId: SourceId;
  readonly title?: string;
  readonly excerpt?: string;
  readonly url?: string;
  readonly observedAt: IsoDateTimeString;
};

export type AuditMetadata = {
  readonly createdAt: IsoDateTimeString;
  readonly updatedAt: IsoDateTimeString;
};

export type LineageReference = {
  readonly sourceItemIds: readonly SourceItemId[];
  readonly detectedEventId?: DetectedEventId;
  readonly rubricId?: RubricId;
  readonly promptTemplateId?: PromptTemplateId;
  readonly draftId?: DraftId;
  readonly editorialReviewId?: EditorialReviewId;
  readonly publishJobId?: PublishJobId;
  readonly publishedPostId?: PublishedPostId;
};

export interface Channel extends AuditMetadata {
  readonly id: ChannelId;
  readonly ownerUserId: UserId;
  readonly name: string;
  readonly configuration: ChannelConfiguration;
  readonly active: boolean;
}

export interface User extends AuditMetadata {
  readonly id: UserId;
  readonly role: UserRole;
  readonly displayName: string;
  readonly active: boolean;
}

export interface Source extends AuditMetadata {
  readonly id: SourceId;
  readonly channelId: ChannelId;
  readonly name: string;
  readonly configuration: SourceConfiguration;
  readonly active: boolean;
}

export interface SourceItem extends AuditMetadata {
  readonly id: SourceItemId;
  readonly channelId: ChannelId;
  readonly sourceId: SourceId;
  readonly externalId?: string;
  readonly title?: string;
  readonly body?: string;
  readonly observedAt: IsoDateTimeString;
  readonly normalizedAt?: IsoDateTimeString;
  readonly dedupeKey: string;
  readonly rawPayload: Readonly<Record<string, unknown>>;
}

export interface DetectedEvent extends AuditMetadata {
  readonly id: DetectedEventId;
  readonly channelId: ChannelId;
  readonly headline: string;
  readonly summary: string;
  readonly scores: UrgencyScore;
  readonly sourceAnchors: readonly SourceAnchor[];
  readonly sourceItemIds: readonly SourceItemId[];
}

export interface Rubric extends AuditMetadata {
  readonly id: RubricId;
  readonly channelId: ChannelId;
  readonly name: string;
  readonly configuration: RubricConfiguration;
  readonly active: boolean;
}

export interface PromptTemplate extends AuditMetadata {
  readonly id: PromptTemplateId;
  readonly rubricId: RubricId;
  readonly channelId: ChannelId;
  readonly status: PromptTemplateStatus;
  readonly configuration: PromptVersionConfiguration;
  readonly templateBody: string;
}

export interface VoiceProfile extends AuditMetadata {
  readonly id: VoiceProfileId;
  readonly channelId: ChannelId;
  readonly name: string;
  readonly configuration: VoiceProfileConfiguration;
}

export interface Draft extends AuditMetadata {
  readonly id: DraftId;
  readonly channelId: ChannelId;
  readonly state: EditorialLifecycleState;
  readonly content: string;
  readonly modelVersion: string;
  readonly lineage: LineageReference & {
    readonly detectedEventId: DetectedEventId;
    readonly rubricId: RubricId;
    readonly promptTemplateId: PromptTemplateId;
    readonly sourceItemIds: readonly SourceItemId[];
  };
  readonly sourceAnchors: readonly SourceAnchor[];
  readonly regeneratedFromDraftId?: DraftId;
}

export interface EditorialReview extends AuditMetadata {
  readonly id: EditorialReviewId;
  readonly draftId: DraftId;
  readonly actorUserId: UserId;
  readonly action: ReviewActionType;
  readonly fromState: EditorialLifecycleState;
  readonly toState: EditorialLifecycleState;
  readonly happenedAt: IsoDateTimeString;
  readonly notes?: string;
  readonly editedContent?: string;
}

export interface PublishJob extends AuditMetadata {
  readonly id: PublishJobId;
  readonly channelId: ChannelId;
  readonly draftId: DraftId;
  readonly state: PublishJobState;
  readonly scheduledFor?: IsoDateTimeString;
  readonly idempotencyKey: string;
  readonly attempts: number;
}

export interface PublishedPost extends AuditMetadata {
  readonly id: PublishedPostId;
  readonly channelId: ChannelId;
  readonly publishJobId: PublishJobId;
  readonly telegramMessageId?: string;
  readonly publishedAt: IsoDateTimeString;
  readonly contentSnapshot: string;
  readonly lineage: LineageReference & {
    readonly publishJobId: PublishJobId;
    readonly sourceItemIds: readonly SourceItemId[];
  };
}

export interface FeedbackEvent extends AuditMetadata {
  readonly id: FeedbackEventId;
  readonly channelId: ChannelId;
  readonly kind: FeedbackKind;
  readonly rubricId?: RubricId;
  readonly promptTemplateId?: PromptTemplateId;
  readonly draftId?: DraftId;
  readonly editorialReviewId?: EditorialReviewId;
  readonly publishedPostId?: PublishedPostId;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface MetricSnapshot extends AuditMetadata {
  readonly id: MetricSnapshotId;
  readonly channelId: ChannelId;
  readonly metricName: string;
  readonly metricScope: string;
  readonly recordedAt: IsoDateTimeString;
  readonly value: number;
}

export interface AuditEvent {
  readonly id: AuditEventId;
  readonly entityType: AuditEntityType;
  readonly entityId: string;
  readonly actorUserId?: UserId;
  readonly action: string;
  readonly happenedAt: IsoDateTimeString;
  readonly payload: Readonly<Record<string, unknown>>;
}

export type DetectedEventBundle = {
  readonly channel: Channel;
  readonly detectedEvent: DetectedEvent;
  readonly rubric: Rubric;
  readonly promptTemplate: PromptTemplate;
  readonly voiceProfile?: VoiceProfile;
  readonly safetyFlags: SafetyPolicyFlags;
  readonly sourceItems: readonly SourceItem[];
  readonly sourceAnchors: readonly SourceAnchor[];
};

export const ALLOWED_EDITORIAL_TRANSITIONS: Readonly<
  Record<EditorialLifecycleState, readonly EditorialLifecycleState[]>
> = {
  queued: ["drafted", "archived"],
  drafted: ["in_review", "archived"],
  in_review: ["needs_revision", "approved", "archived"],
  needs_revision: ["in_review", "archived"],
  approved: ["scheduled", "published", "archived"],
  scheduled: ["published", "failed", "archived"],
  published: ["archived"],
  failed: ["scheduled", "archived"],
  archived: [],
};

export const ALLOWED_PUBLISH_JOB_TRANSITIONS: Readonly<
  Record<PublishJobState, readonly PublishJobState[]>
> = {
  pending: ["scheduled", "dispatching", "failed"],
  scheduled: ["dispatching", "failed"],
  dispatching: ["published", "failed"],
  published: [],
  failed: ["scheduled", "dispatching"],
};

export const canTransitionEditorialState = (
  from: EditorialLifecycleState,
  to: EditorialLifecycleState,
): boolean => ALLOWED_EDITORIAL_TRANSITIONS[from].includes(to);

export const canTransitionPublishJobState = (
  from: PublishJobState,
  to: PublishJobState,
): boolean => ALLOWED_PUBLISH_JOB_TRANSITIONS[from].includes(to);
