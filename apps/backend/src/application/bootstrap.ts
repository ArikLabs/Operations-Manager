import { createEntityId, nowIso, type ChannelId, type UserId } from "../domain/identifiers.js";
import type {
  Channel,
  PromptTemplate,
  Rubric,
  Source,
  User,
  VoiceProfile,
} from "../domain/model.js";
import { InMemoryM1Store } from "./store.js";

export type M1BootstrapSeed = {
  readonly channel: Channel;
  readonly ownerEditor: User;
  readonly manualSource: Source;
  readonly rubrics: readonly Rubric[];
  readonly prompts: readonly PromptTemplate[];
  readonly voiceProfile: VoiceProfile;
};

export const createM1BootstrapSeed = (): M1BootstrapSeed => {
  const timestamp = nowIso();
  const channelId = createEntityId<"Channel">("channel");
  const ownerId = createEntityId<"User">("user");
  const manualSourceId = createEntityId<"Source">("source");

  const ownerEditor: User = {
    id: ownerId,
    role: "owner_editor",
    displayName: "Owner Editor",
    active: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const channel: Channel = {
    id: channelId,
    ownerUserId: ownerEditor.id,
    name: "Ukrainian Investor",
    active: true,
    configuration: {
      telegramChannelId: "@ukrainian_investor",
      timezone: "Europe/Kiev",
      defaultPublishMode: "review_required",
      urgentPublishEnabled: true,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const manualSource: Source = {
    id: manualSourceId,
    channelId: channel.id,
    name: "manual_input",
    active: true,
    configuration: {
      sourceKind: "manual",
      manualInputEnabled: true,
      externalIdentifierKey: "external_id",
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const breakingNewsRubric: Rubric = {
    id: createEntityId<"Rubric">("rubric"),
    channelId: channel.id,
    name: "Breaking News",
    active: true,
    configuration: {
      code: "breaking_news",
      purpose: "Fast high-signal updates with context.",
      triggerType: "event",
      publishMode: "urgent_review",
      reviewChecklist: [
        "Confirm source attribution",
        "Check unsupported claims",
        "Verify no recommendation-like phrasing",
      ],
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const marketMoveRubric: Rubric = {
    id: createEntityId<"Rubric">("rubric"),
    channelId: channel.id,
    name: "Market Move",
    active: true,
    configuration: {
      code: "market_move",
      purpose: "Structured market move explanation with impact framing.",
      triggerType: "event",
      publishMode: "review_required",
      reviewChecklist: [
        "Confirm numbers and units",
        "Frame implications as analysis",
        "Avoid explicit buy/sell language",
      ],
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const prompts: PromptTemplate[] = [
    {
      id: createEntityId<"PromptTemplate">("prompt"),
      rubricId: breakingNewsRubric.id,
      channelId: channel.id,
      status: "active",
      configuration: {
        version: "v1.0.0",
        modelFamily: "mock-llm",
        schemaVersion: "m1",
      },
      templateBody:
        "Produce concise breaking-news draft with source anchors and uncertainty disclosure.",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: createEntityId<"PromptTemplate">("prompt"),
      rubricId: marketMoveRubric.id,
      channelId: channel.id,
      status: "active",
      configuration: {
        version: "v1.0.0",
        modelFamily: "mock-llm",
        schemaVersion: "m1",
      },
      templateBody:
        "Produce market-move draft with movement summary, drivers, and investor implications.",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  const voiceProfile: VoiceProfile = {
    id: createEntityId<"VoiceProfile">("voice"),
    channelId: channel.id,
    name: "default",
    configuration: {
      tone: "clear, concise, analytical",
      persona: "owner_editor",
      formattingRules: ["short paragraphs", "facts before interpretation"],
      bannedPhrases: ["guaranteed profit", "must buy now"],
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    channel,
    ownerEditor,
    manualSource,
    rubrics: [breakingNewsRubric, marketMoveRubric],
    prompts,
    voiceProfile,
  };
};

export const bootstrapM1Store = (
  store: InMemoryM1Store,
  seed: M1BootstrapSeed = createM1BootstrapSeed(),
): M1BootstrapSeed => {
  store.upsertUser(seed.ownerEditor);
  store.upsertChannel(seed.channel);
  store.upsertSource(seed.manualSource);
  for (const rubric of seed.rubrics) {
    store.upsertRubric(rubric);
  }
  for (const prompt of seed.prompts) {
    store.upsertPromptTemplate(prompt);
  }
  store.upsertVoiceProfile(seed.voiceProfile);

  return seed;
};

export const createManualBoundaryContext = (): {
  readonly store: InMemoryM1Store;
  readonly channelId: ChannelId;
  readonly ownerEditorId: UserId;
  readonly sourceId: Source["id"];
} => {
  const store = new InMemoryM1Store();
  const seed = bootstrapM1Store(store);
  return {
    store,
    channelId: seed.channel.id,
    ownerEditorId: seed.ownerEditor.id,
    sourceId: seed.manualSource.id,
  };
};
