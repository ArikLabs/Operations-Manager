# Skills Catalog

## Purpose
Describe the reusable documentation-only skill scaffolding that supports repeatable Codex sessions in this repository.

## Intended Audience
Codex operators, subagents, and maintainers of `.codex/skills/*`.

## Skill Design Rules
- Skills are documentation-first and reusable.
- Skills must not contain executable scripts in this phase.
- Each skill must define purpose, when to use, inputs, outputs, constraints, and a review checklist.
- Skills should reduce ambiguity, not add ceremony.

## Current Skills
- `repo-planner`: shapes repo structure, document hierarchy, and implementation sequencing.
- `product-analyst`: turns goals into PRD-quality product decisions.
- `system-designer`: defines boundaries, entities, and dependency rules.
- `source-ingestion-designer`: defines source strategy, normalization, and event detection constraints.
- `editorial-workflow-designer`: defines review states, approval logic, and publish flow.
- `llm-prompt-designer`: defines prompt contracts, variables, and generation guardrails.
- `analytics-planner`: defines funnels, metrics, and lineage requirements.
- `safety-reviewer`: defines content risk rules and escalation gates.
- `release-planner`: defines implementation phases, readiness criteria, and launch sequencing.
- `codex-repo-guardian`: enforces planning and repo-governance discipline.

## Key Decisions
- Skills exist to make future Codex sessions faster and more consistent.
- Skill content should stay narrow and practical.

## Open Questions
- Which implementation-stage skills should be introduced once coding begins?

## Next Actions
- Refine these skills after the first implementation planning cycle.
