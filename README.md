# Learnix — AI-assisted Study Generator

Learnix is a learning platform that helps students create study materials (summaries, flashcards and quizzes) assisted by AI. This mono-repo contains a TypeScript React frontend and a NestJS backend along with scripts, specs and test fixtures used during development.

This README gives a practical overview of the project, how to run it locally, where to find important code, and how to contribute.

**Quick links**

- Frontend: `frontend/`
- Backend: `backend/`
- Specs and feature plans: `specs/001-ai-study-generator/`
- Prisma schema & migrations: `backend/prisma/`

## Tech stack

- Frontend: React (18+), TypeScript, Vite, Tailwind CSS, React Router
- Backend: NestJS (TypeScript), Prisma (Postgres compatible migrations), Axios for HTTP clients
- Testing: Jest (backend & e2e), React Testing Library (frontend)
- Other: lucide-react icons, shadcn-style primitives, Zod/react-hook-form on forms

## Project structure (top-level)

- `frontend/` — React app (Vite), UI components, feature pages
- `backend/` — NestJS server, API, Prisma schema and migrations
- `specs/` — feature specs, tasks and design documents
- `tests/` and `backend/test/` — test fixtures and e2e tests

## Local setup (dev)

Prerequisites:

- Node.js (18+)
- pnpm or npm (this repo uses pnpm in CI; npm works for local if you prefer)
- (optional) Docker & Postgres if you want to run the database in a container

1. Install dependencies

```powershell
cd c:\Users\samue\Documents\Code\Learnix\frontend
npm install
cd ..\backend
npm install
```

2. Backend database (Prisma)

The backend uses Prisma migrations stored under `backend/prisma/migrations`. For local development you can run a Postgres instance (Docker recommended) and point the `DATABASE_URL` env var to it.

Example using Docker (Postgres):

```powershell
docker run --name learnix-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
setx DATABASE_URL "postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

Then run migrations from the `backend` folder:

```powershell
cd backend
npm run prisma:migrate # or pnpm prisma migrate dev
```

3. Run services

- Start backend (NestJS):

```powershell
cd backend
npm run start:dev
```

- Start frontend (Vite):

```powershell
cd frontend
npm run dev
```

Open the frontend at `http://localhost:5173` (default Vite port) and the backend at `http://localhost:3000`.

## Key developer workflows

- Run all tests (backend & frontend):

```powershell
cd backend
npm test
cd ..\frontend
npm test
```

- Lint frontend and backend:

```powershell
npm run --prefix backend lint
npm run --prefix frontend lint
```

- Generate/format code (if relevant): run the project's configured formatters/linters.

## Features and where to look

- Quiz & attempt flows: `frontend/src/features/quizzes/` (providers, pages, components)
- Quiz API adapter: `frontend/src/features/quizzes/api/quiz-api.http.ts`
- Providers: `frontend/src/features/quizzes/providers/` (detail, attempt, quizzes list)
- Chat MVP (in-course chat): `frontend/src/features/chat/` (provider, components, page)
- Backend controllers and services: `backend/src/features/`

## Specs and tasks

Feature specs, task breakdowns and design docs live in `specs/001-ai-study-generator/`. Use these when implementing features — tasks are written in checklist format so they can be marked as complete as work progresses.

## Contributing

1. Create a feature branch from `001-ai-study-generator` (or main branch as appropriate):

```powershell
git checkout -b feat/your-feature
```

2. Run and implement, create small commits and open a PR describing the change. Include relevant spec/task IDs in the PR description (e.g. `T024`).

3. If you add new routes or pages, update `frontend/src/app/router.tsx` and add tests.

## Notes & tips

- Many features use a provider pattern (`useXxx`) to centralize state for pages — follow existing patterns when adding new UI.
- Reuse existing components in `frontend/src/features/quizzes/components` and `frontend/src/common` where possible.
- When posting attempts or creating entities, prefer the HTTP adapters in `frontend/src/features/*/api` so network calls are centralized.

