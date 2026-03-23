# safety-reviewer

## Purpose
Review content, workflow, and automation changes for policy, reputational, and operational risk.

## When To Use
- increasing automation depth
- adding new content types or publish modes
- revising editorial guardrails

## Inputs
- `docs/architecture/security-and-safety.md`
- `docs/product/mvp-scope.md`
- affected workflow or prompt docs

## Outputs
- risk findings
- blocked or cautionary cases
- recommended controls and review gates

## Constraints
- default to informational analysis, not recommendation-style output
- require auditability for risky actions
- avoid weakly sourced financial claims

## Review Checklist
- does the workflow preserve human review where needed
- are high-risk claims or actions gated
- is source evidence available and inspectable
- are audit and rollback expectations defined

## Common Failure Modes
- treating safety as a final filter instead of a design constraint
- approving automation without clear evidence thresholds
