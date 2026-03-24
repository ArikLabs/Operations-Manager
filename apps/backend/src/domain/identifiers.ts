import { randomUUID } from "node:crypto";

export type EntityId<Brand extends string> = string & { readonly __brand: Brand };
export type IsoDateTimeString = string & { readonly __brand: "IsoDateTimeString" };

export type ChannelId = EntityId<"Channel">;
export type UserId = EntityId<"User">;
export type SourceId = EntityId<"Source">;
export type SourceItemId = EntityId<"SourceItem">;
export type DetectedEventId = EntityId<"DetectedEvent">;
export type RubricId = EntityId<"Rubric">;
export type PromptTemplateId = EntityId<"PromptTemplate">;
export type DraftId = EntityId<"Draft">;
export type EditorialReviewId = EntityId<"EditorialReview">;
export type PublishJobId = EntityId<"PublishJob">;
export type PublishedPostId = EntityId<"PublishedPost">;
export type VoiceProfileId = EntityId<"VoiceProfile">;
export type FeedbackEventId = EntityId<"FeedbackEvent">;
export type MetricSnapshotId = EntityId<"MetricSnapshot">;
export type AuditEventId = EntityId<"AuditEvent">;

export const asEntityId = <Brand extends string>(value: string): EntityId<Brand> =>
  value as EntityId<Brand>;

export const createEntityId = <Brand extends string>(
  prefix: string,
): EntityId<Brand> => `${prefix}_${randomUUID()}` as EntityId<Brand>;

export const asIsoDateTime = (value: string): IsoDateTimeString =>
  value as IsoDateTimeString;

export const nowIso = (): IsoDateTimeString =>
  new Date().toISOString() as IsoDateTimeString;
