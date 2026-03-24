# Architecture Overview

## Purpose
Define system boundaries, major capabilities, and architecture principles for the first implementation stage and beyond.

## Intended Audience
Solution architect, backend architect, implementation agents, and reviewers evaluating design choices.

## System Boundary
The system owns the internal content operations workflow from source ingestion through editorial review, scheduling, publishing to Telegram, and post-publication analytics. It does not own trading execution, portfolio advice, or external channel management beyond the configured Telegram publishing scope.

## Architecture Shape
- Start with one backend boundary and explicit internal modules.
- Treat source adapters, LLM providers, and publishing integrations as replaceable edges.
- Use asynchronous processing for ingestion, detection, draft generation, and publishing.
- Keep one operational datastore as the canonical system of record in MVP.
- Design internal events and state transitions so later service extraction is mechanical rather than disruptive.

## Core Modules
- Source ingestion
- Event detection and prioritization
- Rubric and prompt configuration
- Draft generation and revision
- Editorial workflow
- Scheduling and publishing
- Analytics and feedback
- Admin and control-plane functions

## Design Principles
- Source-first over model-first
- Human approval as a first-class path
- Explicit state over hidden workflow logic
- Idempotent writes and retries by default
- Full lineage and auditability
- SaaS-aware data shapes without SaaS infrastructure yet

## Runtime Topology Guidance
- Ingestion and publishing should be queue-oriented.
- Review and administration should operate on explicit workflow states.
- Analytics should begin as operational reporting over canonical events and records.

## Key Decisions
- One deployable backend boundary is preferred for MVP.
- The architectural seams should exist before service decomposition.
- Telegram-only publishing is a deliberate simplification, not a permanent product assumption.

## Open Questions
- Which message queue and datastore choices best fit the eventual implementation without overbuilding?
- How much of the ingestion flow should run near real time versus scheduled polling in the first release?

## Next Actions
- Finalize domain entities and state transitions in `domain-model.md`.
- Lock ingestion and editorial policies before implementation planning begins.
