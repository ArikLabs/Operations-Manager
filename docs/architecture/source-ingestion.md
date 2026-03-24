# Source Ingestion

## Purpose
Define how source material enters the system, becomes normalized, and turns into candidate events without prematurely invoking the LLM layer.

## Intended Audience
Backend architect, content intelligence architect, analytics planner, and future implementation agents.

## Source Strategy
Start with a practical, low-friction source mix:
- trusted RSS feeds
- market and news APIs
- manual source injection by the owner
- Telegram source channels when justified by delivery phase and connector complexity

## Ingestion Pipeline
1. Ingest source items from configured connectors.
2. Normalize each item into a common shape with source metadata, timestamp, language, symbols, entities, URLs, and content hash.
3. Deduplicate exact and near-duplicate items before downstream processing.
4. Score relevance, urgency, and evidence quality.
5. Create candidate events for rubric evaluation.
6. Assemble supporting context and source anchors for any candidate worth drafting.

## Design Rules
- No LLM call should happen against raw feed data.
- Deduplication is mandatory before event detection and draft generation.
- Source provenance must remain attached through the entire pipeline.
- Candidate events should be explainable through rules, scores, and contributing source items.
- Multiple sources strengthening the same event should improve confidence rather than create multiple queue entries.

## Freshness Expectations
- Breaking News path: near-real-time for configured high-trust sources.
- Digest and summary paths: scheduled aggregation is acceptable.
- Manual input path: immediate triage and rubric evaluation.

## Event Detection Guidance
- Separate event detection from content drafting.
- Use a scored event model, not a binary trigger.
- Permit one event to match more than one rubric if the editorial intent differs.
- Persist both the confidence score and the reasons an event was considered important.

## Key Decisions
- The system is source-first and evidence-aware.
- Telegram sources are valuable, but do not need to block lower-complexity connectors.
- Candidate events are the unit passed into draft generation.

## Open Questions
- Which near-duplicate strategy best balances speed with false merge risk?
- How should source trust be represented in the first release: static tiers, weighted scores, or both?

## Next Actions
- Define source quality scoring and evidence thresholds before implementation.
- Connect these rules to editorial fast-lane behavior for Breaking News.
