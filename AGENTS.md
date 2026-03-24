# AGENTS.md

## Purpose

This is the operating contract for Codex in this repository. Follow it before changing docs, proposing implementation, or writing any code.

## Repository Mode

- Current mode: planning-first, implementation-ready, documentation-led.
- Default assumption: no product code should be written unless a future task explicitly requests implementation.
- Current MVP boundary: one owner-editor, one Telegram destination channel, moderation-first workflow, source-first architecture.

## Mandatory Read Order

Before any major task, read in this order:
1. `README.md`
2. `AGENTS.md`
3. `PLANS.md`
4. `docs/delivery/decision-log.md`
5. `docs/specification.md`
6. `docs/delivery/execution.md`

## Truth Map And Ownership

- `docs/delivery/decision-log.md`: durable decisions
  Primary owner: Codex Workflow Manager with founder review
- `docs/specification.md`: product and architecture truth
  Primary owners: Product Strategist and Solution Architect
- `docs/delivery/execution.md`: workstreams, phases, milestones, risks, gates, and active implementation sequence
  Primary owner: Codex Workflow Manager with Release Planner support
- `docs/research/*`: non-canonical research context
  Primary owner: session author

If two docs disagree, follow `docs/delivery/decision-log.md`, then `docs/specification.md`, then `docs/delivery/execution.md`, and update the conflicting doc.

## Non-Negotiable Rules

- Do not write backend code, frontend code, tests, migrations, Docker, CI, or scripts unless a future task explicitly asks for implementation.
- Do not invent APIs, schemas, integrations, or workflows when repository docs or official docs already define them.
- Keep the MVP internal-first, Telegram-only, moderation-first, and source-first unless the decision log changes.
- No explicit buy or sell signals by default.
- Every durable product, architecture, workflow, or repo-operation decision must be recorded in `docs/delivery/decision-log.md`.
- Every non-trivial task must link back to the relevant workstreams and canonical docs.
- Prefer fewer, denser canonical docs over scaffolding, catalogs, or role-play layers that duplicate the same truth.

## Planning-First Execution

- Use a formal plan for any task that is cross-domain, multi-step, risky, or likely to take more than one focused session.
- Before implementation, propose the work in plan form first: objective, affected workstreams, affected docs, dependencies, acceptance criteria, risks, and validation approach.
- If documentation is missing or contradictory, fix the docs before writing code.

## Subagent Policy

- Use subagents for large or specialist work that spans product, architecture, editorial workflow, LLM behavior, analytics, safety, or repo operating rules.
- Avoid subagents for small single-domain edits, straightforward repo inspection, or tasks where the next step is blocked on one answer that is faster to resolve locally.
- When using subagents, give them only the scope they need and require a short handoff with: summary, decisions, assumptions, open questions, impacted docs, and recommended next step.
- Consolidate subagent output into repository docs. Do not leave durable guidance only in chat.

## Repo Operations Policy

- Repo-local `.codex/agents/*` is allowed for operational role definitions. Those files are not canonical truth and must point back to the canonical docs.
- Repo-local `.codex/skills/*` is allowed only when a task needs reusable leverage beyond canonical docs. Keep those skills narrow, repository-specific, and non-duplicative.
- Use MCP only when the current phase needs it.
- Prefer official documentation and repository docs first.
- Do not assume any MCP server is installed or configured unless verified.
- If an MCP server is unavailable, fall back to local docs and normal inspection, then note the gap.
- Do not put secrets, tokens, or environment-specific credentials into repository files.
- Keep `.codex/config.toml` as draft policy unless the repo explicitly enters a phase that needs real MCP activation.

## Implementation Gate

- A future request for coding does not bypass planning.
- Before coding, confirm the relevant plan exists, the canonical docs are aligned, the required quality gates are known, and any unresolved architectural questions are explicitly listed.
- If the task is exploratory, stay in design mode until the user explicitly wants implementation to begin.

## Change Discipline

- Update the smallest set of docs that restores consistency.
- Normalize terminology instead of adding competing terms.
- Prefer tightening and reusing existing docs over creating new ones.
- If a section can live inside an existing canonical doc, keep it there instead of creating a new file.
- End each major session with updated docs, unresolved questions, and the next best prompt.
- If new files was added, need to track them with `git add`.
