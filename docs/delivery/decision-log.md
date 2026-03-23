# Decision Log

## Purpose
Record durable product and architecture decisions that future sessions must honor or explicitly supersede.

## Intended Audience
Founder, architects, delivery lead, and future implementation agents.

## 2026-03-24 - D001 - Product Is Internal-First
- Decision: Build for an internal one-owner workflow first, with future SaaS potential.
- Why: This keeps scope tight while preserving a realistic path to a broader platform.

## 2026-03-24 - D002 - Telegram-Only MVP
- Decision: The MVP will publish to Telegram only.
- Why: This focuses implementation on the highest-value channel and avoids premature multi-platform complexity.

## 2026-03-24 - D003 - Human-In-The-Loop Default
- Decision: Moderation and editorial review are the default publish path.
- Why: The product operates in a high-signal, high-risk information domain where quality and trust matter more than raw automation.

## 2026-03-24 - D004 - Source-First Architecture
- Decision: Source quality, normalization, and event detection are first-order system concerns.
- Why: Draft quality depends on evidence quality more than on prompt sophistication alone.

## 2026-03-24 - D005 - No Explicit Buy Or Sell Signals By Default
- Decision: Financial content defaults to informational analysis rather than recommendation-style output.
- Why: This reduces policy, trust, and reputational risk in the MVP.

## 2026-03-24 - D006 - One Backend Boundary For MVP
- Decision: Start with one deployable backend boundary and explicit internal seams.
- Why: This reduces delivery overhead while preserving a clear future expansion path.

## Key Decisions
- This file is the canonical place for durable decisions.
- Future changes must add a new entry rather than silently replacing prior intent.

## Open Questions
- Which future decision areas need their own recurring log sections, such as prompts, source trust policy, or automation thresholds?

## Next Actions
- Add new entries whenever implementation planning changes a durable assumption.
