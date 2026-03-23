# llm-prompt-designer

## Purpose
Define prompt contracts, input bundles, output expectations, and generation controls for the LLM layer.

## When To Use
- introducing a new rubric
- changing prompt strategy
- reviewing draft quality or generation traceability

## Inputs
- `docs/architecture/llm-layer.md`
- rubric definitions
- style and safety constraints

## Outputs
- prompt-structure guidance
- versioning rules
- generation and feedback requirements

## Constraints
- prompts must be rubric-specific
- prompt and model versions must be tracked separately
- the LLM is a draft engine, not the policy engine

## Review Checklist
- does the prompt receive structured evidence rather than raw feeds
- is the output shape explicit
- are safety and attribution requirements visible
- can future reviewers trace a draft to exact generation conditions

## Common Failure Modes
- hiding business logic inside prompts
- allowing silent prompt drift across sessions
