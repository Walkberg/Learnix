# quickstart.md

This quickstart explains how to run the project locally (frontend + backend) for development.

## Prerequisites
- Node.js 18+ and npm
- pnpm recommended but npm works
- Install Redis if you enable the job queue (optional)

## Backend (NestJS)

1. cd backend
2. cp .env.example .env and set DATABASE_URL (default uses SQLite for local)
3. npm install
4. npx prisma migrate dev --name init
5. npm run start:dev

Key env vars:
- DATABASE_URL (e.g., file:./dev.db)
- AI_PROVIDER (openai | mock)
- OPENAI_API_KEY (if using openai)
- USE_QUEUE (true | false)

## Frontend (Vite + React)

1. cd frontend
2. npm install
3. npm run dev

The frontend expects the API to be reachable at `/api` (use proxy in Vite config or run frontend behind a local reverse proxy).

## Tests
- Backend unit/integration: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

## Notes
- For deterministic tests and to avoid provider costs, set `AI_PROVIDER=mock` in CI.
- To enable queue-based generation, start Redis and set `USE_QUEUE=true` and `USE_REDIS_URL` in `.env`.
