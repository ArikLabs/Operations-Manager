# Telegram Operations Manager

Planning-first repository for the future development of an internal-first Telegram content operations system for the "Ukrainian Investor" channel.

## Repository Intent
This repository is being prepared for Codex-driven development. The current goal is to define product scope, architecture, delivery sequencing, and an operating model for Codex and subagents before implementation starts.

## Product Summary
Telegram Operations Manager is intended to reduce the time and latency involved in running a Telegram channel by supporting:
- source ingestion
- event detection
- draft generation
- editorial review
- scheduling and publishing
- analytics and feedback loops

The first target is one owner running one Telegram channel with strong human-in-the-loop editorial control. The longer-term direction is multi-channel and SaaS expansion without rewriting the core workflow.

## Current State
- Existing root PRD drafts (`prd.md`, `prd1.md`, `PRD_FINAL.md`) are treated as source material.
- Existing TypeScript scaffolding remains in the repo, but this setup does not activate implementation work.
- New repository truth lives under `docs/`, `AGENTS.md`, `PLANS.md`, and `.codex/`.

## Where To Read First
- `AGENTS.md`
- `PLANS.md`
- `docs/product/prd.md`
- `docs/architecture/overview.md`
- `docs/codex/how-we-use-codex.md`

## Repository Layout
- `docs/product/`: vision, PRD, MVP scope, roadmap, success metrics
- `docs/architecture/`: system design and domain truth
- `docs/delivery/`: workstreams, phases, milestones, risks, decisions
- `docs/codex/`: Codex operating rules, subagents, skills, MCP strategy
- `.codex/skills/`: documentation-only skill scaffolding
- `apps/`, `services/`, `packages/`, `infra/`: future implementation areas, currently placeholders only

## Working Rule
No product code should be added unless a future prompt explicitly requests implementation work.
