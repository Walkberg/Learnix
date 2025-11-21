**Feature**: Quiz Detail — pages and routing

**Overview**
This document lists concrete implementation tasks to add a quiz detail flow: visiting `/quizzes/:quizId` should fetch the quiz, then redirect to the quiz player (`/quizzes/:quizId/play`) if no last attempt exists, or to results (`/quizzes/:quizId/results`) if a last attempt exists. It also covers the pages and provider required for the flow.

**Phase 1: Setup**
- [X] T001 Run repository prerequisites script to confirm feature docs and paths `.specify/scripts/powershell/check-prerequisites.ps1`

**Phase 2: Foundational**
- [X] T002 Ensure quiz API client exists and exports the required methods (e.g. `getQuizById`, `getLastAttemptForQuiz`) in `frontend/src/features/quizzes/api/quiz-api.ts`

**Phase 3: User Story Implementation (US8)**
- [X] T003 [US8] Create `QuizDetailProvider` in `frontend/src/features/quizzes/providers/quiz-detail-provider.tsx` that:
  - fetches quiz by route param `quizId`,
  - exposes `{ quiz, lastAttempt, isLoading, error, refresh, anim? }`,
  - handles 404 and network errors.

- [X] T004 [P] [US8] Implement `QuizDetailWrapper` in `frontend/src/features/quizzes/components/QuizDetailWrapper.tsx` that:
  - consumes `QuizDetailProvider`, shows loading/error UI,
  - redirects to `/quizzes/:quizId/results` when `lastAttempt` exists, otherwise to `/quizzes/:quizId/play`.

- [X] T005 [P] [US8] Add route mounting for quiz detail wrapper in `frontend/src/app/router.tsx`:
  - mount the wrapper at `path: 'quizzes/:quizId'` (or as child of existing `quizzes` route), preserving the nested `play` and `results` child routes.

- [X] T006 [US8] Create `QuizPlayerPage` skeleton at `frontend/src/features/quizzes/pages/QuizPlayerPage.tsx` that:
  - consumes the provider for quiz data,
  - renders quiz title, question view, navigation controls and submit CTA,
  - exposes hooks/placeholders for timer/answer submission.

- [X] T007 [US8] Create `QuizResultsPage` skeleton at `frontend/src/features/quizzes/pages/QuizResultsPage.tsx` that:
  - consumes provider `lastAttempt` & `quiz`,
  - displays score summary, per-question feedback, and retry or review actions.

- [X] T008 [US8] Ensure `QuizPlayerPage` and `QuizResultsPage` read the same provider instance:
  - wrap the nested `play` and `results` routes with `QuizDetailProvider` or have `QuizDetailWrapper` provide context to children.
  - Files: `frontend/src/app/router.tsx`, `frontend/src/features/quizzes/components/QuizDetailWrapper.tsx`.

- [X] T009 [US8] Add unit tests for `QuizDetailProvider` in `frontend/src/features/quizzes/providers/quiz-detail-provider.spec.tsx`:
  - mock `quiz-api` responses for quiz present / lastAttempt present / errors,
  - assert provider state and exposed values.

- [X] T010 [US8] Add an integration/acceptance test asserting `/quizzes/:id` redirects to the correct route depending on `lastAttempt` presence in `test/acceptance/quiz-detail-routing.spec.ts`.

**Final Phase: Polish & UX**
- [ ] T011 [US8] Implement UX polish per UX doc: timer styling, headers, CTAs, mobile layout updates in:
  - `frontend/src/features/quizzes/pages/QuizPlayerPage.tsx`,
  - `frontend/src/features/quizzes/pages/QuizResultsPage.tsx`,
  - `frontend/src/features/quizzes/components/QuizDetailWrapper.tsx`.

**Dependencies**
- `T003` (provider) must complete before `T004` and `T006` (wrapper and pages) can fully function.
- `T005` (router) should be updated after `T004` is added so the wrapper is referenced correctly.
- Tests (`T009`, `T010`) depend on `T003` + `T004` being implemented (provider + wrapper).

**Parallel execution opportunities**
- `T004` (wrapper) and `T005` (router route) can be implemented in parallel with `T006`/`T007` (player/results pages) by different contributors — mark `T004`, `T006`, `T007` as parallel-capable if desired.
- `T009` (unit tests) can be developed in parallel with page skeletons once the provider interface is defined.

**Counts & Summary**
- Total tasks: 11
- Tasks for user story `US8`: 9 tasks (T003, T004, T005, T006, T007, T008, T009, T010, T011)
- Suggested MVP scope: implement `T003` → `T004` → `T005` → `T006` so visiting `/quizzes/:id` redirects correctly and a basic player page is available.

If you want, I can implement `T003` (provider) and `T004` (wrapper) now and open a PR. Do you want me to start coding those files?

**Phase 4: Attempt Page — Component Implementation (US8)**
These are the UI components required by the UX document to implement a usable quiz attempt experience. Components are parallelizable between developers.
- [ ] T012 [P] [US8] Implement `QuizHeader` component in `frontend/src/features/quizzes/components/QuizHeader.tsx` — shows title, subtitle, time remaining and progress.
- [ ] T013 [P] [US8] Implement `QuestionCard` component in `frontend/src/features/quizzes/components/QuestionCard.tsx` — renders question body and media.
- [ ] T014 [P] [US8] Implement `AnswerOption` component in `frontend/src/features/quizzes/components/AnswerOption.tsx` — selectable option with selected/disabled states.
- [ ] T015 [P] [US8] Implement `QuizTimer` component in `frontend/src/features/quizzes/components/QuizTimer.tsx` — visual countdown, pause/resume hooks.
- [ ] T016 [P] [US8] Implement `QuizProgress` component in `frontend/src/features/quizzes/components/QuizProgress.tsx` — shows current question index / total and progress bar.
- [ ] T017 [US8] Integrate attempt components into `QuizPlayerPage` at `frontend/src/features/quizzes/pages/QuizPlayerPage.tsx` — wire provider data, navigation (next/prev), submit flow and timer.

**Phase 5: Results Page — Component Implementation (US8)**
Components and integration required to present the results and allow review/retry.
- [ ] T018 [P] [US8] Implement `ResultsHeader` in `frontend/src/features/quizzes/components/ResultsHeader.tsx` — shows quiz title, attempt timestamp and score summary.
- [ ] T019 [P] [US8] Implement `ScoreBadge` in `frontend/src/features/quizzes/components/ScoreBadge.tsx` — visual score / percentile badge.
- [ ] T020 [P] [US8] Implement `QuestionReview` in `frontend/src/features/quizzes/components/QuestionReview.tsx` — per-question display with correct answer and user selection.
- [ ] T021 [P] [US8] Implement `RetryButton` in `frontend/src/features/quizzes/components/RetryButton.tsx` — CTA to retry the quiz (triggers create attempt flow).
- [ ] T022 [P] [US8] Implement `ShareResults` in `frontend/src/features/quizzes/components/ShareResults.tsx` — optional share or export results control.
- [ ] T023 [US8] Integrate results components into `QuizResultsPage` at `frontend/src/features/quizzes/pages/QuizResultsPage.tsx` — consume `lastAttempt` & `quiz` from provider and render review.

**Updated Counts & Summary**
- Total tasks: 23
- Tasks for user story `US8`: 19 tasks (T003–T011, T012–T023)
- Parallel opportunities: component implementations (`T012`–`T016`, `T018`–`T022`) are parallelizable — mark them with `[P]` to indicate independent work.
- Independent test criteria additions:
  - Each component must render with mock data and expose accessibility attributes (role, aria-labels) for automated checks.
  - Integration tasks (`T017`, `T023`) must render provider data and handle empty/error states.

**Next steps**
- Pick an initial subset to implement (recommended MVP): `T003`, `T004`, `T005`, `T012`, `T013`, `T017` so the quiz attempt experience is functional with basic UI.
- I can start implementing `T003` + `T004` now and follow with `T012` + `T013` — confirm and I will create the provider and wrapper files.

---
All tasks follow the checklist format and include exact file paths. Tell me which tasks I should start implementing now.