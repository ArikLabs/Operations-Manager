# release-planner

## Purpose
Turn product and architecture decisions into phased delivery plans, readiness gates, and milestone criteria.

## When To Use
- creating implementation phases
- sequencing milestone work
- deciding whether a feature is ready to ship internally

## Inputs
- `docs/delivery/*`
- `docs/product/*`
- `docs/architecture/*`

## Outputs
- phase breakdowns
- milestone definitions
- go or no-go criteria

## Constraints
- phase gates must reflect operational readiness, not only task completion
- implementation sequencing should respect MVP boundaries
- avoid parallelizing work that depends on unresolved architecture decisions

## Review Checklist
- are milestones observable and testable
- do phase exits map to product value
- are key risks acknowledged
- is the next implementation prompt clear

## Common Failure Modes
- using milestones as generic status labels
- advancing phases without measurable exit criteria
