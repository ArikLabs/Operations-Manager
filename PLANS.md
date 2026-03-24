# PLANS.md

## Purpose

This document defines how execution plans work in this repository. A plan is the working contract between product intent, architecture truth, delivery sequencing, and implementation or documentation work.

## What Counts As A Formal Plan

A formal plan is required when success depends on explicit sequencing rather than ad hoc execution. A formal plan may live in session updates, in `docs/delivery/execution.md`, or in a separate repo doc when it is active and large enough to justify its own file.

## When A Plan Is Mandatory

Create or update a formal plan when a task:
- touches more than one workstream
- changes scope, architecture, workflow states, analytics definitions, or safety posture
- adds or changes an external integration
- introduces implementation work or modifies existing implementation
- requires more than one focused session
- depends on specialist review or subagent input
- has non-trivial failure risk or rollback implications

## Required Sections

Every formal plan must include:
1. Objective
2. Why now
3. Source documents consulted
4. In scope
5. Out of scope
6. Assumptions and constraints
7. Workstreams affected
8. Dependencies
9. Ordered tasks
10. Risks and mitigations
11. Acceptance criteria
12. Validation approach
13. Decision-log updates required

## Default Workstream Taxonomy

Use the names from `docs/delivery/execution.md` unless there is a strong reason to split further:
- Product and Scope
- Source and Event Intelligence
- Editorial Workflow and LLM Layer
- Publishing and Operations
- Data and Analytics
- Safety and Policy
- Platform Evolution

## Acceptance Criteria Rules

Acceptance criteria must be observable and specific. Good criteria:
- describe user-visible or operator-visible outcomes
- name the documents, interfaces, states, or behaviors affected
- define what must be true for the work to be considered complete
- include validation evidence when applicable

Weak criteria such as "looks good" or "is implemented" are not acceptable.

## Dependencies And Risks

- List upstream dependencies before execution starts.
- Separate blocking dependencies from desirable inputs.
- Name the highest-risk assumption explicitly.
- If risk is material, define the check that will prove or disprove it early.

## Status Tracking

Each plan should track status for major tasks or workstreams using:
- `not_started`
- `in_progress`
- `blocked`
- `completed`

Only one major task or workstream should be `in_progress` at a time unless parallel work is intentional and independent.

## Updating A Plan During Execution

- Update the plan when scope changes, assumptions fail, or a dependency becomes blocking.
- Do not silently drift from the plan.
- If a plan becomes invalid, replace it explicitly and state why.
- Reflect durable changes in the canonical docs, not only in the plan text.

## Closing A Completed Plan

A plan is complete only when:
- the acceptance criteria are met or explicitly deferred
- the relevant docs are updated
- required decisions are logged
- remaining risks or follow-ups are documented
- the next best prompt or next milestone is clear

## Link To Decisions And Execution

- Every formal plan must reference the canonical docs it relies on, especially `docs/specification.md`, `docs/delivery/execution.md`, and `docs/delivery/decision-log.md`.
- If the work changes durable assumptions, add or update entries in `docs/delivery/decision-log.md`.
- If implementation starts later, the plan must also reference the relevant implementation-entrypoint and quality-gate sections inside `docs/delivery/execution.md`.
