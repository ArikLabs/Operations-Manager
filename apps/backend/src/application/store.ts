import type {
  AuditEvent,
  Channel,
  DetectedEvent,
  Draft,
  EditorialReview,
  PromptTemplate,
  PublishJob,
  PublishedPost,
  Rubric,
  Source,
  SourceItem,
  User,
  VoiceProfile,
} from "../domain/model.js";
import type {
  ChannelId,
  DetectedEventId,
  DraftId,
  PromptTemplateId,
  PublishJobId,
  RubricId,
  SourceId,
  SourceItemId,
  UserId,
  VoiceProfileId,
} from "../domain/identifiers.js";

const addToMultiMap = <K extends string, V extends string>(
  map: Map<K, Set<V>>,
  key: K,
  value: V,
): void => {
  const current = map.get(key);
  if (current) {
    current.add(value);
    return;
  }

  map.set(key, new Set([value]));
};

export class InMemoryM1Store {
  private readonly channels = new Map<ChannelId, Channel>();
  private readonly users = new Map<UserId, User>();
  private readonly sources = new Map<SourceId, Source>();
  private readonly sourceItems = new Map<SourceItemId, SourceItem>();
  private readonly detectedEvents = new Map<DetectedEventId, DetectedEvent>();
  private readonly rubrics = new Map<RubricId, Rubric>();
  private readonly promptTemplates = new Map<PromptTemplateId, PromptTemplate>();
  private readonly voiceProfiles = new Map<VoiceProfileId, VoiceProfile>();
  private readonly drafts = new Map<DraftId, Draft>();
  private readonly editorialReviews = new Map<string, EditorialReview>();
  private readonly publishJobs = new Map<PublishJobId, PublishJob>();
  private readonly publishedPosts = new Map<string, PublishedPost>();
  private readonly auditEvents: AuditEvent[] = [];

  private readonly sourceItemByDedupeKey = new Map<string, SourceItemId>();
  private readonly detectedEventByDedupeKey = new Map<string, DetectedEventId>();
  private readonly draftByEventRubricKey = new Map<string, DraftId>();
  private readonly publishJobByIdempotencyKey = new Map<string, PublishJobId>();
  private readonly publishedPostByPublishJobId = new Map<PublishJobId, string>();

  private readonly draftIdsByDetectedEvent = new Map<DetectedEventId, Set<DraftId>>();
  private readonly sourceItemIdsByDetectedEvent = new Map<DetectedEventId, Set<SourceItemId>>();

  upsertChannel(channel: Channel): void {
    this.channels.set(channel.id, channel);
  }

  upsertUser(user: User): void {
    this.users.set(user.id, user);
  }

  upsertSource(source: Source): void {
    this.sources.set(source.id, source);
  }

  upsertRubric(rubric: Rubric): void {
    this.rubrics.set(rubric.id, rubric);
  }

  upsertPromptTemplate(promptTemplate: PromptTemplate): void {
    this.promptTemplates.set(promptTemplate.id, promptTemplate);
  }

  upsertVoiceProfile(voiceProfile: VoiceProfile): void {
    this.voiceProfiles.set(voiceProfile.id, voiceProfile);
  }

  upsertSourceItem(sourceItem: SourceItem): void {
    this.sourceItems.set(sourceItem.id, sourceItem);
    this.sourceItemByDedupeKey.set(sourceItem.dedupeKey, sourceItem.id);
  }

  upsertDetectedEvent(event: DetectedEvent, dedupeKey: string): void {
    this.detectedEvents.set(event.id, event);
    this.detectedEventByDedupeKey.set(dedupeKey, event.id);
    for (const sourceItemId of event.sourceItemIds) {
      addToMultiMap(this.sourceItemIdsByDetectedEvent, event.id, sourceItemId);
    }
  }

  upsertDraft(draft: Draft): void {
    this.drafts.set(draft.id, draft);
    const eventRubricKey = `${draft.lineage.detectedEventId}:${draft.lineage.rubricId}`;
    this.draftByEventRubricKey.set(eventRubricKey, draft.id);
    addToMultiMap(this.draftIdsByDetectedEvent, draft.lineage.detectedEventId, draft.id);
  }

  upsertEditorialReview(review: EditorialReview): void {
    this.editorialReviews.set(review.id, review);
  }

  upsertPublishJob(publishJob: PublishJob): void {
    this.publishJobs.set(publishJob.id, publishJob);
    this.publishJobByIdempotencyKey.set(
      publishJob.idempotencyKey,
      publishJob.id,
    );
  }

  upsertPublishedPost(post: PublishedPost): void {
    this.publishedPosts.set(post.id, post);
    this.publishedPostByPublishJobId.set(post.publishJobId, post.id);
  }

  appendAuditEvents(events: readonly AuditEvent[]): void {
    this.auditEvents.push(...events);
  }

  getChannel(channelId: ChannelId): Channel | undefined {
    return this.channels.get(channelId);
  }

  getUser(userId: UserId): User | undefined {
    return this.users.get(userId);
  }

  getSource(sourceId: SourceId): Source | undefined {
    return this.sources.get(sourceId);
  }

  getSourceItem(sourceItemId: SourceItemId): SourceItem | undefined {
    return this.sourceItems.get(sourceItemId);
  }

  getSourceItemByDedupeKey(dedupeKey: string): SourceItem | undefined {
    const sourceItemId = this.sourceItemByDedupeKey.get(dedupeKey);
    return sourceItemId ? this.sourceItems.get(sourceItemId) : undefined;
  }

  getDetectedEventById(eventId: DetectedEventId): DetectedEvent | undefined {
    return this.detectedEvents.get(eventId);
  }

  getDetectedEventByDedupeKey(dedupeKey: string): DetectedEvent | undefined {
    const eventId = this.detectedEventByDedupeKey.get(dedupeKey);
    return eventId ? this.detectedEvents.get(eventId) : undefined;
  }

  listSourceItemsByIds(sourceItemIds: readonly SourceItemId[]): SourceItem[] {
    return sourceItemIds
      .map((sourceItemId) => this.sourceItems.get(sourceItemId))
      .filter((sourceItem): sourceItem is SourceItem => Boolean(sourceItem));
  }

  listSourceItemsForDetectedEvent(eventId: DetectedEventId): SourceItem[] {
    const ids = this.sourceItemIdsByDetectedEvent.get(eventId);
    if (!ids) {
      return [];
    }

    return Array.from(ids)
      .map((sourceItemId) => this.sourceItems.get(sourceItemId))
      .filter((sourceItem): sourceItem is SourceItem => Boolean(sourceItem));
  }

  listActiveRubricsForChannel(channelId: ChannelId): Rubric[] {
    return Array.from(this.rubrics.values()).filter(
      (rubric) => rubric.channelId === channelId && rubric.active,
    );
  }

  getActivePromptTemplateForRubric(rubricId: RubricId): PromptTemplate | undefined {
    return Array.from(this.promptTemplates.values()).find(
      (promptTemplate) =>
        promptTemplate.rubricId === rubricId && promptTemplate.status === "active",
    );
  }

  getDefaultVoiceProfileForChannel(channelId: ChannelId): VoiceProfile | undefined {
    return Array.from(this.voiceProfiles.values()).find(
      (voiceProfile) => voiceProfile.channelId === channelId,
    );
  }

  getDraft(draftId: DraftId): Draft | undefined {
    return this.drafts.get(draftId);
  }

  getDraftForEventRubric(
    detectedEventId: DetectedEventId,
    rubricId: RubricId,
  ): Draft | undefined {
    const key = `${detectedEventId}:${rubricId}`;
    const draftId = this.draftByEventRubricKey.get(key);
    return draftId ? this.drafts.get(draftId) : undefined;
  }

  listDraftsForDetectedEvent(detectedEventId: DetectedEventId): Draft[] {
    const draftIds = this.draftIdsByDetectedEvent.get(detectedEventId);
    if (!draftIds) {
      return [];
    }

    return Array.from(draftIds)
      .map((draftId) => this.drafts.get(draftId))
      .filter((draft): draft is Draft => Boolean(draft));
  }

  getPublishJobByIdempotencyKey(idempotencyKey: string): PublishJob | undefined {
    const publishJobId = this.publishJobByIdempotencyKey.get(idempotencyKey);
    return publishJobId ? this.publishJobs.get(publishJobId) : undefined;
  }

  getPublishJobById(publishJobId: PublishJobId): PublishJob | undefined {
    return this.publishJobs.get(publishJobId);
  }

  getPublishedPostByPublishJobId(
    publishJobId: PublishJobId,
  ): PublishedPost | undefined {
    const publishedPostId = this.publishedPostByPublishJobId.get(publishJobId);
    return publishedPostId ? this.publishedPosts.get(publishedPostId) : undefined;
  }

  getAuditEvents(): readonly AuditEvent[] {
    return this.auditEvents;
  }
}
