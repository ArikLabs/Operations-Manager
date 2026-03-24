# Scalability

## Purpose
Describe how the system should remain extensible and resilient as the product evolves from one owner and one channel toward broader operational scope.

## Intended Audience
Solution architect, backend architect, delivery lead, and future implementation agents.

## MVP Scalability Posture
Do not optimize for scale theatre. Optimize for clear seams, idempotent flows, and domain choices that do not block later growth.

## Scalability Principles
- Keep async boundaries around ingestion, generation, and publishing.
- Use idempotency keys on write paths.
- Separate domain boundaries even if deployed together.
- Preserve tenant-aware shapes in core records where low-cost.
- Prefer additive integrations behind adapters.

## What Must Scale Cleanly Later
- number of sources
- number of rubric evaluations
- number of drafts and review actions
- number of publish jobs
- number of channels and tenants

## Failure And Recovery Expectations
- Retries must not produce duplicate intended outcomes.
- Dead-letter handling must exist for stuck ingestion or publish operations.
- Manual reprocessing should be possible for source items and events.
- Queue backpressure should degrade gracefully rather than silently drop work.

## Expansion Path
- Single backend boundary first.
- Internal module seams second.
- Service extraction only after real pressure appears in throughput, team ownership, or deployment cadence.

## Key Decisions
- SaaS readiness is achieved through clean boundaries and data shapes, not early microservices.
- Reliability concerns matter sooner than horizontal scale concerns.

## Open Questions
- Which parts of the workflow deserve stronger isolation first if throughput grows quickly?
- When does Telegram-only publishing cease to be the main scaling simplification?

## Next Actions
- Keep these constraints in mind when later choosing storage, queue, and scheduling technology.
