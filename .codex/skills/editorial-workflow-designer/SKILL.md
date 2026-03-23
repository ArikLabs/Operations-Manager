# editorial-workflow-designer

## Purpose
Define the review, approval, scheduling, and publishing workflow for human-in-the-loop editorial operations.

## When To Use
- changing draft states
- designing moderation behavior
- introducing fast-lane or low-risk automation rules

## Inputs
- `docs/product/prd.md`
- `docs/architecture/editorial-workflow.md`
- `docs/architecture/security-and-safety.md`

## Outputs
- workflow state updates
- review and approval rules
- publish-mode and escalation guidance

## Constraints
- moderation remains the default in MVP
- high-risk content must not bypass review
- edits and rejections should remain usable as feedback

## Review Checklist
- are states explicit and auditable
- can the owner approve, edit, reject, regenerate, and reschedule
- is fast-lane behavior bounded by policy
- do feedback loops capture editorial corrections

## Common Failure Modes
- treating review as optional for risky content
- collapsing distinct editorial actions into one vague state
