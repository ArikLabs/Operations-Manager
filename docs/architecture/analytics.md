# Analytics

## Purpose
Define the analytics model for measuring workflow performance, editorial quality, and content outcomes.

## Intended Audience
Analytics planner, solution architect, backend architect, and future implementation agents.

## Analytics Strategy
Start with operational analytics, not SaaS dashboard complexity. The first question is whether the system improves speed, control, and output quality for one owner-editor.

## Funnel Model
Track the pipeline as:
`source item -> detected event -> draft -> review -> publish job -> published post -> performance snapshot`

## Core Metric Families

### Workflow Speed
- source-to-event latency
- event-to-draft latency
- draft-to-approval latency
- event-to-publish latency

### Editorial Quality
- approval rate
- rejection rate
- regenerate rate
- edit distance between generated draft and final post

### Operational Reliability
- ingestion success rate
- duplicate suppression rate
- queue depth
- failed publish rate
- schedule adherence

### Content Performance
- reach
- engagement rate
- performance by rubric
- performance by source lineage

## Attribution Rules
- Every draft and published post must retain source lineage.
- Every generated artifact must capture prompt version and model version.
- Reviewer actions must remain attributable to a user and timestamp.
- Metrics must have one documented source of truth.

## MVP Versus Later
- MVP focuses on one channel and one owner workflow.
- Later phases can add tenant-aware benchmarking, rubric experiments, and cross-channel analytics.

## Key Decisions
- Latency is a product KPI, not only an operational metric.
- Approval rate and edit distance are the primary quality indicators.
- Lineage is required to make analytics actionable.

## Open Questions
- Which post-performance signals are dependable given the eventual Telegram delivery mechanism?
- How should rubric-level performance be normalized when rubric volumes differ significantly?

## Next Actions
- Keep metric names aligned with `docs/product/success-metrics.md`.
- Use this taxonomy when future schema or event-model planning begins.
