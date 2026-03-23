# source-ingestion-designer

## Purpose
Define how sources enter the system, are normalized, and become candidate events.

## When To Use
- planning new source connectors
- refining deduplication or event detection strategy
- deciding ingestion sequencing for MVP

## Inputs
- `docs/product/mvp-scope.md`
- `docs/architecture/source-ingestion.md`
- source assumptions and trust tiers

## Outputs
- ingestion strategy updates
- normalization and provenance requirements
- event-detection constraints

## Constraints
- no raw-feed LLM calls
- deduplication must happen before drafting
- preserve source provenance through the workflow

## Review Checklist
- is the source mix realistic for the current phase
- are freshness expectations explicit
- can a candidate event be explained and audited
- are duplicate and noise controls defined

## Common Failure Modes
- adding high-complexity sources too early
- mixing ingestion logic with editorial policy
