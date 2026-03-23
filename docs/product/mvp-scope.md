# MVP Scope

## Purpose
Define what the first build must do, what it may do if time allows, and what is deliberately excluded.

## Intended Audience
Founder, delivery lead, solution architect, and future implementation agents deciding whether a feature belongs in the MVP.

## In Scope
- One owner-editor workflow.
- One primary Telegram channel.
- Telegram publishing only.
- Source-first ingestion from a practical starter set such as RSS, market/news APIs, and manual inputs.
- Event detection with urgency and rubric relevance scoring.
- Rubric configuration for the default rubric set.
- Draft generation through an LLM layer with prompt versioning.
- Editorial queue with approve, edit, reject, regenerate, and reschedule actions.
- Scheduling and urgent publish flows.
- Operational analytics and feedback capture.
- Audit trail for source lineage, draft lineage, review actions, and publish outcomes.

## Should Fit If Capacity Allows
- Telegram channels as source inputs after simpler source types are stable.
- Low-risk auto-publish for tightly bounded Breaking News conditions.
- Voice profile management beyond a single default style.
- Post variants for short and long forms within the same rubric.

## Out Of Scope
- Full autopilot across all rubrics.
- Multi-channel publishing.
- Multi-tenant account model.
- Billing, subscription management, or SaaS administration.
- Rich chart rendering and visual asset generation.
- A/B testing infrastructure.
- Explicit trading recommendations, portfolio management, or execution signals.
- Mobile apps.

## Scope Rules
- If a feature does not improve speed, quality, or control of the core editorial loop, it should not be pulled into MVP by default.
- If a capability adds major complexity for future SaaS but little value for one owner, defer it.
- If a workflow cannot be explained through source lineage and editorial states, it is too vague for MVP.

## Key Decisions
- Moderation is the default publish mode.
- Operational analytics matter more than vanity dashboards.
- Telegram source ingestion is valuable, but can follow lower-complexity source connectors if needed.

## Open Questions
- Which source connectors should be mandatory for MVP day one?
- Does Breaking News require a dedicated fast-lane review experience in the first release?
- How much rubric customization is necessary before implementation becomes too broad?

## Next Actions
- Convert this scope into phase gates in `docs/delivery/phases.md`.
- Use this document as the default filter when future prompts request additional features.
