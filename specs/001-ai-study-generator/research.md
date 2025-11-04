# research.md

## Purpose
Resolve open questions from `plan.md` (constitution, AI provider, job strategy, retry/backoff, local dev mocking) and record decisions, rationale and alternatives.

---

### Decision: Constitution & CI gates
- Decision: Proceed with working assumptions to unblock development:
  - CI runs lint, tests, and basic security checks (npm audit)
  - Each feature must include unit tests; acceptance scenarios must have integration tests under `backend/test/acceptance/`.
  - No strict coverage threshold enforced initially; aim for >70% on critical domain logic and increase over time.

- Rationale: The repository had a template constitution. To avoid blocking work, sensible defaults ensure quality without waiting on governance meetings.

- Alternatives considered:
  - Enforce 90% coverage before merge — rejected (too strict for early MVP).
  - Require full observability/tracing upfront — deferred to later.

---

### Decision: AI provider
- Decision: Start with OpenAI-compatible API (OpenAI or an OpenAI-compatible provider) via an AI Adapter layer. Default provider: OpenAI (gpt-4.1 or gpt-4o if available), with a provider-agnostic interface to switch later.

- Rationale:
  - OpenAI provides strong prompt engineering capabilities and reliable completions for summarization and question generation.
  - Adapter pattern keeps domain code provider-agnostic and testable.

- Alternatives considered:
  - Cohere, Anthropic, or local LLMs: these are viable but vary in cost/performance. Consider them if compliance or cost requires it.

---

### Decision: Generation strategy (sync vs async)
- Decision: Use synchronous HTTP generation for short texts (under a configurable threshold, e.g., 10k tokens). For longer jobs or to improve UX/scale, use an async job queue (BullMQ + Redis) and a background worker to call the AI provider.

- Rationale: Simpler sync approach for MVP; queue allows retries, backoff and resilience for heavy or slow tasks.

- Alternatives considered:
  - Use only async queue from the start — adds infra complexity; chosen to phase in queue when needed.

---

### Decision: Retry / Backoff
- Decision: Implement retry with exponential backoff for AI calls at the adapter level. Use 3 retries with jitter for transient errors (5xx, rate limits). Record failures and expose friendly user messages.

- Rationale: Network and provider failures are transient; retries reduce user-visible errors.

---

### Decision: Local development & testing
- Decision: Provide a local mock adapter and recorded prompts/responses for deterministic tests. Use env var `AI_PROVIDER=mock` or `AI_PROVIDER=openai`.

- Rationale: Avoids hitting provider limits and cost during development and CI. Enables reliable integration tests by stubbing or using recorded fixtures.

---

### Security & Cost Controls
- Rate-limit user-triggered generation endpoints on API level. Implement server-side quota enforcement (Free vs Premium).
- Log prompt lengths and token estimates for cost analysis; implement alerting if costs spike.

---

### Output: Next steps
1. Implement `backend/src/features/ai/adapter` with provider interface and default OpenAI adapter.
2. Add BullMQ worker scaffolding (config guarded by env var `USE_QUEUE=true`).
3. Implement mock adapter and record fixtures under `backend/test/fixtures/ai/`.

