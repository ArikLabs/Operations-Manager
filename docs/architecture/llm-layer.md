# LLM Layer

## Purpose
Define how LLMs are used, constrained, versioned, and evaluated inside the product.

## Intended Audience
LLM workflow designer, content intelligence architect, solution architect, and future implementation agents.

## Operating Role
The LLM layer is a draft engine. It does not decide what matters, whether something is safe to publish, or when a post should be scheduled.

## Input Contract
LLM calls should receive structured inputs only:
- normalized event summary
- supporting source anchors
- rubric definition
- voice and formatting rules
- generation goal
- output shape requirements

## Prompt Design Rules
- Prompts are rubric-specific.
- Prompt versions are explicit and durable.
- Prompt inputs should be distilled facts, not raw feeds.
- Retrieval and evidence assembly should happen before the prompt.
- Output format should be stable enough for review and analytics.

## Versioning Requirements
- Track prompt version separately from model version.
- Keep generation metadata on every draft.
- Do not allow silent prompt changes for active rubrics.

## Feedback Model
- Draft-level decisions: approve, reject, regenerate.
- Text-level changes: what was removed, softened, expanded, or corrected.
- Outcome-level signals: engagement and post quality after publish.

## Safety Controls
- Flag unsupported claims before review.
- Block ungrounded recommendation-style language by default.
- Surface uncertainty when evidence is weak or conflicting.
- Require attribution anchors that an editor can inspect quickly.

## Key Decisions
- The orchestration layer, not the model, owns relevance and policy decisions.
- Prompt versioning is mandatory from the first implementation.
- Human edits are feedback signals, not disposable noise.

## Open Questions
- What output schema best balances strictness with editorial flexibility?
- Which rubric types need multiple generation modes from day one?

## Next Actions
- Define prompt contracts per rubric before backend implementation starts.
- Align safety checks with `security-and-safety.md`.
