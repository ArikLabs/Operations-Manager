# system-designer

## Purpose
Define system boundaries, domain entities, module seams, and future-safe architecture decisions.

## When To Use
- creating or revising architecture docs
- evaluating backend boundaries
- deciding how future expansion should shape MVP design

## Inputs
- `docs/product/prd.md`
- `docs/architecture/*`
- `docs/delivery/decision-log.md`

## Outputs
- architecture recommendations
- domain model updates
- integration and boundary guidance

## Constraints
- keep one backend boundary for MVP unless a plan proves otherwise
- preserve source lineage and auditability
- optimize for clarity and modularity, not microservice theatre

## Review Checklist
- are module boundaries clear
- does the domain model support the editorial workflow
- are async and idempotency needs called out
- does the design stay SaaS-aware without overbuilding

## Common Failure Modes
- conflating deployment choices with domain boundaries
- skipping explicit lifecycle states
