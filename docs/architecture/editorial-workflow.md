# Editorial Workflow

## Purpose
Describe the human-in-the-loop path from detected event to final Telegram post, including review states, controls, and exceptions.

## Intended Audience
Product strategist, content intelligence architect, backend architect, and future implementation agents.

## Workflow Summary
The workflow is deterministic until draft creation and controlled after draft creation. Human approval is the default for publishable content.

## Core Flow
1. Candidate event enters the queue with urgency and rubric relevance.
2. Draft generation produces one or more rubric-specific drafts with source anchors.
3. Draft enters review with risk flags, rubric checklist, and generation metadata.
4. Owner-editor can approve, edit, reject, regenerate, or reschedule.
5. Approved drafts move to scheduled or urgent publish.
6. Published outcomes feed analytics and feedback loops.

## Review Actions
- `approve`: accept as-is or after edits.
- `edit`: revise content while preserving lineage.
- `reject`: discard the draft and record why.
- `regenerate`: request a new version using the same event context and rubric.
- `reschedule`: move the approved draft to a better slot.

## Default Editorial Policy
- Moderation is the default publish mode.
- Breaking News may use a fast-lane queue, but still requires explicit policy guardrails.
- High-risk or ambiguous content should remain blocked until human review.
- Edits are signals and should be stored as structured feedback.

## Review Checklist Guidance
Each rubric should carry a review checklist covering:
- evidence sufficiency
- unsupported claims
- tone and voice fit
- whether investor implications are framed carefully
- whether the draft remains informational rather than advisory

## Key Decisions
- Human review is a normal workflow state, not an exception path.
- Regeneration should preserve the same source bundle and rubric context.
- Editorial feedback must inform later prompt and rubric tuning.

## Open Questions
- Which reasons for rejection should be standardized from the first release?
- What threshold allows Breaking News to move through a faster review experience?

## Next Actions
- Define the canonical review reasons and state transitions in implementation planning.
- Align the LLM layer with rubric-specific review checklists.
