# Decision Log

## Purpose

Record durable product, architecture, delivery, and repo-operation decisions that future sessions must honor or explicitly supersede.

## Intended Audience

Founder, architects, delivery lead, and future implementation agents.

## 2026-03-24 - D001 - Product Is Internal-First

- Decision: Build for an internal one-owner-editor, one-Telegram-destination-channel workflow first, with future SaaS potential.
- Why: This keeps scope tight while preserving a realistic path to a broader platform.

## 2026-03-24 - D002 - Telegram-Only MVP

- Decision: The MVP will publish to Telegram only.
- Why: This focuses implementation on the highest-value channel and avoids premature multi-platform complexity.

## 2026-03-24 - D003 - Human-In-The-Loop Default

- Decision: Moderation and editorial review are the default publish path.
- Why: The product operates in a high-signal, high-risk information domain where quality and trust matter more than raw automation.

## 2026-03-24 - D004 - Source-First Architecture

- Decision: Source quality, normalization, and event detection are first-order system concerns.
- Why: Draft quality depends on evidence quality more than on prompt sophistication alone.

## 2026-03-24 - D005 - No Explicit Buy Or Sell Signals By Default

- Decision: Financial content defaults to informational analysis rather than recommendation-style output.
- Why: This reduces policy, trust, and reputational risk in the MVP.

## 2026-03-24 - D006 - One Backend Boundary For MVP

- Decision: Start with one deployable backend boundary and explicit internal seams.
- Why: This reduces delivery overhead while preserving a clear future expansion path.

## 2026-03-24 - D007 - Canonical Workstream Taxonomy

- Decision: Use the seven workstreams in `docs/delivery/execution.md` as the canonical planning taxonomy.
- Why: This keeps planning, milestones, and future implementation sessions aligned.

## 2026-03-24 - D008 - Domain Spine Before Live Integrations

- Decision: The first implementation should establish the domain model, workflow states, lineage, and adapter boundaries before live source, LLM, or Telegram integrations.
- Why: This reduces rework and keeps external integrations from shaping the core model too early.

## 2026-03-24 - D009 - Quality Gates Before Implementation Expansion

- Decision: Future implementation work must use the documented quality gates in `docs/delivery/execution.md` before expanding architecture, workflow automation, observability, or release scope.
- Why: This prevents speed from outrunning architectural clarity, safety, and measurement.

## 2026-03-24 - D010 - First Coding Slice Uses A Domain-First Mocked-Edge Loop

- Decision: The first coding slice should implement the domain spine and the reviewable draft loop using manual source input plus mocked source, LLM, and Telegram edges.
- Why: This proves the core workflow and minimizes rework before live integrations shape the model.

## 2026-03-24 - D011 - Tech Stack Guidance Is Recommendation, Not Lock-In

- Decision: Technology choices are recommended defaults based on architecture fit, not locked requirements.
- Why: Domain boundaries and workflow design should drive implementation choices, not the reverse.

## 2026-03-24 - D012 - MVP Scope Is Tighter Than The Legacy PRD

- Decision: The MVP feature set is narrower than the earlier comprehensive PRD that preceded the canonical docs.
- Why: The legacy PRD mixed aspirational SaaS breadth with MVP requirements. The current repo must prove the core editorial workflow first.

## 2026-03-24 - D013 - Canonical Docs Should Be Few And Dense

- Decision: Canonical repository truth should prefer fewer, denser documents centered on `docs/specification.md`, `docs/delivery/execution.md`, and this decision log.
- Why: The previous many-file structure increased navigation cost, duplicated sections, and made contradictions more likely.

## 2026-03-24 - D014 - Repo-Local Skill Scaffolding Is Removed

- Decision: Repository-owned `.codex/skills/*` scaffolding is not canonical and has been removed.
- Why: The skill files duplicated normal repo guidance, added maintenance overhead, and did not carry unique domain truth or executable leverage.

## 2026-03-24 - D015 - Delivery Governance Lives In One Execution Doc

- Decision: Workstreams, phases, milestones, risks, quality gates, and the first implementation sequence are consolidated in `docs/delivery/execution.md`. Separate delivery plan files should exist only when they are actively used and materially exceed that doc.
- Why: The previous delivery layer was over-sliced into many thin files with repeated boilerplate.

## 2026-03-24 - D016 - Repo-Local Skills Are Allowed Only As Focused Leverage

- Decision: Repository-local skills may live under `.codex/skills/` when they provide clear reusable repository-specific leverage that canonical docs alone do not provide.
- Why: This preserves the lean canonical-doc model while allowing narrowly scoped local automation or workflow guidance when it materially reduces repeated operator effort.

## 2026-03-24 - D017 - Legacy PRD Material Is Removed From The Repo

- Decision: The repository no longer keeps legacy PRD material under `docs/research/legacy/`.
- Why: The canonical docs are now dense enough to operate from directly, and keeping a parallel historical spec adds ambiguity without enough payoff.

## 2026-03-24 - D018 - Repo-Local Agent Team Lives Under .codex/agents

- Decision: The repository keeps a small repo-local operational agent team under `.codex/agents/` for coordination and execution roles such as project management, backend, frontend, and testing.
- Why: This gives future sessions a stable team shape without turning those roles into canonical product or architecture truth.

## Key Decisions

- This file is the canonical place for durable decisions.
- Future changes must add a new entry rather than silently replacing prior intent.

## Open Questions

- Which future decision areas need their own recurring log sections, such as prompts, source trust policy, or automation thresholds?

## Next Actions

- Add new entries whenever implementation planning or repository structure changes a durable assumption.
