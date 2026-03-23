# PLANS.md

## What A Plan Is
A plan is the execution contract for non-trivial work in this repository. It links product intent, architecture constraints, delivery sequencing, and validation into one working document or session update.

## When A Formal Plan Is Required
Create or update a formal plan when a task:
- touches more than one workstream
- changes architecture, data flow, or editorial workflow
- introduces or changes external integrations
- affects analytics, safety, or compliance posture
- requires multiple sessions or subagents
- moves the repo from planning into implementation

## Plan Sections
Every formal plan should include:
1. Objective
2. Background and source documents consulted
3. In-scope work
4. Out-of-scope work
5. Assumptions and constraints
6. Workstreams
7. Ordered tasks
8. Risks and mitigations
9. Validation or acceptance criteria
10. Decision updates required

## Acceptance Criteria For A Good Plan
A plan is acceptable when it:
- maps clearly to a product outcome or delivery milestone
- names the relevant docs that define truth
- breaks work into discrete workstreams with clear boundaries
- identifies dependencies and unknowns early
- defines what "done" means in observable terms
- is updateable during execution without rewriting the entire plan

## Workstream Breakdown Rules
Use these default workstreams unless a task needs a tighter split:
- Product and scope
- Domain and architecture
- Editorial workflow and LLM layer
- Data and analytics
- Safety and policy
- Delivery and rollout
- Implementation tasks, once implementation is explicitly authorized

## Updating Plans During Execution
- Update status when a workstream begins, changes, or completes.
- Record assumption changes immediately.
- If a plan is no longer valid, replace it explicitly and explain why.
- Reflect durable changes in the canonical docs, not only in the plan text.

## Plan Storage
- Session-level execution plans can live in tool state and chat updates.
- Durable execution strategy belongs in `docs/delivery/*`.
- If a plan becomes important beyond one session, convert it into a repository document.
