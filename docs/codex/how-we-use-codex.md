# How We Use Codex

## Purpose
Define the working model for Codex in this repository so future sessions stay aligned with product and architecture truth.

## Intended Audience
Codex operators, subagents, and any human reviewer working with AI-assisted development in this repo.

## Operating Posture
Codex is used here as a planning, architecture, implementation, and review partner. During the current phase, its job is to improve repository readiness without generating product code.

## Default Workflow
1. Read `README.md`, `AGENTS.md`, and `PLANS.md`.
2. Read the relevant product, architecture, delivery, and Codex docs.
3. Create or update a plan for non-trivial work.
4. Spawn subagents when the task crosses specialist boundaries.
5. Consolidate outputs into repository documents.
6. Only start implementation when the prompt explicitly requests it and the plan is ready.

## Working Rules
- Prefer repo truth over memory.
- Prefer official documentation over invented behavior.
- Update durable docs when work changes durable decisions.
- End major sessions with clear next prompts and updated planning context.

## Key Decisions
- Codex should behave as a disciplined repo operator, not a fast code generator.
- Planning quality is part of delivery quality in this repository.

## Open Questions
- Which implementation-stage checklists should be added once coding begins?

## Next Actions
- Use this document together with `session-rules.md` to guide future sessions.
