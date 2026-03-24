# Execution Model

This file is the canonical delivery and implementation-planning guide for the repository. Use it with `docs/specification.md` and `docs/delivery/decision-log.md`.

## 1. Workstreams

| Workstream | Focus |
| --- | --- |
| Product and Scope | vision, PRD quality, rubric strategy, MVP boundaries |
| Source and Event Intelligence | source selection, normalization, deduplication, scoring, event detection |
| Editorial Workflow and LLM Layer | draft generation, prompt contracts, review states, voice controls, feedback capture |
| Publishing and Operations | scheduling, publish reliability, idempotency, incident handling, Telegram delivery |
| Data and Analytics | lineage, KPI taxonomy, event model, observability, operational reporting |
| Safety and Policy | content risk rules, approval policies, auditability, escalation criteria |
| Platform Evolution | multi-channel readiness, adapter extensibility, future tenant-aware boundaries |

## 2. Phase Model

| Phase | Goal | Exit condition |
| --- | --- | --- |
| Phase 0 - Planning baseline | establish canonical docs and repo operating rules | the repo supports structured planning without ambiguity |
| Phase 1 - Foundations | freeze domain spine, workflow states, configuration model, and adapter boundaries | the repo can start coding with explicit gates and acceptance criteria |
| Phase 2 - Internal MVP build | implement the one-owner-editor Telegram workflow | the owner can run the core loop with real review controls |
| Phase 3 - Stabilization | improve reliability, latency, and editorial quality | the workflow is trusted for daily operations |
| Phase 4 - Expansion readiness | prepare for selective automation and broader scope | the system can grow without reworking its core domain |

## 3. Milestones

| Milestone | Meaning |
| --- | --- |
| M0 - Repo ready for implementation planning | canonical docs, operating rules, and first build direction exist |
| M1 - Build plan approved | first coding sequence, dependencies, and gates are explicit |
| M2 - Source-to-draft spine designed | source, event, rubric, and draft flow are specified tightly enough to build |
| M3 - Editorial and publish workflow designed | review states, publish semantics, and recovery rules are explicit |
| M4 - MVP ready for internal trial | one owner-editor can run the workflow on one Telegram destination channel |
| M5 - MVP trusted for daily use | baseline latency, approval rate, and publish reliability are good enough for daily reliance |

## 4. Active Delivery Risks

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| R1 - Source noise overwhelms editorial workflow | high | medium | start with curated sources, dedupe early, measure queue quality |
| R2 - Draft quality is too generic to save time | high | medium | keep rubrics narrow, version prompts, capture edit feedback |
| R3 - Breaking News workflow is fast but unsafe | high | medium | enforce evidence thresholds, fast-lane review gates, conservative policy |
| R4 - Telegram connector complexity delays MVP | medium | medium | sequence simpler connectors first and keep Telegram sources optional early |
| R5 - Architecture overbuild slows delivery | medium | high | keep one backend boundary and avoid speculative platform work |
| R6 - Analytics are added too late to prove value | medium | medium | define lineage and metrics before implementation expands |
| R7 - Implementation starts at the integration edge | high | medium | build domain spine, workflow states, and adapter boundaries before live edges |

## 5. Quality Gates

### Architecture Gate

Applies when a task introduces new modules, boundaries, integrations, or deployment assumptions.

Must be true:
- affected architecture and product sections in `docs/specification.md` are aligned
- module boundaries are explicit
- adapter boundaries are clear
- no premature service split is introduced without justification

Evidence required:
- plan references to affected sections
- updated canonical docs
- unresolved questions listed explicitly

### Domain Model Gate

Applies when a task changes entities, lifecycle states, lineage, or persistence assumptions.

Must be true:
- entities and relationships are named consistently
- workflow states are explicit
- invariants and lineage rules are documented

Evidence required:
- updated domain sections in `docs/specification.md`
- impacted workflow or analytics updates
- decision-log update if the change is durable

### Workflow Gate

Applies when a task changes detected-event handling, draft review, scheduling, or publishing behavior.

Must be true:
- state transitions are unambiguous
- review actions are defined
- failure and retry behavior is covered
- human review remains intact for high-risk content

Evidence required:
- updated workflow sections in `docs/specification.md`
- validation path for normal, urgent, and failed flows

### Safety Gate

Applies when a task increases automation depth, changes publish policy, or changes financial-content behavior.

Must be true:
- high-risk content rules are documented
- unsupported claims are blocked or escalated
- publish restrictions and manual overrides remain clear

Evidence required:
- updated safety sections in `docs/specification.md`
- risk posture update if it changed
- documented reviewer path for risky cases

### Observability Gate

Applies when a task introduces async work, background processing, or publish-side effects.

Must be true:
- state transitions are timestamped
- audit events are defined
- failure visibility exists
- core success metrics can still be measured

Evidence required:
- analytics and execution docs updated
- clear list of timestamps, events, and failure signals

### Release Readiness Gate

Applies when work is proposed for internal trial or milestone completion.

Must be true:
- milestone acceptance criteria are met
- open risks are known and accepted
- manual validation has been performed for core workflows
- docs reflect the implemented behavior

Evidence required:
- milestone mapping
- validation summary
- unresolved issues list

## 6. Implementation Entrypoint

### Recommended first implementation workstreams

Start with Source and Event Intelligence plus Editorial Workflow and LLM Layer foundations inside one backend boundary. The goal is to establish the domain spine before integrating live connectors or model providers.

### Recommended early sequencing

1. Freeze the domain spine.
2. Freeze workflow states and review actions.
3. Define configuration models for channel, source, rubric, voice profile, prompt version, and policy flags.
4. Define audit and lineage requirements.
5. Define adapter boundaries for source connectors, LLM providers, and Telegram publishing.
6. Only then begin live ingestion, generation, publishing, and analytics implementation.

### What must exist before source ingestion

- canonical identifiers for channel, source, source item, detected event, draft, review, publish job, and published post
- explicit lifecycle states from detected event through publish
- source provenance rules
- deduplication strategy and idempotency rules
- audit-event expectations

### What must exist before LLM generation

- rubric definitions with purpose, trigger type, publish mode, and review checklist
- prompt-version and model-version tracking rules
- structured detected-event bundle format
- safety constraints for unsupported claims and recommendation-like phrasing
- regeneration rules that preserve source lineage

### What must exist before analytics

- timestamped state transitions
- source-to-post lineage
- prompt and model version lineage
- review action capture
- metric definitions that match the specification

### What should remain mocked at first

- live Telegram publishing calls
- live LLM provider calls
- complex source connectors with high integration cost
- post-performance retrieval from Telegram or third-party analytics

Use mocks only at the integration edge. Do not mock away the core domain states, lineage, or workflow rules.

### Manual validation before more code

- walk one detected event through every intended state transition
- verify duplicate detection does not create multiple drafts for the same event
- verify regeneration preserves event, rubric, and prompt context
- verify review actions capture actor, timestamp, and outcome
- verify publish retries cannot create duplicate intended outcomes
- verify safety flags surface before publish

## 7. Standalone Plan Rule

Keep plans inside this file by default. Create a separate plan file only when:
- the plan is active across multiple sessions
- the plan needs its own change history
- the detail materially exceeds what belongs in this execution guide

When a standalone plan is retired or absorbed, fold any still-canonical guidance back into this file.

## 8. Active Plan - M1 Foundations

### Objective

Define and execute the first implementation slice so future coding starts from the correct domain spine, workflow states, lineage model, and adapter boundaries rather than from live integrations.

### Why now

The repo is ready for implementation planning, but the first coding slice must stay small and correct. Starting from live source connectors, Telegram publishing, or real LLM providers would create rework before the core domain and workflow stabilize.

### Source documents consulted

- `AGENTS.md`
- `PLANS.md`
- `docs/delivery/decision-log.md`
- `docs/specification.md`
- `docs/delivery/execution.md`

### In scope

- one backend boundary only
- core domain model for the MVP operator workflow
- manual source input as the first real ingestion path
- normalization, deduplication, and detected-event creation
- generic rubric and prompt-version configuration with a narrow starter rubric set
- mocked LLM adapter with real draft lifecycle behavior
- editorial review flow with explicit states and actions
- mocked publish path with real publish intent, job state, and idempotency rules
- audit trail and minimum operational analytics for the core funnel

### Out of scope

- live Telegram publishing
- live RSS, market API, or Telegram-source connectors
- live LLM provider integration
- post-performance ingestion from Telegram or external analytics
- multi-user collaboration
- multi-channel support
- auto-publish beyond mocked flow simulation
- rich scheduling automation, chart generation, or dashboard breadth

### Assumptions and constraints

- the MVP remains one owner-editor on one Telegram destination channel
- moderation remains the default publish mode
- external integrations may be mocked, but domain states and lineage may not be mocked away
- terminology must stay consistent with `DetectedEvent`, `Draft`, `EditorialReview`, `PublishJob`, and `PublishedPost`
- quality gates apply before the slice expands to real connectors or real publishing

### Workstreams affected

- Product and Scope
- Source and Event Intelligence
- Editorial Workflow and LLM Layer
- Publishing and Operations
- Data and Analytics
- Safety and Policy
- Platform Evolution

### Dependencies

Blocking dependencies:
1. Domain entities and lifecycle states must be frozen before integration edges are coded.
2. Rubric and prompt-version contracts must exist before draft generation is coded, even against a mock.
3. Review-state transitions must exist before publish intent is introduced.
4. Lineage and audit fields must exist before the slice is considered complete.

Desirable but non-blocking inputs:
- final source trust weighting model
- final fast-lane Breaking News policy
- final post-performance metric set

### Ordered tasks

1. Freeze the day-one entity set, lifecycle states, and invariants.
2. Freeze configuration models for channel, source, rubric, voice profile, prompt version, and safety flags.
3. Implement the manual source input boundary and normalized source-item contract.
4. Implement deduplication and detected-event creation.
5. Implement rubric matching and structured detected-event bundle assembly.
6. Implement the mocked LLM adapter boundary and draft creation flow.
7. Implement editorial review actions and feedback capture.
8. Implement mocked publish intent, publish job state, and idempotency protections.
9. Implement audit events, timestamps, and minimum funnel observability.
10. Manually validate the slice before enabling any real connector or provider.

### Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| The domain spine is too thin | satisfy the Domain Model and Workflow gates before any live edge integration |
| The domain spine is too broad | keep the slice to manual input, two starter rubrics, mocked edges, and minimum observability |
| Mocked generation hides contract problems | define structured detected-event bundles and explicit output contracts before coding the mock |
| Publish semantics are oversimplified | model publish intent, publish-job state, and idempotency rules from day one |
| Manual input path delays real source learning | treat manual input as the first slice only, then add one simple live connector immediately after validation |

### Acceptance criteria

- The slice works for one owner-editor and one Telegram destination channel.
- A manual source item can move through normalization, deduplication, detected-event creation, draft generation, review, and mocked publish intent without breaking lineage.
- Every draft retains source lineage, rubric, prompt version, and generation metadata.
- Review actions capture actor, timestamp, action type, and resulting state.
- Regeneration preserves detected-event and rubric context.
- Mocked publish behavior is idempotent at the intended-outcome level.
- The slice emits enough timestamps and audit records to measure `source item -> detected event -> draft -> review -> publish job`.
- No live connector, real LLM call, or real Telegram publish is required to satisfy the slice.

### Validation approach

Use the quality gates during plan execution:
- Architecture Gate before coding starts
- Domain Model Gate after entity and state implementation
- Workflow Gate before the review loop is considered stable
- Safety Gate before mocked publish intent is treated as milestone-complete
- Observability Gate before the slice is considered complete

Validation checklist:
- one manual source item can create exactly one normalized source-item record
- duplicate manual input does not create a second detected event when it should collapse
- one detected event can route to at least one rubric deterministically
- mocked generation produces a draft with source anchors and prompt-version metadata
- approve, edit, reject, and regenerate all create valid review records
- regenerate preserves detected-event, rubric, and version lineage
- mocked publish intent can be created only from an allowed prior state
- repeated publish attempts do not create duplicate intended publish outcomes
- audit events exist for normalization, detected-event creation, draft creation, review actions, and publish intent
- minimum funnel timestamps are present and queryable

### Decision-log updates required

- Keep `D010` as the durable default unless the first coding session changes the starter rubrics, mocked-edge strategy, or day-one domain set.
- Add new decision-log entries only when those durable assumptions change.

### Recommended first coding prompt

Implement the M1-A domain spine for Telegram Operations Manager inside one backend boundary: create the day-one domain entities, identifiers, lifecycle states, configuration models, lineage fields, and adapter interfaces required by `docs/specification.md` and `docs/delivery/execution.md`, with no live external integrations yet. Keep the work aligned to the Architecture and Domain Model gates, and update the decision log if any durable assumptions change.
