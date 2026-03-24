# Telegram Operations Manager

Planning-first repository for an internal-first Telegram content operations system for the "Ukrainian Investor" channel.

## Repository Intent

The repository is preparing the product, architecture, and execution model before serious implementation starts.

## Product Summary

Telegram Operations Manager is meant to reduce the manual work of running a Telegram channel by supporting:
- source ingestion
- event detection and prioritization
- rubric-based draft generation
- editorial review
- scheduling and publishing
- analytics and feedback loops

The first target is one owner-editor running one Telegram destination channel with moderation-first control. Future multi-channel and SaaS expansion remain design constraints, not immediate delivery goals.

## Canonical Read Order

1. `README.md`
2. `AGENTS.md`
3. `PLANS.md`
4. `docs/delivery/decision-log.md`
5. `docs/specification.md`
6. `docs/delivery/execution.md`

## Canonical Doc Set

- `docs/specification.md`: product and architecture truth
- `docs/delivery/execution.md`: workstreams, phases, milestones, quality gates, active implementation sequence
- `docs/delivery/decision-log.md`: durable product, architecture, and repo-operation decisions
- `docs/research/*`: non-canonical research context
- `AGENTS.md` and `PLANS.md`: repository operating contract

## Current State

- The repository is still planning-first and documentation-led.
- The repository operates from canonical docs only; no legacy PRD is kept as a parallel reference source.
- Repo-local agent roles may live under `.codex/agents/` as operational tooling.
- Repo-local skills are allowed only when they add real reusable leverage and do not duplicate canonical docs.
- `.codex/config.toml` is a draft MCP policy artifact, not proof that any MCP server exists.

## Repository Layout

- `docs/specification.md`
- `docs/delivery/decision-log.md`
- `docs/delivery/execution.md`
- `docs/research/`
- `.codex/agents/`: repo-local operational agent roles
- `.codex/config.toml`
- `.codex/skills/`: repo-local skills when a task needs reusable repo-specific leverage
- future implementation directories should be created only when implementation actually begins

## Working Rule

No product code should be added unless a future prompt explicitly requests implementation work.
