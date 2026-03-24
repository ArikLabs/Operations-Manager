# Telegram Operations Manager Specification
''
This file is the canonical product and architecture specification for the repository. Use it with `docs/delivery/decision-log.md` and `docs/delivery/execution.md`.

## 1. Executive Summary

Telegram Operations Manager is an internal-first content operations system for one owner-editor running one Telegram destination channel. Its job is to reduce repetitive editorial work while keeping speed, traceability, and human control intact.

The core product loop is:

`source ingestion -> detected event -> rubric match -> draft generation -> editorial review -> publish intent -> Telegram post -> analytics and feedback`

The system is not a trading engine, a portfolio manager, or an autonomous publisher by default.

## 2. Product Principles

- Internal-first before SaaS-first.
- Telegram-only before multi-platform.
- Human-in-the-loop before autopilot.
- Source quality before model cleverness.
- Rubrics before ad hoc posting.
- Traceability before automation depth.
- Informational analysis before recommendation-style content.

## 3. MVP Boundary

### Must hold for MVP

- one owner-editor workflow
- one Telegram destination channel
- Telegram publishing only
- source-first ingestion using a practical starter set such as manual input, RSS feeds, and market or news APIs
- event detection with urgency, relevance, and evidence scoring
- rubric-based draft generation with prompt versioning
- editorial review with approve, edit, reject, regenerate, and reschedule actions
- scheduling and urgent publish paths
- audit trail for source lineage, draft lineage, review actions, and publish outcomes
- operational analytics for speed, quality, reliability, and feedback loops

### Should fit if capacity allows

- Telegram channels as source inputs after simpler connectors are stable
- low-risk auto-publish for tightly bounded cases
- richer voice profile management
- post variants within the same rubric
- semantic deduplication beyond exact-match suppression
- source confidence indicators and unsupported-claim flagging

### Out of scope

- full autopilot across all rubrics
- multi-channel publishing
- multi-tenant account model
- billing and SaaS administration
- chart generation and rich visual asset tooling
- A/B testing infrastructure
- mobile apps
- explicit trading recommendations, portfolio management, or execution signals

### Default rubric catalog

- Breaking News
- Market Move
- Daily Digest
- Educational Explainer
- What It Means for Investors
- Weekly Summary

### Starter rubrics for the first coding slice

- Breaking News
- Market Move

## 4. User, Problem, And Core Jobs

### Primary user

The MVP user is one owner-editor operating the "Ukrainian Investor" Telegram channel. This person selects sources, defines rubric strategy, reviews drafts, edits copy, schedules posts, and evaluates performance.

### Later users

- analyst or reviewer
- editor
- operations manager
- SaaS tenant admin

### Problem statement

Telegram channel operations are fragmented across source monitoring, event triage, writing, editing, scheduling, publishing, and performance review. That fragmentation slows reaction time, creates inconsistent output, and forces the owner to spend time on repetitive work.

### Core jobs to be done

- detect investor-relevant developments quickly
- turn raw events into channel-ready drafts with less manual work
- maintain a consistent editorial voice across rubrics
- keep review control for risky or nuanced content
- learn which rubrics, sources, and prompts actually perform

## 5. Functional Requirements

### Source and event intelligence

- Support a source-first ingestion model.
- Normalize source items into a common record before drafting.
- Deduplicate repeated items before downstream workflow.
- Score each detected event by urgency, relevance, and evidence quality.
- Route one detected event into one or more rubrics when appropriate.
- Preserve provenance for every input and every downstream artifact.
- Distinguish signal from noise before invoking the LLM layer.

### Rubric and draft generation

- Generate rubric-specific drafts from structured event context.
- Keep prompts rubric-specific and versioned.
- Track prompt version and model version on every generated draft.
- Make source anchors inspectable during review.
- Keep regeneration tied to the same detected event and rubric context.

### Editorial workflow

- Moderation is the default publish mode.
- The owner-editor can approve, edit, reject, regenerate, or reschedule a draft.
- Breaking News may take a shorter path, but not a safety bypass.
- Human edits and review actions are first-class feedback signals.

### Publishing and operations

- Publish only to Telegram in MVP.
- Support manual, scheduled, and urgent publish paths.
- Keep publish attempts auditable and retryable.
- Enforce idempotency to avoid duplicate intended outcomes.

### Analytics and feedback

- Track the workflow as a funnel, not as isolated events.
- Measure speed, quality, reliability, and post-performance where available.
- Preserve lineage from source item to published post.
- Capture feedback by rubric, source lineage, prompt version, and editorial decision.

### Safety and policy

- Default to informational analysis, not recommendation-style output.
- Block unsupported claims from being treated as facts.
- Keep high-risk content inside a human review path.
- Surface uncertainty when evidence is weak or conflicting.

## 6. System Architecture

### Boundary and shape

- Start with one deployable backend boundary and explicit internal seams.
- Treat source adapters, LLM providers, and Telegram publishing as replaceable edges.
- Use asynchronous processing for ingestion, detection, drafting, and publishing.
- Keep one operational datastore as the canonical system of record in MVP.
- Design state transitions and internal contracts so later extraction into services is mechanical rather than disruptive.

### Core modules

| Module | Responsibility |
| --- | --- |
| Source and Event Intelligence | source registry, ingestion, normalization, deduplication, scoring, detected-event creation |
| Rubrics and Prompting | rubric configuration, prompt versioning, routing rules, voice constraints |
| Draft Generation | structured detected-event bundle assembly, model orchestration, generation metadata |
| Editorial Workflow | review queue, review actions, revision control, state transitions, feedback capture |
| Publishing and Operations | publish intent, scheduling, idempotency, retry semantics, Telegram adapter boundary |
| Analytics and Audit | funnel metrics, lineage queries, timestamps, audit events, feedback interpretation |
| Admin Control Plane | channel configuration, source management, rubric policy, operational settings |

### Core flow

1. A configured source produces one or more source items.
2. Source items are normalized and deduplicated.
3. The system creates a detected event with urgency, relevance, confidence, and supporting evidence.
4. Rubric rules decide whether that event should produce drafts.
5. The LLM layer receives structured inputs only and creates rubric-specific drafts.
6. The owner-editor reviews, edits, rejects, regenerates, or approves drafts.
7. Approved drafts produce publish intent and then Telegram posts.
8. Audit, metrics, and feedback complete the loop.

## 7. Domain Model And Invariants

### Canonical entities

| Entity | Role |
| --- | --- |
| Channel | Telegram destination channel configuration |
| User | owner-editor and future reviewer identity |
| Source | configured input such as RSS, market API, Telegram source, or manual input |
| SourceItem | raw or normalized item received from a source |
| DetectedEvent | scored event derived from one or more source items |
| Rubric | editorial template and routing rule set |
| PromptTemplate | versioned prompt definition bound to a rubric |
| Draft | rubric-specific generated content candidate |
| EditorialReview | review action record including edits, rejection, or approval |
| PublishJob | publish attempt and retry record |
| PublishedPost | canonical record of what was actually sent |
| VoiceProfile | style and formatting rules for the channel |
| FeedbackEvent | structured learning signal from review or outcome |
| MetricSnapshot | materialized analytics observation |
| AuditEvent | immutable trace of notable actions and state changes |

### Required lineage chain

`SourceItem -> DetectedEvent -> Draft -> EditorialReview -> PublishJob -> PublishedPost`

Lineage must remain queryable, timestamped, and attributable to source evidence, rubric, prompt version, model version, and reviewer action.

### Editorial lifecycle states

- queued
- drafted
- in_review
- needs_revision
- approved
- scheduled
- published
- failed
- archived

### Core invariants

- Every draft must reference its triggering event and rubric.
- Every published post must be traceable to at least one source item.
- Every review action must capture actor, timestamp, and action type.
- Prompt version and model version must remain attached to generated artifacts.
- Publish operations must be retryable without creating duplicate intended outcomes.
- High-risk content must not bypass human review by default.

## 8. Operating Rules

### Source and event rules

- No LLM call should happen against raw feed data.
- Deduplication must happen before event detection and draft generation.
- Multiple sources supporting the same event should increase confidence rather than create duplicate queue entries.
- Detected events should be explainable through rules, scores, and contributing source items.

### LLM layer rules

- The LLM layer is a draft engine, not the product's decision-maker.
- Prompt inputs must be structured facts, not raw feeds.
- Prompt versions are durable and explicit.
- Output format should be stable enough for review and analytics.
- Human edits are feedback, not disposable noise.

### Editorial and publishing rules

- Human review is a normal workflow state, not an exception path.
- Regeneration preserves source bundle and rubric context.
- Publish behavior must be idempotent and auditable.
- Retry and failure visibility matter before rich automation does.

### Safety rules

- No explicit buy or sell signals by default.
- No unsupported claims presented as fact.
- No high-risk publish path without review.
- Financial implications should be framed as analysis, not instruction.

### Analytics rules

- Metrics should answer whether the system saves time, improves speed, and preserves quality.
- Latency is a product KPI, not only an operational metric.
- Approval rate, rejection rate, regenerate rate, and edit distance are the main MVP quality signals.
- Metrics should have one documented source of truth.

## 9. Technology Direction

Technology choices remain recommendations, not locked requirements. Use the latest stable versions at implementation time and change only if the replacement preserves the architecture and domain rules above.

| Layer | Recommended direction | Why |
| --- | --- | --- |
| Backend | Node.js + TypeScript inside one modular backend boundary | fast iteration and clean internal seams |
| Framework | NestJS or equivalent modular backend framework | adapter boundaries, validation, queue support |
| Primary datastore | PostgreSQL with a relational schema and JSON metadata where useful | lineage, audit, and workflow invariants fit a relational model |
| ORM | Prisma or equivalent schema-aware tooling | type safety and maintainability |
| Queue and cache | Redis with a queue layer such as BullMQ | retries, scheduling, and low operational overhead |
| Internal eventing | in-process events first, external messaging later if needed | matches one-backend MVP |
| LLM providers | provider abstraction with OpenAI-first, multi-provider-ready design | avoid lock-in without broadening MVP scope |
| Telegram publish edge | Bot API-based publishing boundary | simplest reliable MVP publish path |
| Frontend | minimal internal admin UI using a modern React stack if needed | internal workflow first, not polished SaaS UX |
| Deployment | simple containerized internal deployment | keep operations overhead low during MVP learning |

## 10. Success Metrics And Initial Targets

| Metric family | Core measure | Initial target |
| --- | --- | --- |
| Workflow speed | Breaking News event-to-draft latency | under 3 minutes in normal conditions |
| Workflow speed | Breaking News event-to-publish latency with review | under 10 minutes |
| Editorial quality | approval rate without major rewrite | at least 60 percent once prompts stabilize |
| Editorial quality | rejection and regenerate rate by rubric | low enough to show time savings, tracked from day one |
| Workflow reliability | duplicate suppression and failed publish rate | high suppression, low failure, always measurable |
| Content performance | post reach and engagement where available | informative signal, not primary MVP success proof |

## 11. Major Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Source noise overwhelms review | start with curated sources, dedupe early, measure queue quality |
| Draft quality is too generic | keep rubrics narrow, version prompts, capture structured edits |
| Breaking News workflow becomes unsafe | enforce evidence thresholds and review gates |
| Telegram connector complexity delays MVP | sequence manual input, RSS, and simpler APIs first |
| Architecture overbuild slows delivery | keep one backend boundary and no premature service split |
| Analytics arrive too late to prove value | define lineage and metrics before implementation expands |
| Implementation starts at the integration edge | begin with domain spine and mocked edges |

## 12. Roadmap

### Phase 0 - Planning baseline

Establish canonical specs, execution rules, and a repo structure that can support serious implementation.

### Phase 1 - Foundations

Freeze the domain spine, workflow states, configuration models, adapter boundaries, and first implementation sequence.

### Phase 2 - Internal MVP build

Implement the one-owner-editor, one-channel, Telegram-only workflow starting from domain truth rather than live integrations.

### Phase 3 - Stabilization

Improve reliability, latency, duplicate suppression, and editorial quality until the workflow is trusted for daily use.

### Phase 4 - Expansion readiness

Prepare for more channels, richer roles, and selective automation without breaking the MVP domain model.

## 13. Open Questions

- Which live source connector should be first after the manual input path is proven?
- What minimum evidence threshold should Breaking News require before draft generation?
- Which Telegram performance signals are dependable enough for early analytics?
- How much rubric customization is necessary before the first UI and backend build become too broad?
- Which limited auto-publish cases, if any, are acceptable after the workflow proves reliable?
