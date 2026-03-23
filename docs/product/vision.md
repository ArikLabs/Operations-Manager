# Vision

## Purpose
Define why this product exists, who it is for, and what durable product principles should guide decisions.

## Intended Audience
Founder, product strategist, solution architect, and any future implementation agent that needs product intent before writing code.

## Product Thesis
Running a high-signal Telegram channel is an operations problem, not only a writing problem. The advantage comes from discovering important events quickly, converting them into rubric-specific drafts fast, and preserving editorial quality while reducing manual effort.

## Vision Statement
Build a source-first Telegram content operations system that helps the owner of the "Ukrainian Investor" channel move from fragmented manual publishing to a repeatable, measurable, AI-assisted editorial workflow.

## Product Principles
- Internal-first before SaaS-first.
- Telegram-only before multi-platform.
- Human-in-the-loop before autopilot.
- Source quality before model cleverness.
- Rubrics before ad hoc posting.
- Traceability before automation depth.
- Informational analysis before recommendation-style content.

## Target User
The primary user is one owner-editor running the "Ukrainian Investor" channel. This user selects sources, defines rubric strategy, reviews drafts, edits copy, schedules posts, and evaluates performance.

## Value Proposition
- Reduce daily operating overhead.
- Shorten event-to-draft and event-to-publish time for breaking items.
- Make output quality more consistent across recurring rubrics.
- Preserve editorial control without blocking future automation.
- Create a foundation that can later support more channels and tenants.

## Key Decisions
- The MVP serves one owner and one primary channel.
- The system starts with Telegram publishing only.
- Editorial moderation is the default publish mode.
- Explicit buy or sell calls are out of scope by default.
- The main abstraction is the rubric, not the post template alone.

## Open Questions
- Which sources should be treated as highest-trust in the first release?
- What level of auto-publish is acceptable for Breaking News after the workflow proves reliable?
- Which editorial tone best fits the target audience for "Ukrainian Investor" at launch?

## Next Actions
- Lock the initial source strategy in `docs/architecture/source-ingestion.md`.
- Turn rubric principles into implementation-ready config requirements.
- Define an editorial style profile before prompt and UI implementation starts.
