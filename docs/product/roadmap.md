# Roadmap

## Purpose
Show the intended product evolution from internal MVP to broader platform capabilities.

## Intended Audience
Founder, product strategist, delivery lead, and future architects making sequencing decisions.

## Phase 0: Repository And Operating Model
- Establish planning docs, Codex workflow rules, skills scaffolding, and MCP strategy.
- Create a clear implementation map before writing product code.

## Phase 1: Internal MVP
- Deliver the source-to-post workflow for one owner and one Telegram channel.
- Support the default rubric set.
- Launch with moderation-first editorial control and operational analytics.
- Validate that the system saves time and improves reaction speed.

## Phase 2: Reliability And Workflow Depth
- Improve source quality scoring and duplicate suppression.
- Add richer review controls, revisions, and feedback loops.
- Introduce tightly governed low-risk automation for narrow cases.
- Expand analytics from post outcomes into source and rubric optimization.

## Phase 3: Multi-Channel Readiness
- Generalize channel configuration and editorial policies.
- Support multiple channels under one operator while preserving per-channel voice and rubric strategies.
- Harden tenant-aware data boundaries without committing to full SaaS packaging.

## Phase 4: SaaS Foundation
- Add tenant administration, role-based collaboration, and cross-channel analytics.
- Prepare onboarding, billing, and self-serve configuration once the workflow proves valuable.
- Expand from Telegram-only to a multi-channel architecture if the domain model still holds.

## Roadmap Filters
- Advance only after the current phase proves operational value.
- Prefer extracting reusable abstractions from real MVP usage instead of speculative platform design.
- Keep source quality, editorial trust, and auditability ahead of automation depth.

## Key Decisions
- SaaS readiness is a design constraint now, not a delivery goal now.
- Product maturity should be measured by workflow quality and trust, not feature count.

## Open Questions
- Which evidence would justify moving from one-channel MVP to multi-channel support?
- Which future channels are most likely after Telegram?

## Next Actions
- Attach concrete delivery milestones to this roadmap in `docs/delivery/milestones.md`.
- Revisit roadmap gates after the first implementation plan exists.
