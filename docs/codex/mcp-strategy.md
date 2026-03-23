# MCP Strategy

## Purpose
Define which MCP servers this repository is expected to use, why they matter, and when they should be activated.

## Intended Audience
Codex operators, repo maintainers, and future implementation agents.

## Docs MCP
- Why needed: fast retrieval of official framework, API, and provider documentation during implementation and review
- When to enable: as soon as implementation planning or coding requires verified documentation
- Required now or later: recommended now, especially once architecture turns into code

## Browser Or Playwright MCP
- Why needed: later verification of UI flows, admin workflows, and publishing-related interactions
- When to enable: when frontend or end-to-end behavior needs inspection
- Required now or later: later

## GitHub MCP
- Why needed: issue, PR, milestone, and cross-repo coordination once delivery moves beyond local planning
- When to enable: when GitHub workflow becomes part of execution
- Required now or later: later

## Database MCP
- Why needed: schema introspection, query support, and environment debugging once a real persistence layer exists
- When to enable: only after database design becomes concrete and a live environment exists
- Required now or later: later

## MCP Policy
- Enable only the servers the current phase needs.
- Do not store secrets in repo config.
- Prefer explicit rationale for every enabled server.

## Key Decisions
- MCP activation is phased, not all-at-once.
- Docs access provides the earliest value; browser, GitHub, and database tooling follow later.

## Open Questions
- Which documentation sources should be considered canonical for Telegram integrations and chosen backend technologies?

## Next Actions
- Keep `.codex/config.toml` as a draft until implementation work starts.
