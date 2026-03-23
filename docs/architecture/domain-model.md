# Domain Model

## Purpose
Define the canonical entities, relationships, and lifecycle states that future implementation must preserve.

## Intended Audience
Solution architect, backend architect, analytics planner, and future implementation agents.

## Core Entities
- `Channel`: the Telegram destination being operated.
- `User`: operator or reviewer identity.
- `Role`: permissions attached to a user.
- `Source`: configured input such as RSS, market API, Telegram source, or manual feed.
- `SourceItem`: a raw or normalized item received from a source.
- `DetectedEvent`: a scored candidate event derived from one or more source items.
- `Rubric`: editorial template and routing rule set.
- `PromptTemplate`: versioned prompt definition bound to a rubric.
- `Draft`: generated content candidate with lineage and status.
- `EditorialReview`: decision record for review, edit, approval, rejection, or regenerate actions.
- `Schedule`: planned publish slot and rules.
- `PublishJob`: publish attempt record.
- `PublishedPost`: canonical record of what was sent to Telegram.
- `FeedbackEvent`: structured feedback from editorial actions or performance outcomes.
- `MetricSnapshot`: materialized analytics observation.
- `AuditEvent`: immutable trace of notable actions and state changes.

## Canonical Relationships
- One `Source` yields many `SourceItem` records.
- One or more `SourceItem` records can contribute to one `DetectedEvent`.
- One `DetectedEvent` can produce multiple `Draft` records across rubrics or revisions.
- One `Draft` belongs to one `Rubric` and one `PromptTemplate` version.
- One `Draft` can have multiple `EditorialReview` records over time.
- One approved `Draft` may produce one `PublishedPost`, with one or more `PublishJob` attempts.
- `FeedbackEvent` may reference the draft, final post, reviewer, rubric, and prompt version.

## Editorial Lifecycle States
- `queued`
- `drafted`
- `in_review`
- `needs_revision`
- `approved`
- `scheduled`
- `published`
- `failed`
- `archived`

## Invariants
- Every draft must reference its triggering event and rubric.
- Every published post must be traceable to at least one source item.
- Every review action must capture actor, timestamp, and action type.
- Prompt and model version data must remain attached to generated artifacts.
- Publish operations must be retryable without creating duplicate intended outcomes.

## Key Decisions
- Lineage is first-class, not optional metadata.
- Review state transitions must be explicit in the domain model.
- Analytics entities should reflect the operational workflow, not only the UI.

## Open Questions
- Should a future multi-channel design allow one detected event to spawn drafts for multiple channels directly, or only through per-channel rubric evaluation?
- Which parts of the audit trail should be immutable from day one?

## Next Actions
- Use this model as the baseline for any future schema planning.
- Align workflow documents and analytics definitions to these entity names.
