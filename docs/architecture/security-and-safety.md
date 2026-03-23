# Security And Safety

## Purpose
Define the minimum trust, access, audit, and content-safety rules that the system must enforce.

## Intended Audience
Solution architect, backend architect, safety reviewer, and future implementation agents.

## Security Scope
The MVP is internal-first, but it still handles sensitive operational data, editorial decisions, and publishing permissions. Internal use is not a reason to skip access, audit, or safety controls.

## Access And Roles
- Limit publishing and high-risk configuration actions to trusted users.
- Keep roles explicit even if MVP starts with one owner.
- Design permissions so later multi-user expansion does not require redefining the workflow.

## Audit Requirements
- Record source lineage, draft lineage, prompt version, review action, and publish action.
- Keep durable audit records for configuration changes affecting sources, rubrics, prompts, and publishing policy.
- Make it possible to explain who approved what and on what basis.

## Content Safety Rules
- No explicit buy or sell signals by default.
- No unsupported claims presented as facts.
- No publish path that bypasses review for high-risk content.
- Financial implications should be framed as analysis, not instruction, unless policy changes later.

## Operational Safeguards
- Idempotent publish behavior to avoid duplicate posts.
- Retry policies with failure visibility.
- Manual override for queue correction, rescheduling, and incident response.

## Key Decisions
- Safety policy is part of the product design, not a post-processing add-on.
- Auditability is required even for an internal-first MVP.
- Conservative content policy is the default posture.

## Open Questions
- Which rubric types require an elevated safety review gate?
- What minimum audit retention period is appropriate once implementation starts?

## Next Actions
- Tie rubric definitions to safety expectations before implementation.
- Add a safety review step to any future plan that increases automation depth.
