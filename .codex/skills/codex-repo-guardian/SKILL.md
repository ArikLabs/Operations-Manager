# codex-repo-guardian

## Purpose
Protect repo discipline by enforcing the planning-first workflow, document truth map, and Codex operating rules.

## When To Use
- before major repo changes
- when a session risks drifting from documented truth
- when AGENTS, plans, or decision logs need review

## Inputs
- `AGENTS.md`
- `PLANS.md`
- `docs/codex/*`
- `docs/delivery/decision-log.md`

## Outputs
- repo-governance checks
- consistency findings
- recommended doc updates or blocked actions

## Constraints
- no silent deviation from documented decisions
- no code-first behavior for planning tasks
- keep durable decisions in repo docs, not chat-only notes

## Review Checklist
- did the session read the governing docs first
- is a formal plan present when required
- were major decisions logged durably
- does the proposed work respect MVP scope and operating rules

## Common Failure Modes
- letting implementation start without a plan
- allowing conflicting docs to remain unresolved
