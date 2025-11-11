# Tasks: Course Detail Page with Tabs

**Feature Branch**: `001-ai-study-generator`  
**Input**: User request for course detail page with summary/flashcard tabs and quiz management  
**Prerequisites**: plan.md, spec.md, data-model.md, ux-design.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Overview

This feature adds a comprehensive course detail page with:
1. **Left panel**: Tabbed interface for course summary (markdown) and flashcards (stack interface)
2. **Right panel**: Quiz statistics, quiz creation, and quiz list for the course
3. **Providers**: Separate providers for flashcard management and course-specific quiz management

The implementation follows the existing frontend architecture with API providers, data providers, and UI components.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Backend API endpoints and types for course detail data

- [ ] T001 [P] Add GET `/courses/:courseId` endpoint in `backend/src/features/courses/courses.controller.ts` with course details including summary
- [ ] T002 [P] Create `CourseDetailResponseDto` interface in `backend/src/features/courses/dto/responses/course-detail.response.dto.ts`
- [ ] T003 [P] Update `GetCourseByIdUseCase` to include latest summary in `backend/src/features/courses/application/use-cases/get-course-by-id.usecase.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and API infrastructure that all course detail features depend on

**⚠️ CRITICAL**: No course detail UI work can begin until this phase is complete

- [ ] T004 Add `CourseDetail` type to `frontend/src/features/courses/types.ts` (includes course + summary + stats)
- [ ] T005 Add `getCourseDetail(id: string): Promise<CourseDetail>` method to `CourseApi` interface in `frontend/src/features/courses/api/course-api.interface.ts`
- [ ] T006 Implement `getCourseDetail` in `HttpCourseApi` in `frontend/src/features/courses/api/course-api.http.ts`
- [ ] T007 Create `FlashcardStats` and `QuizStats` types in `frontend/src/features/courses/types.ts`

**Checkpoint**: Foundation ready - course detail page implementation can now begin

---

## Phase 3: User Story 1 - Course Detail Layout & Navigation (Priority: P1) 🎯 MVP

**Goal**: Display course detail page with header (icon + title) and tab navigation structure

**Independent Test**: Navigate to `/courses/:id`, verify header displays course emoji and title, verify tab navigation shows "Fiche" and "Flashcards" tabs

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create `CourseDetailPage` component in `frontend/src/features/courses/pages/CourseDetailPage.tsx`
- [ ] T009 [P] [US1] Create `CourseDetailHeader` component in `frontend/src/features/courses/components/CourseDetailHeader.tsx` (displays emoji + title + kebab menu)
- [ ] T010 [P] [US1] Create `CourseTabNavigation` component in `frontend/src/features/courses/components/CourseTabNavigation.tsx` (tabs: Fiche | Flashcards)
- [ ] T011 [US1] Add route `/courses/:id` → `CourseDetailPage` in `frontend/src/app/router.tsx`
- [ ] T012 [US1] Add nested routes `/courses/:id/summary` and `/courses/:id/flashcards` in `frontend/src/app/router.tsx`
- [ ] T013 [US1] Implement `useCourseDetail(id: string)` hook in `frontend/src/features/courses/providers/courses-provider.tsx`

**Checkpoint**: At this point, course detail page layout should display with proper navigation

---

## Phase 4: User Story 2 - Summary Tab Display (Priority: P1) 🎯 MVP

**Goal**: Display AI-generated course summary as markdown in left panel of Fiche tab

**Independent Test**: Navigate to `/courses/:id/summary`, verify markdown summary displays with proper formatting

### Backend Implementation for User Story 2

- [ ] T014 [P] [US2] Add `summaryMarkdown` field to `CourseDetailResponseDto` in `backend/src/features/courses/dto/responses/course-detail.response.dto.ts`
- [ ] T015 [US2] Update `GetCourseByIdUseCase` to fetch latest summary markdown in `backend/src/features/courses/application/use-cases/get-course-by-id.usecase.ts`

### Frontend Implementation for User Story 2

- [ ] T016 [P] [US2] Create `SummaryTabContent` component in `frontend/src/features/summaries/components/SummaryTabContent.tsx`
- [ ] T017 [P] [US2] Ensure `MarkdownRenderer` component exists in `frontend/src/components/MarkdownRenderer.tsx` (may already exist)
- [ ] T018 [US2] Add route handler for `/courses/:id/summary` rendering `SummaryTabContent` in `frontend/src/app/router.tsx`
- [ ] T019 [US2] Update `CourseDetail` type to include `summaryMarkdown?: string` in `frontend/src/features/courses/types.ts`

**Checkpoint**: Summary tab should display formatted markdown content

---

## Phase 5: User Story 3 - Flashcard Management Provider (Priority: P2)

**Goal**: Create provider for flashcard CRUD operations (create, update, delete, list) for a course

**Independent Test**: Provider should expose hooks for flashcard operations, all CRUD operations should call correct API endpoints

### Backend API for User Story 3

- [ ] T020 [P] [US3] Verify GET `/courses/:courseId/flashcards` endpoint exists and returns `{ items: Flashcard[] }` in `backend/src/features/flashcards/flashcards.controller.ts`
- [ ] T021 [P] [US3] Verify POST `/courses/:courseId/flashcards` endpoint exists in `backend/src/features/flashcards/flashcards.controller.ts`
- [ ] T022 [P] [US3] Verify PATCH `/flashcards/:flashcardId` endpoint exists in `backend/src/features/flashcards/flashcards.controller.ts`
- [ ] T023 [P] [US3] Verify DELETE `/courses/:courseId/flashcards/:flashcardId` endpoint exists in `backend/src/features/flashcards/flashcards.controller.ts`

### Frontend API Provider for User Story 3

- [ ] T024 [P] [US3] Create `FlashcardApi` interface in `frontend/src/features/flashcards/api/flashcard-api.interface.ts` with methods: `getFlashcardsByCourse`, `createFlashcard`, `updateFlashcard`, `deleteFlashcard`
- [ ] T025 [P] [US3] Create `HttpFlashcardApi` implementation in `frontend/src/features/flashcards/api/flashcard-api.http.ts`
- [ ] T026 [US3] Create `FlashcardApiProvider` in `frontend/src/features/flashcards/providers/flashcard-api-provider.tsx` exposing `useFlashcardApi()` hook
- [ ] T027 [US3] Create `FlashcardsProvider` in `frontend/src/features/flashcards/providers/flashcards-provider.tsx` exposing `useFlashcards(courseId: string)` hook
- [ ] T028 [US3] Add `FlashcardApiProvider` and `FlashcardsProvider` to provider hierarchy in `frontend/src/main.tsx`

**Checkpoint**: Flashcard provider ready for UI integration

---

## Phase 6: User Story 4 - Flashcard Stack UI (Priority: P2)

**Goal**: Display flashcards as interactive stack with navigation, edit/delete buttons

**Independent Test**: Navigate to `/courses/:id/flashcards`, verify flashcards display in stack format with card counter (1/X), edit/delete buttons, and navigation arrows

### Implementation for User Story 4

- [ ] T029 [P] [US4] Create `FlashcardTabContent` component in `frontend/src/features/flashcards/components/FlashcardTabContent.tsx` (main container)
- [ ] T030 [P] [US4] Create `FlashcardStack` component in `frontend/src/features/flashcards/components/FlashcardStack.tsx` (manages stack state and navigation)
- [ ] T031 [P] [US4] Create `FlashcardCard` component in `frontend/src/features/flashcards/components/FlashcardCard.tsx` (displays single card with flip animation)
- [ ] T032 [P] [US4] Create `FlashcardCardHeader` component in `frontend/src/features/flashcards/components/FlashcardCardHeader.tsx` (shows "1/X" counter, edit/delete icons)
- [ ] T033 [P] [US4] Create `FlashcardNavigation` component in `frontend/src/features/flashcards/components/FlashcardNavigation.tsx` (prev/next arrows + add button)
- [ ] T034 [US4] Add route handler for `/courses/:id/flashcards` rendering `FlashcardTabContent` in `frontend/src/app/router.tsx`
- [ ] T035 [US4] Integrate `useFlashcards(courseId)` hook in `FlashcardTabContent`

**Checkpoint**: Flashcard stack interface should be fully functional with navigation

---

## Phase 7: User Story 5 - Flashcard Edit/Delete Dialogs (Priority: P2)

**Goal**: Allow editing and deleting flashcards via dialogs triggered from card header buttons

**Independent Test**: Click edit icon on flashcard, verify dialog opens with current question/answer, save changes and verify update. Click delete icon, verify confirmation and deletion.

### Implementation for User Story 5

- [ ] T036 [P] [US5] Create `EditFlashcardDialog` component in `frontend/src/features/flashcards/components/EditFlashcardDialog.tsx` with form (question + answer fields)
- [ ] T037 [P] [US5] Create `DeleteFlashcardDialog` component in `frontend/src/features/flashcards/components/DeleteFlashcardDialog.tsx` (confirmation dialog)
- [ ] T038 [US5] Integrate edit/delete handlers in `FlashcardCard` component in `frontend/src/features/flashcards/components/FlashcardCard.tsx`
- [ ] T039 [US5] Connect dialogs to provider methods (`updateFlashcard`, `deleteFlashcard`) in `FlashcardTabContent`

**Checkpoint**: Flashcard editing and deletion should work end-to-end

---

## Phase 8: User Story 6 - Quiz Statistics Panel (Priority: P2)

**Goal**: Display quiz statistics in right panel: average score, number of quizzes completed

**Independent Test**: Navigate to course detail page, verify right panel shows "Score moyen au quizz: X%", "Nombre de quizz réalisés: Y"

### Backend Implementation for User Story 6

- [ ] T040 [P] [US6] Create `GetQuizStatsByCourseUseCase` in `backend/src/features/quizzes/application/use-cases/get-quiz-stats-by-course.usecase.ts`
- [ ] T041 [P] [US6] Add `QuizStatsResponseDto` interface in `backend/src/features/quizzes/dto/responses/quiz-stats.response.dto.ts` (fields: averageScore, totalQuizzes, completedQuizzes)
- [ ] T042 [US6] Add GET `/courses/:courseId/quiz-stats` endpoint in `backend/src/features/quizzes/quizzes.controller.ts`

### Frontend Implementation for User Story 6

- [ ] T043 [P] [US6] Create `QuizStatisticsPanel` component in `frontend/src/features/quizzes/components/QuizStatisticsPanel.tsx`
- [ ] T044 [P] [US6] Create `StatCard` component in `frontend/src/components/StatCard.tsx` (displays title + value + icon)
- [ ] T045 [US6] Add `getQuizStatsByCourse(courseId: string)` method to `QuizApi` interface in `frontend/src/features/quizzes/api/quiz-api.interface.ts`
- [ ] T046 [US6] Implement `getQuizStatsByCourse` in `HttpQuizApi` in `frontend/src/features/quizzes/api/quiz-api.http.ts`
- [ ] T047 [US6] Integrate `QuizStatisticsPanel` in `CourseDetailPage` right panel in `frontend/src/features/courses/pages/CourseDetailPage.tsx`

**Checkpoint**: Quiz statistics should display in right panel

---

## Phase 9: User Story 7 - Course-Specific Quiz Provider (Priority: P2)

**Goal**: Create provider for managing quizzes specific to a course (list, create, delete)

**Independent Test**: Provider should expose hooks for course quiz operations, all operations should be scoped to specific course

### Implementation for User Story 7

- [ ] T048 [US7] Create `CourseQuizzesProvider` in `frontend/src/features/quizzes/providers/course-quizzes-provider.tsx` exposing `useCourseQuizzes(courseId: string)` hook
- [ ] T049 [US7] Add `CourseQuizzesProvider` to provider hierarchy in `frontend/src/main.tsx`
- [ ] T050 [US7] Implement state management for course-specific quiz list in `CourseQuizzesProvider`

**Checkpoint**: Course quiz provider ready for UI integration

---

## Phase 10: User Story 8 - Quiz List for Course (Priority: P2)

**Goal**: Display list of quizzes for current course in right panel with status badges and progress

**Independent Test**: Navigate to course detail page, verify quiz list shows all quizzes for the course with badges ("À revoir", "Acquis", "Non acquis") and circular progress indicators

### Implementation for User Story 8

- [ ] T051 [P] [US8] Create `CourseQuizList` component in `frontend/src/features/quizzes/components/CourseQuizList.tsx`
- [ ] T052 [P] [US8] Create `CourseQuizItem` component in `frontend/src/features/quizzes/components/CourseQuizItem.tsx` (shows quiz with status badge + circular progress + score)
- [ ] T053 [P] [US8] Create `CircularProgress` component in `frontend/src/components/CircularProgress.tsx` (for score visualization)
- [ ] T054 [P] [US8] Create `QuizStatusBadge` component in `frontend/src/features/quizzes/components/QuizStatusBadge.tsx` (variants: "À revoir", "Acquis", "Non acquis")
- [ ] T055 [US8] Integrate `CourseQuizList` in `CourseDetailPage` right panel in `frontend/src/features/courses/pages/CourseDetailPage.tsx`
- [ ] T056 [US8] Connect to `useCourseQuizzes(courseId)` hook in `CourseQuizList`

**Checkpoint**: Quiz list should display with proper status indicators

---

## Phase 11: User Story 9 - Create Quiz Button (Priority: P2)

**Goal**: Add "Créer un quizz" button in right panel that opens quiz creation dialog

**Independent Test**: Click "Créer un quizz" button, verify quiz creation dialog opens with proper course context

### Implementation for User Story 9

- [ ] T057 [P] [US9] Create `CreateCourseQuizButton` component in `frontend/src/features/quizzes/components/CreateCourseQuizButton.tsx`
- [ ] T058 [US9] Update `QuizCreateProvider` to accept pre-filled `courseId` in `frontend/src/features/quizzes/providers/quiz-create-provider.tsx`
- [ ] T059 [US9] Integrate `CreateCourseQuizButton` in `CourseDetailPage` right panel in `frontend/src/features/courses/pages/CourseDetailPage.tsx`
- [ ] T060 [US9] Wire button to open quiz creation dialog with course context

**Checkpoint**: Quiz creation from course detail page should work

---

## Phase 12: User Story 10 - "Réviser avec Learnix" Button (Priority: P3)

**Goal**: Add "Réviser avec Learnix" button that navigates to AI chat with course context

**Independent Test**: Click "Réviser avec Learnix" button, verify navigation to `/chat` with course pre-selected

### Implementation for User Story 10

- [ ] T061 [P] [US10] Create `StudyWithAIButton` component in `frontend/src/features/courses/components/StudyWithAIButton.tsx`
- [ ] T062 [US10] Integrate `StudyWithAIButton` in `CourseDetailPage` right panel in `frontend/src/features/courses/pages/CourseDetailPage.tsx`
- [ ] T063 [US10] Implement navigation to `/chat` with course context (via URL params or state)

**Checkpoint**: Study with AI button should navigate correctly with context

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple course detail features

- [ ] T064 [P] Add loading states to all course detail data fetching in `frontend/src/features/courses/pages/CourseDetailPage.tsx`
- [ ] T065 [P] Add error states and error boundaries for course detail page
- [ ] T066 [P] Add empty states for no flashcards and no quizzes
- [ ] T067 [P] Implement responsive layout for mobile (stack left/right panels vertically)
- [ ] T068 Code review and refactoring for consistency
- [ ] T069 Update `ux-design.md` with actual component structure if changed
- [ ] T070 Add keyboard shortcuts for flashcard navigation (arrow keys)
- [ ] T071 Add accessibility labels (ARIA) to all interactive elements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - backend endpoints
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all UI work
- **User Stories (Phase 3-12)**: All depend on Foundational phase completion
  - US1 (Layout) → Must complete first (other UIs mount inside it)
  - US2 (Summary) → Can run parallel after US1
  - US3-5 (Flashcards) → Must complete US3 (provider) before US4-5 (UI)
  - US6 (Stats) → Independent, can run parallel
  - US7-9 (Quiz management) → Must complete US7 (provider) before US8-9 (UI)
  - US10 (Study button) → Independent, can run parallel
- **Polish (Phase 13)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (Layout)**: Can start after Foundational - BLOCKS US2-10 (they mount inside layout)
- **US2 (Summary)**: Depends on US1 completion
- **US3 (Flashcard Provider)**: Depends on US1 completion - BLOCKS US4-5
- **US4 (Flashcard UI)**: Depends on US3 completion
- **US5 (Flashcard Dialogs)**: Depends on US4 completion
- **US6 (Quiz Stats)**: Depends on US1 completion - Independent from other quiz features
- **US7 (Course Quiz Provider)**: Depends on US1 completion - BLOCKS US8-9
- **US8 (Quiz List)**: Depends on US7 completion
- **US9 (Create Quiz Button)**: Depends on US8 completion
- **US10 (Study Button)**: Depends on US1 completion - Independent

### Parallel Opportunities

- After US1: US2, US3, US6, US7, US10 can start in parallel
- After US3: US4 can start
- After US4: US5 can start
- After US7: US8 can start
- After US8: US9 can start

---

## Implementation Strategy

### MVP First (Essential Features)

1. Complete Phase 1: Setup (backend endpoints)
2. Complete Phase 2: Foundational (types + API)
3. Complete Phase 3: US1 (Layout + Navigation)
4. Complete Phase 4: US2 (Summary Display)
5. Complete Phase 5-7: US3-5 (Flashcards)
6. **STOP and VALIDATE**: Test course detail with summary and flashcards

### Incremental Delivery

1. MVP: Layout + Summary + Flashcards → Deploy
2. Add US6-9: Quiz Stats + Quiz List + Create Quiz → Deploy
3. Add US10: Study Button → Deploy
4. Polish phase → Final deployment

### Parallel Team Strategy

With 3 developers after US1 complete:
- Developer A: US2 (Summary)
- Developer B: US3-5 (Flashcards - sequential within)
- Developer C: US6-9 (Quiz features - sequential within)
- Developer D: US10 (Study button - independent)

---

## Notes

- All tasks follow frontend architecture: API provider → Data provider → UI components
- [P] tasks can run in parallel within same phase
- [Story] label maps task to specific user story (US1-US10)
- Each user story delivers independent value
- Flashcard stack UI uses card flip animation (consider react-spring or framer-motion)
- Circular progress component reusable across app (quizzes, courses)
- Quiz status badges match color scheme: Red (non acquis), Yellow (à revoir), Green (acquis)
- Right panel should be scrollable if content overflows
- Consider skeleton loaders for data fetching states

---

## Testing Checklist (Manual Validation)

- [ ] Navigate to `/courses/:id` - page loads with header showing course emoji + title
- [ ] Tab navigation switches between "Fiche" and "Flashcards" correctly
- [ ] Summary tab displays markdown with proper formatting
- [ ] Flashcards tab shows stack interface with current card counter (e.g., "3/10")
- [ ] Flashcard navigation arrows work (prev/next)
- [ ] Flashcard flip animation works (click to flip)
- [ ] Edit flashcard button opens dialog with current data
- [ ] Save edited flashcard updates card in stack
- [ ] Delete flashcard button shows confirmation and removes card
- [ ] Add flashcard button creates new card and adds to stack
- [ ] Right panel shows quiz statistics (average score, total quizzes)
- [ ] Quiz list displays all quizzes for course with correct status badges
- [ ] Quiz circular progress shows correct percentage
- [ ] "Créer un quizz" button opens quiz creation dialog with course pre-selected
- [ ] "Réviser avec Learnix" button navigates to chat with course context
- [ ] All interactions work on mobile (responsive layout)
- [ ] Keyboard navigation works for flashcard stack (arrow keys)
- [ ] All interactive elements have proper ARIA labels

---

**End of Tasks Document**
