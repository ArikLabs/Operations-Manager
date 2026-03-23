# Risk Register

## Purpose
Track the highest-value product, architecture, and delivery risks so they can be managed intentionally.

## Intended Audience
Founder, delivery lead, architects, and future implementation agents.

## Active Risks

### R1: Source Noise Overwhelms Editorial Workflow
- Impact: high
- Likelihood: medium
- Mitigation: start with a curated source set, require deduplication early, and measure queue quality.

### R2: Draft Quality Is Too Generic To Save Time
- Impact: high
- Likelihood: medium
- Mitigation: keep rubric definitions narrow, version prompts, and capture structured edit feedback.

### R3: Breaking News Workflow Is Fast But Unsafe
- Impact: high
- Likelihood: medium
- Mitigation: enforce evidence thresholds, fast-lane review gates, and explicit high-risk content rules.

### R4: Telegram Connector Complexity Delays MVP
- Impact: medium
- Likelihood: medium
- Mitigation: sequence simpler source connectors first and keep Telegram source ingestion optional for early phases.

### R5: Architecture Overbuild Slows Delivery
- Impact: medium
- Likelihood: high
- Mitigation: keep one backend boundary, modular seams, and no premature service sprawl.

### R6: Analytics Are Added Too Late To Prove Value
- Impact: medium
- Likelihood: medium
- Mitigation: define metrics and lineage requirements before implementation starts.

## Key Decisions
- Risks are tracked by operational impact, not only technical difficulty.
- Latency, trust, and review workload are the most important risk clusters.

## Open Questions
- Which risk should be treated as the main kill criterion for the MVP?
- What is the earliest point at which publish reliability can be validated realistically?

## Next Actions
- Revisit this register at the start of each implementation phase.
