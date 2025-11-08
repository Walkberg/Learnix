# tasks.md — AI-assisted Study Generator

Feature: AI-assisted Study Generator
Spec: `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\spec.md`
Plan: `C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\plan.md`

Phase 1: Setup (project initialization)
- [X] T001 [P] Scaffold the frontend using Vite CLI into `frontend/` (commands):
	Run in repository root:
	- `npm create vite@latest frontend -- --template react-ts` (ran)
	- `cd frontend; npm install` (ran)
	Result: `frontend/` folder with `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/` files (main.tsx, App.tsx) and styles.
- [X] T002 [P] Scaffold the backend using the NestJS CLI into `backend/` (commands):
	Run in repository root:
	- `npx @nestjs/cli new backend --package-manager npm --skip-install` (ran)
	- `cd backend; npm install` (ran)
	Result: `backend/` folder with `package.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`, and feature folders.
- [X] T003 Create `backend/prisma/schema.prisma` (if missing) and add `backend/.env.example` with `DATABASE_URL` (dev: `file:./dev.db`)  
	- `backend/prisma/schema.prisma` exists (created earlier) and `backend/.env.example` created (ran)
- [X] T004 [P] Add environment templates: `frontend/.env.example` and `backend/.env.example` (include AI_PROVIDER, OPENAI_API_KEY, USE_QUEUE)
	- `frontend/.env.example` created (ran)
- [X] T005 Add `README.md` and `docs/quickstart.md` (copy `specs/001-ai-study-generator/quickstart.md`) in repo root and `specs/001-ai-study-generator/quickstart.md`
	- `README.md` created (ran); `specs/001-ai-study-generator/quickstart.md` exists already
- [X] T006 [P] Create basic GitHub Actions CI: `.github/workflows/ci.yml` running lint and tests for frontend and backend
	- `.github/workflows/ci.yml` created (ran)

Phase 2: Foundational (blocking prerequisites)
- [X] T010 Initialize dependencies (lockfiles): run `npm install` in `frontend/` and `backend/` and commit `package-lock.json` or `pnpm-lock.yaml` in each folder
- [X] T011 [P] Setup Prisma client and migration scripts: add `backend/package.json` scripts `prisma:generate`, `prisma:migrate` and run `npx prisma generate`
- [X] T012 [P] Implement AI Adapter scaffold: create `backend/src/features/ai/adapter.ts` (interface) and `backend/src/features/ai/openai-adapter.ts` + `backend/src/features/ai/mock-adapter.ts` (for CI/local)
- [X] T013 Create job queue scaffolding (optional, feature-flagged): `backend/src/jobs/worker.ts`, `backend/src/jobs/index.ts`, and `backend/src/config/queue.ts` (guarded by `USE_QUEUE` env var)
- [X] T014 [P] Add test harness & fixtures: `backend/test/helpers/testApp.ts`, `backend/test/fixtures/ai/` (mock prompts/responses)
- [X] T015 [P] Add linter & formatter configs: `.eslintrc.js`, `.prettierrc` at repo root

Phase 3: User Story Phases (priority order)

User Story US1 (P1) — Authenticate (FR-001)
Independent test criteria: Register a user, login, logout; protected routes require auth. Files: `backend/src/features/auth/*`, `frontend/src/features/auth/*`.
- [X] T100 [US1] Create backend auth domain & model files: `backend/src/features/auth/domain/user.entity.ts`, `backend/src/features/auth/dto/` and `backend/src/features/auth/auth.module.ts`
- [X] T101 [US1] Implement auth service (registration/login) in `backend/src/features/auth/application/auth.service.ts` and password hashing (bcrypt) in `backend/src/features/auth/infrastructure/password.util.ts`
- [X] T102 [US1] Add auth controller endpoints in `backend/src/features/auth/auth.controller.ts` (`POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`)
- [X] T103 [US1] Add auth guards and JWT strategy: `backend/src/common/guards/jwt.guard.ts`, `backend/src/common/strategies/jwt.strategy.ts`
- [X] T104 [P] Create frontend auth pages & forms: `frontend/src/features/auth/SignUp.tsx`, `frontend/src/features/auth/Login.tsx`, using `react-hook-form` + `zod` schemas in `frontend/src/features/auth/schema.ts`
- [X] T105 [US1] Create backend acceptance tests stubs (executable): `backend/test/acceptance/auth.spec.ts` (wire to testApp harness) and CI job to run them


User Story US2 (P1) — Generate a study sheet from text (FR-002, FR-003, FR-009 à FR-015)
Independent test criteria: Create a course which triggers async generation of a markdown summary and flashcards using Gemini AI. Gérer flashcards (CRUD), summaries, et appliquer la règle de format GET array.
- [X] T200 [US2] Create Course domain, repository & DTOs: `backend/src/features/courses/domain/course.entity.ts`, `backend/src/features/courses/infrastructure/course.repository.ts`
- [X] T201 [US2] Create domain events: `backend/src/features/courses/domain/events/course-created.event.ts` for async generation triggers
- [X] T202 [US2] Add course endpoints/controllers: `backend/src/features/courses/courses.controller.ts` (`POST /api/courses`, `GET /api/courses`, `GET /api/courses/:id`)
- [X] T203 [P] [US2] Implement GeminiAdapter: `backend/src/features/ai/gemini-adapter.ts` as default provider
- [X] T204 [US2] Create content generation worker: `backend/src/jobs/content-generation.worker.ts` to handle async generation
- [X] T205 [US2] Implement StudySheet markdown generation: `backend/src/features/summaries/application/use-cases/generate-study-sheet.usecase.ts`
- [X] T206 [P] [US2] Implement parallel Flashcard generation: `backend/src/features/flashcards/application/use-cases/generate-flashcards.usecase.ts`
- [X] T207 [P] Create frontend course creation form: `frontend/src/features/courses/CourseForm.tsx` and `frontend/src/features/courses/schema.ts`
- [X] T208 [P] Create study sheet viewer component: `frontend/src/features/summaries/StudySheetView.tsx` with markdown rendering
- [X] T209 [US2] Add acceptance tests: `backend/test/acceptance/summary.spec.ts` and `backend/test/acceptance/courses.spec.ts` (use mock AI adapter)
- [X] T210 [US2] Implement DELETE flashcard endpoint in `backend/src/features/flashcards/flashcards.controller.ts` (DELETE `/courses/:courseId/flashcards/:flashcardId`)
- [X] T211 [US2] Implement PATCH flashcard endpoint in `backend/src/features/flashcards/flashcards.controller.ts` (PATCH `/flashcards/:flashcardId`)
- [X] T212 [US2] Implement GET flashcards for course endpoint in `backend/src/features/flashcards/flashcards.controller.ts` (GET `/courses/:courseId/flashcards`)
- [X] T213 [US2] Implement GET summaries for course endpoint in `backend/src/features/summaries/summaries.controller.ts` (GET `/courses/:courseId/summaries`)
- [X] T214 [US2] Implement PATCH summary endpoint in `backend/src/features/summaries/summaries.controller.ts` (PATCH `/summaries/:summaryId`)
- [X] T215 [US2] Implement PATCH course endpoint in `backend/src/features/courses/courses.controller.ts` (PATCH `/courses/:courseId`)
- [X] T216 [US2] Enforce GET array response format rule (wrap arrays in `{ items: [...] }`) in all relevant backend endpoints (middleware or DTO)

User Story US3 (P2) — Generate a quiz from a course (FR-004)
Independent test criteria: Generate quiz with requested number of questions and MCQ options count. Response must follow array format rule (FR-015).
- [X] T300 [US3] Create Quiz domain entity with factory method: `backend/src/features/quizzes/domain/quiz.entity.ts` (properties: id, courseId, params, questions, createdAt)
- [X] T301 [US3] Create Quiz domain errors: `backend/src/features/quizzes/domain/errors/quiz.errors.ts`
- [X] T302 [US3] Create Quiz repository interface (port): `backend/src/features/quizzes/domain/ports/i-quiz-repository.ts` with methods: create(), findById(), findByCourseId()
- [X] T303 [US3] Create Quiz repository token: `backend/src/features/quizzes/domain/ports/tokens.ts` (export const QUIZ_REPOSITORY = 'QUIZ_REPOSITORY')
- [X] T304 [US3] Implement Prisma Quiz repository: `backend/src/features/quizzes/infrastructure/repositories/prisma-quiz.repository.ts` implementing IQuizRepository
- [X] T305 [US3] Create request DTOs as TypeScript interfaces: `backend/src/features/quizzes/dto/requests/create-quiz.dto.ts` (count, type properties)
- [X] T306 [US3] Create response DTOs as TypeScript interfaces: `backend/src/features/quizzes/dto/responses/quiz.response.dto.ts`, `quiz-list.response.dto.ts` (with items array wrapper)
- [X] T307 [US3] Create GenerateQuizUseCase: `backend/src/features/quizzes/application/use-cases/generate-quiz.usecase.ts` (inject QUIZ_REPOSITORY, IAI_SERVICE, emit QuizGeneratedEvent)
- [X] T308 [US3] Create GetQuizByIdUseCase: `backend/src/features/quizzes/application/use-cases/get-quiz-by-id.usecase.ts`
- [X] T309 [US3] Create ListQuizzesByCourseUseCase: `backend/src/features/quizzes/application/use-cases/list-quizzes-by-course.usecase.ts`
- [X] T310 [US3] Implement quizzes controller: `backend/src/features/quizzes/quizzes.controller.ts` (POST `/courses/:courseId/quizzes`, GET `/courses/:courseId/quizzes`, GET `/quizzes/:id`) using JwtAuthGuard, DomainExceptionFilter, import type for DTOs
- [X] T311 [US3] Create QuizGeneratedEvent: `backend/src/features/quizzes/domain/events/quiz-generated.event.ts`
- [X] T312 [US3] Create Quizzes module: `backend/src/features/quizzes/quizzes.module.ts` (provide QUIZ_REPOSITORY with PrismaQuizRepository, export QUIZ_REPOSITORY and use cases)
- [X] T313 [US3] Persist questions structure as Json in Prisma schema and implement MCQ options count validation in quiz entity
// Deferred Frontend (Quiz UI) — moved to Deferred Frontend Phase
// - [ ] T314 [P] Create frontend quiz creation UI: `frontend/src/features/quizzes/QuizCreateModal.tsx`, `frontend/src/features/quizzes/QuizList.tsx`
- [X] T315 [US3] Add acceptance test following TDD: `backend/test/acceptance/quiz.spec.ts` (generation assertions, array format validation)

Enhancement 2025-11-08 — Quiz explanations + discriminated types
- [X] T316 [US3] Enhance QuizQuestion typing to discriminated union (MCQ | OPEN) with mandatory `explanation` field in domain (`quiz.entity.ts`)
- [X] T317 [US3] Update AI adapter and prompts to include `explanation` (Gemini Zod schemas, response schema, `prompts.ts`, `mock-adapter.ts`)
- [X] T318 [US3] Update DTOs and controller mappings to expose `explanation` on all quiz endpoints
- [X] T319 [US3] Update acceptance tests to assert presence of `explanation` in responses and persisted data
- [X] T320 [US3] Update specs and contracts (`spec.md`, `data-model.md`, `contracts/openapi.yaml`) to reflect new question shapes

User Story US4 (P2) — Complete a quiz and view results (FR-005, FR-016, FR-017)
Independent test criteria: Submit answers; backend validates payload against stored quiz questions (no client-side scoring trust), computes score, persists attempt. Fetch single quiz and list quizzes: each includes requesting user's `lastAttemptSummary`.
- [X] T400 [US4] Create QuizAttempt domain entity & errors: `backend/src/features/quizzes/domain/quiz-attempt.entity.ts`, `backend/src/features/quizzes/domain/errors/quiz-attempt.errors.ts`
- [X] T401 [US4] Create QuizAttempt repository interface & token: `backend/src/features/quizzes/domain/ports/i-quiz-attempt-repository.ts`, `backend/src/features/quizzes/domain/ports/tokens.ts` (export const QUIZ_ATTEMPT_REPOSITORY)
- [X] T402 [US4] Implement Prisma QuizAttempt repository: `backend/src/features/quizzes/infrastructure/repositories/prisma-quiz-attempt.repository.ts`
- [X] T403 [US4] Add Prisma schema for attempts (if not present) updating `backend/prisma/schema.prisma` (model QuizAttempt with answers Json & score Int)
- [X] T404 [US4] Create SubmitQuizAttemptUseCase: `backend/src/features/quizzes/application/use-cases/submit-quiz-attempt.usecase.ts` (validate answer count, MCQ indices 0-3, OPEN answer normalization, compute score, persist attempt)
- [X] T405 [US4] Create GetLastAttemptForUserUseCase: `backend/src/features/quizzes/application/use-cases/get-last-attempt-for-user.usecase.ts`
- [X] T406 [US4] Extend GetQuizByIdUseCase to include lastAttemptSummary (compose with GetLastAttemptForUserUseCase) — handled in controller
- [X] T407 [US4] Extend ListQuizzesByCourseUseCase to map each quiz with lastAttemptSummary for requesting user — handled in controller
- [X] T408 [US4] Create attempt submission request/response DTOs: `backend/src/features/quizzes/dto/requests/submit-quiz-attempt.dto.ts`, `backend/src/features/quizzes/dto/responses/quiz-attempt.response.dto.ts`
- [X] T409 [US4] Update quiz response DTOs to optionally include `lastAttemptSummary` field: modify `quiz.response.dto.ts`, `quiz-list.response.dto.ts`
- [X] T410 [US4] Implement POST `/quizzes/:id/attempts` in `backend/src/features/quizzes/quizzes.controller.ts` mapping to SubmitQuizAttemptUseCase and returning attempt response + score
- [X] T411 [US4] Update GET `/quizzes/:id` controller mapping to add `lastAttemptSummary`
- [X] T412 [US4] Update GET `/courses/:courseId/quizzes` controller mapping to add `lastAttemptSummary` per item
- [X] T413 [US4] Add backend validation (class-validator or manual) ensuring MCQ answers are numbers within range & OPEN answers are non-empty trimmed strings before use case execution
- [X] T414 [US4] Update acceptance test to cover: valid submission, invalid answer count, invalid MCQ index, lastAttemptSummary presence (modify `backend/test/acceptance/quiz.spec.ts`)
// Deferred Frontend (Quiz Attempt & Results UI) — moved to Deferred Frontend Phase
// - [ ] T415 [P] [US4] Create frontend quiz player component with answer form: `frontend/src/features/quizzes/QuizPlayer.tsx`
// - [ ] T416 [P] [US4] Create frontend quiz results component showing score + per-question correctness: `frontend/src/features/quizzes/QuizResults.tsx`
// - [ ] T417 [US4] Update frontend quiz fetch logic to display last attempt summary in list/detail views: `frontend/src/features/quizzes/hooks/useQuiz.ts` (create if missing)
- [ ] T418 [US4] Update OpenAPI spec to add attempt submission endpoint and lastAttemptSummary schema: `specs/001-ai-study-generator/contracts/openapi.yaml`
- [ ] T419 [US4] Update documentation in `specs/001-ai-study-generator/spec.md` already applied (verify) and regenerate quickstart if needed

Final Phase: Polish & Cross-cutting concerns
- [ ] T900 Implement quota enforcement (Free vs Premium) in `backend/src/common/guards/quota.guard.ts` and service `backend/src/features/users/user.quota.ts` (maps to FR-006)
- [ ] T901 Implement graceful AI error handling and user-facing messages in `backend/src/features/ai/*` and frontend global error UI `frontend/src/ui/ErrorBanner.tsx` (maps to FR-007)
- [ ] T902 Add logging and basic observability: `backend/src/common/interceptors/logging.interceptor.ts`
- [ ] T903 Add end-to-end acceptance test that runs signup → create course → generate summary → generate quiz → take quiz (CI job)

Deferred Frontend Phase (post-backend stabilization)
// - [ ] T314 [Deferred] Quiz creation UI (depends on stable quiz DTOs)
// - [ ] T415 [Deferred] Quiz player (depends on attempt submission endpoint)
// - [ ] T416 [Deferred] Quiz results UI (depends on attempt scoring response shape)
// - [ ] T417 [Deferred] Quiz hooks/data integration (depends on lastAttemptSummary in responses)

Dependencies (story completion order)
1. Phase 1 (Setup) must be completed first. (T001..T006)
2. Phase 2 (Foundational) T010..T015 must be completed before story work begins.
3. US1 (Auth) should be implemented first (T100..T105), as other stories require authenticated users and quotas.
4. US2 (Study sheet) (T200..T205) depends on Auth and Foundational.
5. US3 (Quizzes generation) (T300..T304) depends on US2.
6. US4 (Quiz completion) (T400..T404) depends on US3.

Parallel execution examples
- Frontend scaffold (T001) and backend scaffold (T002) are parallelizable.
- AI adapter (T012) and job queue scaffolding (T013) can be implemented in parallel by different engineers.
- Frontend UI for courses (T207) and backend course endpoints (T202) can be worked on in parallel once the contracts are agreed.
- Quiz domain setup (T300-T306: entity, errors, ports, DTOs) can be parallelized across multiple developers.
- Frontend quiz UI (T314) can be developed in parallel with backend use cases (T307-T309) once DTOs are defined.

Implementation strategy
- MVP-first: deliver US1 and US2 (Authentication + Study sheet generation) as first release. US3 and US4 follow in next sprint.
- Use mock AI adapter in CI and local dev. Swap to OpenAI adapter behind `AI_PROVIDER` env var for production testing.
- Keep database simple (SQLite for local dev, Postgres for prod). Use Prisma migrations and seed scripts.

Validation checklist
// Updated after completing US4 backend tasks
- Total active tasks (excluding deferred): 76 (US4 backend tasks now completed)
- Tasks per story (active): US1:6, US2:17, US3:20 (T314 deferred), US4:17 (T415–T417 deferred) — all active US4 tasks done
- Deferred tasks: 4 (T314, T415, T416, T417)
- Parallel opportunities (active): T001/T002, T012/T013, T203/T204, T300-T306, T404–T409, T410–T412 (completed) 

Path to generated file:
`C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\tasks.md`

