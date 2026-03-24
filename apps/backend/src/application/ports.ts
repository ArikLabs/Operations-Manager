import type {
  AuditEvent,
  DetectedEvent,
  DetectedEventBundle,
  Draft,
  EditorialReview,
  PublishJob,
  PublishedPost,
  SafetyPolicyFlags,
  Source,
  SourceAnchor,
  SourceItem,
} from "../domain/model.js";
import type {
  DraftId,
  IsoDateTimeString,
  PublishedPostId,
  SourceId,
  SourceItemId,
} from "../domain/identifiers.js";

export type ManualSourceSubmission = {
  readonly sourceId: SourceId;
  readonly externalId?: string;
  readonly title?: string;
  readonly body?: string;
  readonly rawPayload?: Readonly<Record<string, unknown>>;
  readonly observedAt: IsoDateTimeString;
};

export type NormalizedSourceItem = {
  readonly source: Source;
  readonly sourceItem: SourceItem;
};

export type DraftGenerationRequest = {
  readonly bundle: DetectedEventBundle;
  readonly preferredModel?: string;
};

export type DraftGenerationResult = {
  readonly draft: Draft;
  readonly auditEvents: readonly AuditEvent[];
};

export type PublishIntentRequest = {
  readonly draft: Draft;
  readonly safetyFlags: SafetyPolicyFlags;
};

export type PublishDispatchResult = {
  readonly publishJob: PublishJob;
  readonly publishedPost?: PublishedPost;
  readonly auditEvents: readonly AuditEvent[];
};

export type ReviewDecisionRequest = {
  readonly review: EditorialReview;
  readonly resultingDraft?: Draft;
};

export type DuplicateDetectionRequest = {
  readonly candidate: SourceItem;
  readonly recentSourceItems: readonly SourceItem[];
};

export type DuplicateDetectionResult = {
  readonly duplicateOf?: SourceItemId;
  readonly fingerprint: string;
};

export interface ClockPort {
  now(): IsoDateTimeString;
}

export interface SourceConnectorPort {
  readonly kind: Source["configuration"]["sourceKind"];
  normalize(submission: ManualSourceSubmission): Promise<NormalizedSourceItem>;
}

export interface DuplicateDetectorPort {
  detect(request: DuplicateDetectionRequest): Promise<DuplicateDetectionResult>;
}

export interface DetectedEventFactoryPort {
  create(sourceItems: readonly SourceItem[], anchors: readonly SourceAnchor[]): Promise<DetectedEvent>;
}

export interface DraftGeneratorPort {
  generateDraft(request: DraftGenerationRequest): Promise<DraftGenerationResult>;
}

export interface EditorialWorkflowPort {
  review(request: ReviewDecisionRequest): Promise<readonly AuditEvent[]>;
}

export interface TelegramPublishPort {
  createIntent(request: PublishIntentRequest): Promise<PublishDispatchResult>;
  dispatch(job: PublishJob): Promise<PublishDispatchResult>;
}

export interface AuditSinkPort {
  append(events: readonly AuditEvent[]): Promise<void>;
}

export interface PublishedPostReaderPort {
  getById(id: PublishedPostId): Promise<PublishedPost | null>;
}
