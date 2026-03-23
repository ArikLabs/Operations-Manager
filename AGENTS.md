# AGENTS.md

## Purpose
This repository is a planning-first operating system for building the Telegram Operations Manager for the "Ukrainian Investor" channel. Until a future task explicitly requests implementation, this repo is documentation-only.

## Core Rules
- Read `README.md`, then `PLANS.md`, before starting any major task.
- Treat `docs/architecture/*` as architectural truth, `docs/product/*` as product truth, `docs/delivery/*` as execution truth, and `docs/codex/*` as Codex operating guidance.
- Do not write product code, tests, migrations, CI, Docker, or executable scripts unless the task explicitly asks for implementation.
- Do not invent APIs, schemas, workflows, or integrations when repository documentation or official documentation exists.
- Record durable product or architecture decisions in `docs/delivery/decision-log.md`.
- Keep the MVP Telegram-only, internal-first, source-first, and human-in-the-loop.
- Default to conservative editorial policy: no explicit buy/sell signals by default, no unreviewed high-risk publishing, and no autopilot by default.

## Planning Workflow
- For any task larger than a small doc edit, create or update a formal plan using `PLANS.md`.
- Before implementation, verify the relevant product, architecture, delivery, and Codex docs are aligned.
- If the task changes scope, assumptions, or architecture, update the affected docs before or alongside the work.

## Subagent Use
- Spawn subagents for work that crosses product, architecture, analytics, safety, editorial workflow, or Codex operating-model boundaries.
- Use concise handoffs: decisions, assumptions, open questions, and recommended document updates.
- Consolidate subagent output into repository docs; do not leave durable guidance only in chat.

## Repository Truth Map
- Product direction: `docs/product/*`
- System design: `docs/architecture/*`
- Delivery planning: `docs/delivery/*`
- Codex operating model: `docs/codex/*`
- Future reusable skills: `.codex/skills/*`

## Decision Discipline
- Add new durable decisions to `docs/delivery/decision-log.md`.
- Reference superseded decisions instead of silently rewriting history.
- If implementation starts later, every significant code task must point back to a plan, a decision, or a source document.
