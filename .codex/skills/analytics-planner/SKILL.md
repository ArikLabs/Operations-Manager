# analytics-planner

## Purpose
Define the event model, metric hierarchy, and attribution rules needed to evaluate the product.

## When To Use
- defining success metrics
- planning instrumentation
- deciding what lineage must be stored

## Inputs
- `docs/product/success-metrics.md`
- `docs/architecture/analytics.md`
- workflow state definitions

## Outputs
- metric definitions
- analytics model updates
- instrumentation priorities

## Constraints
- prefer operational analytics over vanity dashboards in MVP
- keep one source of truth for each metric
- make lineage first-class

## Review Checklist
- does the metric help a real product or editorial decision
- is the funnel defined end to end
- are reviewer actions captured as structured signals
- can outputs be tied to source, rubric, prompt, and final post

## Common Failure Modes
- measuring engagement without workflow context
- adding metrics that have no owner or action path
