# Success Metrics

## Purpose
Define how the team will know whether the product is working for the owner-editor and whether it is ready to deepen automation later.

## Intended Audience
Founder, analytics planner, delivery lead, and any future agent instrumenting the workflow.

## Metric Design Rules
- Measure the workflow as a funnel.
- Separate operational success from content performance.
- Prefer metrics that drive decisions over metrics that only look impressive.
- Keep one source of truth for each metric.

## MVP Success Metrics

### Operational Speed
- Event-to-draft latency
- Event-to-approval latency
- Event-to-publish latency
- Breaking News fast-lane completion time

### Editorial Quality
- Approval rate without major edits
- Edit distance between generated draft and final post
- Rejection rate by rubric
- Regeneration rate by rubric

### Workflow Reliability
- Ingestion success rate
- Duplicate suppression rate
- Failed publish rate
- Schedule adherence rate

### Content Performance
- Post reach
- Engagement rate
- Forward or share indicators if available
- Performance by rubric and by source lineage

## Later-Stage Metrics
- Cross-channel rubric comparison
- Tenant retention and account expansion
- Comparative source quality across channels
- Prompt and model version benchmarking

## Initial Targets
- Breaking News event-to-draft under 3 minutes in normal conditions
- Breaking News event-to-publish under 10 minutes with review included
- At least 60 percent approval without major rewrite once prompt and rubric tuning stabilizes
- Duplicate suppression high enough to prevent repeated coverage of the same event in the queue

## Instrumentation Requirements
- Every draft and published post must retain lineage to source items, rubric, prompt version, and reviewer action.
- Every state transition in the editorial workflow must be timestamped.
- Metric definitions must be documented before implementation starts.

## Key Decisions
- Latency is a first-class product metric.
- Approval rate and edit distance are the main quality signals for MVP.
- Vanity metrics should not drive the first implementation phases.

## Open Questions
- Which Telegram analytics are reliably available for the eventual publishing method?
- What threshold should separate a minor edit from a major rewrite?

## Next Actions
- Mirror these definitions in `docs/architecture/analytics.md`.
- Use these metrics to set milestone exit criteria in delivery planning.
