# Implementation Plan: AI-assisted Study Generator

**Branch**: `001-ai-study-generator` | **Date**: 2025-11-04 | **Spec**: `spec.md`
**Input**: Feature specification from `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\spec.md`

## Summary

Deliver a web single-page application and a companion NestJS API enabling users to generate study sheets, flashcards and quizzes from course text using an AI provider. The MVP focuses on secure user access, reliable summary generation (3–6 bullets + suggested flashcards), quiz generation (configurable count and MCQ/open types), quiz completion with scoring, and quota enforcement (Free / Premium). The technical approach: React + Vite frontend (TS), NestJS backend (TS) with Prisma for persistence, an AI adapter layer to abstract provider calls, and testable hexagonal modules per feature.

## Technical Context

**Language/Version**: TypeScript 5.x for frontend and backend (Node 18+ for server)  
**Primary Dependencies**: 
- **Backend**: NestJS, Prisma, class-validator, Jest
- **Frontend**: React 18 + Vite, React Router, react-hook-form, zod, Shadcn UI, Tailwind CSS 4.1, Axios, Liveblocks Frimouse (emoji management)

**Storage**: Prisma ORM targeting PostgreSQL in production; SQLite for local development and CI.  
**Testing**: Jest for backend/unit tests, Vitest for frontend unit tests; integration tests for API using a test database.  
**Target Platform**: Web SPA (modern browsers) + Node.js server for API.  
**Project Type**: Web application — separated `frontend/` and `backend/` projects, feature-based layout.  
**Performance Goals**: Meet SC-001 from spec: summary generation within 30s for typical 1–3k-word text in 95% of cases (dependent on AI provider). API p95 targets TBD; initial goal: <500ms for non-AI endpoints.  
**Constraints**: AI provider latency & rate limits; enforce content size limits (e.g., recommend splitting >50k words); quota checks on creation endpoints (Free: 3 courses/3 quizzes).  
**Scale/Scope**: MVP sized for early users (hundreds of users). Design to allow scaling (stateless API, separate job queue for heavy generation tasks). 

## Constitution Check

GATE: The repository contains a `constitution.md` template at `.specify/memory/constitution.md` but it is not populated with project governance rules. Before Phase 0 complete we must either: (A) confirm the project's constitution (CI gates, test coverage minimums, release policies, observability requirements), or (B) accept the following working assumptions to proceed:

- Assumption A (working): All domain/business logic must have unit tests. Acceptance scenarios must have one integration test each in `backend/test/acceptance/`. CI must run lint and tests.  
- Assumption B (deferred): Exact coverage thresholds, observability, and SRE policies will be added to `CONSTITUTION.md` once stakeholders confirm.

Status: NEEDS CLARIFICATION — governance and CI gates must be confirmed; proceeding with the working assumptions above to unblock Phase 0 research.

## Project Structure

### Documentation (artifact locations for this feature)

Paths (absolute):

- Feature spec: `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\spec.md`  
- Plan (this file): `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\plan.md`  
- Acceptance checklist: `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\checklists\requirements.md`  
- Generated artifacts (Phase outputs):
  - `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\research.md`  
  - `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\data-model.md`  
  - `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\quickstart.md`  
  - `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\contracts\openapi.yaml`

### Source Code (concrete layout)

Repository root layout (chosen): Web application with separate frontend and backend.

``text
backend/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── auth.controller.ts
│   │   ├── courses/
│   │   ├── summaries/
│   │   ├── quizzes/
│   │   ├── flashcards/
│   │   └── ai/
│   ├── common/   # guards, pipes, interceptors, dtos
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── test/
    └── acceptance/

frontend/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── providers/
│   │   │   ├── pages/
│   │   │   ├── api/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── courses/
│   │   │   ├── components/
│   │   │   ├── providers/
│   │   │   │   ├── course-api-provider.tsx    # API instance provider
│   │   │   │   ├── courses-provider.tsx       # Data/state provider
│   │   │   │   └── course-create-provider.tsx # Creation dialog provider
│   │   │   ├── api/
│   │   │   │   ├── course-api.interface.ts
│   │   │   │   └── course-api.http.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── quizzes/
│   │   │   ├── components/
│   │   │   ├── providers/
│   │   │   │   ├── quiz-api-provider.tsx      # API instance provider
│   │   │   │   ├── quizzes-provider.tsx       # Data/state provider
│   │   │   │   └── quiz-create-provider.tsx   # Creation dialog provider
│   │   │   ├── api/
│   │   │   │   ├── quiz-api.interface.ts
│   │   │   │   └── quiz-api.http.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── flashcards/
│   │   ├── review/
│   │   ├── chat/
│   │   └── settings/
│   ├── common/              # Reusable components, hooks, types
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── app/
│   │   ├── AppRoutes.tsx
│   │   └── api.ts           # Axios instance
│   └── ui/                  # Shadcn + primitives
└── vitest.config.ts

docs/
└── quickstart.md
``

**Structure Decision**: Use the separated frontend/backend web application layout (Option 2). This matches the chosen stack (React SPA + NestJS API) and keeps concerns isolated for CI, deployments and scaling. Feature-based folders ensure domain separation and align with DDD/hexagonal layering in the backend.

## Phase summary and outputs (what / where)

- Phase 0 — Research (`research.md`): Resolve NEEDS CLARIFICATION entries (constitution, AI provider options, rate-limits, job/queue strategy). Output: `specs/001-ai-study-generator/research.md`.  
- Phase 1 — Design (`data-model.md`, `contracts/`, `quickstart.md`): Produce Prisma data model, OpenAPI contract stub (`contracts/openapi.yaml`), quickstart instructions and agent-context update. Output files live under `specs/001-ai-study-generator/`.  

## Complexity Tracking

No mandatory constitution violations currently accepted. Any future deviation (e.g., adding a mandatory message queue or different DB per feature) must be justified here with alternatives.

---

Next actions (recommended):

1. Confirm Constitution gates or accept the working assumptions listed above. (Owner: product/tech lead)  
2. Run Phase 0: create `research.md` resolving AI provider and queueing strategy.  
3. Run Phase 1: generate `data-model.md` (Prisma schema) and `contracts/openapi.yaml` and a `quickstart.md` to help other devs boot the project locally.

Paths to reference again: spec `spec.md`, checklist `checklists/requirements.md`, branch `001-ai-study-generator`.
