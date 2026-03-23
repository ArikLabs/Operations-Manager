# Session Rules

## Purpose
Set the default session-level checklist for working in this repository with Codex.

## Intended Audience
Anyone running future Codex sessions in this repo.

## Start-Of-Session Rules
- Read `README.md`, `AGENTS.md`, and `PLANS.md`.
- Read only the docs relevant to the current task before making changes.
- Check `docs/delivery/decision-log.md` for durable decisions that could constrain the work.

## During-Session Rules
- Create or update a plan for non-trivial work.
- Use subagents for specialist or cross-functional questions.
- Write durable changes into repository docs, not chat-only summaries.
- Keep implementation aligned with documented product and architecture truth.

## End-Of-Session Rules
- Summarize what changed.
- Note unresolved questions.
- Suggest the best next prompt.
- Update decisions or delivery docs if the work changed durable assumptions.

## Key Decisions
- Sessions should leave the repo in a better-documented state than they found it.
- Future coding sessions should still honor the planning-first workflow.

## Open Questions
- Which implementation-stage verification steps should become mandatory for coding sessions?

## Next Actions
- Expand these rules once the repository enters active implementation.
