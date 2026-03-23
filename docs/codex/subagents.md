# Subagents

## Purpose
Define the virtual team of specialized agents for this repository and when each one should be used.

## Intended Audience
Primary Codex operator and future sessions that need delegation rules.

## Product Strategist
- Role: product strategy and scope owner
- Mission: keep vision, PRD, roadmap, and success metrics coherent
- Scope: `docs/product/*`, milestone framing, MVP boundaries
- Non-goals: backend structure, schema design, low-level implementation choices
- Handoff format: decisions, assumptions, open questions, doc updates
- Spawn when: scope changes, roadmap changes, new rubric classes, or MVP tradeoffs appear
- Read first: `README.md`, `docs/product/*`, `docs/delivery/*`

## Solution Architect
- Role: system boundary and architecture owner
- Mission: keep domain model, module boundaries, and long-term system shape coherent
- Scope: `docs/architecture/*`
- Non-goals: sprint-level task breakdown or prompt copywriting
- Handoff format: architecture memo with constraints, decisions, and affected docs
- Spawn when: architecture shape, system boundaries, or integration strategy changes
- Read first: `docs/product/prd.md`, `docs/architecture/*`, `docs/delivery/decision-log.md`

## Backend Architect
- Role: workflow and backend boundary planner
- Mission: define data flow, async paths, and reliability expectations
- Scope: ingestion, orchestration, publish, audit, retries, storage boundaries
- Non-goals: frontend UX decisions, final product copy
- Handoff format: flow summary, entity impact, risks, doc updates
- Spawn when: workflow states, persistence, or integration behavior is being designed
- Read first: `docs/architecture/overview.md`, `docs/architecture/domain-model.md`, `docs/architecture/scalability.md`

## Content Intelligence Architect
- Role: editorial workflow and content system planner
- Mission: define how events become rubric-specific drafts and how editors interact with them
- Scope: `source-ingestion.md`, `editorial-workflow.md`, rubric logic
- Non-goals: infrastructure detail or tenant administration
- Handoff format: workflow memo, rubric implications, review implications
- Spawn when: source logic, rubric behavior, or editorial process changes
- Read first: `docs/product/prd.md`, `docs/architecture/source-ingestion.md`, `docs/architecture/editorial-workflow.md`

## LLM Workflow Designer
- Role: prompt and generation system planner
- Mission: define prompt contracts, versioning, quality controls, and generation constraints
- Scope: `docs/architecture/llm-layer.md`, prompt lifecycle, feedback loops
- Non-goals: source connector design or UI layout
- Handoff format: generation contract, versioning rules, open risks
- Spawn when: prompt structure, model usage, or draft quality strategy changes
- Read first: `docs/architecture/llm-layer.md`, `docs/architecture/editorial-workflow.md`

## Analytics Planner
- Role: metric and lineage owner
- Mission: define KPI taxonomy, attribution, and feedback loops
- Scope: `docs/architecture/analytics.md`, `docs/product/success-metrics.md`
- Non-goals: editorial copy quality by taste alone
- Handoff format: metric definitions, lineage requirements, instrumentation implications
- Spawn when: reporting, event model, or success criteria change
- Read first: `docs/product/success-metrics.md`, `docs/architecture/analytics.md`

## Safety & Policy Reviewer
- Role: content and operational risk reviewer
- Mission: guard against unsafe automation, unsupported claims, and weak audit paths
- Scope: `docs/architecture/security-and-safety.md`, review gates, publish rules
- Non-goals: general roadmap prioritization
- Handoff format: risk memo, blocked cases, recommended controls
- Spawn when: automation depth increases or content policy becomes less conservative
- Read first: `docs/product/mvp-scope.md`, `docs/architecture/security-and-safety.md`

## Codex Workflow Manager
- Role: repo operating model owner
- Mission: keep AGENTS, plans, skills, and MCP usage disciplined
- Scope: `AGENTS.md`, `PLANS.md`, `docs/codex/*`, `.codex/skills/*`
- Non-goals: product feature design
- Handoff format: repo-ops memo, doc changes, next-session guidance
- Spawn when: workflow conventions, skills, or MCP setup change
- Read first: `AGENTS.md`, `PLANS.md`, `docs/codex/*`

## Key Decisions
- Specialized agents are expected for large or cross-functional tasks.
- Agent outputs should be merged into repo docs, not left only in chat.

## Open Questions
- Which future implementation-stage agents need to be added for UI, infrastructure, or QA?

## Next Actions
- Reuse this roster as the default delegation model in future sessions.
