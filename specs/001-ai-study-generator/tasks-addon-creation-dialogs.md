# Task Add-on: Course and Quiz Creation Dialogs (US5 Extension)

**Feature**: AI-assisted Study Generator  
**Add-on for**: User Story 5 (Frontend UI Implementation)  
**Task Range**: T951–T975  
**Spec Reference**: addon-creation-dialogs.md

## Phase: User Story 5 Extension — Creation Dialog Workflows

**Goal**: Implement global state providers and multi-step dialogs for course and quiz creation with intuitive UI.

**Independent Test Criteria**: 
- Open course creation dialog from home/courses pages, fill form, submit → course created and user navigated to course detail page
- Open quiz creation dialog from home/course/quizzes pages, select course (step 1), customize quiz (step 2), submit → quiz created and user navigated to quiz page
- Dialog state persists across step navigation but resets on close/cancel
- Providers accessible from any component via hooks

---

### Providers Implementation

- [X] T951 [P] [US5] Create CourseCreateProvider context in `frontend/src/features/courses/providers/course-create-provider.tsx`
  - Export: `CourseCreateProvider` component, `useCourseCreate` hook
  - State: `{ isOpen: boolean, formData: CourseCreateFormData }`
  - Methods: `openDialog()`, `closeDialog()`, `updateFormData(data)`, `submitCourse()`
  - Validation: Zod schema for form data (sourceText 100-50k chars, language required)

- [X] T952 [P] [US5] Create QuizzCreateProvider context in `frontend/src/features/quizzes/providers/quiz-create-provider.tsx`
  - Export: `QuizzCreateProvider` component, `useQuizCreate` hook
  - State: `{ isOpen: boolean, currentStep: 1|2, formData: QuizCreateFormData }`
  - Methods: `openDialog(courseId?)`, `closeDialog()`, `setStep(step)`, `updateFormData(data)`, `submitQuiz()`
  - Pre-selection: If `courseId` passed to `openDialog()`, skip to step 2

- [X] T953 [US5] Wire providers to app root in `frontend/src/main.tsx`
  - Nest `CourseCreateProvider` and `QuizzCreateProvider` inside existing provider hierarchy
  - Order: AuthProvider > CoursesProvider > QuizzesProvider > CourseCreateProvider > QuizzCreateProvider > RouterProvider

---

### Course Creation Dialog

- [X] T954 [P] [US5] Create CourseCreationDialog component in `frontend/src/features/courses/components/CourseCreationDialog.tsx`
  - Props: None (consumes `useCourseCreate()` hook)
  - Layout: Shadcn Dialog with header "Ajouter un cours", close button
  - Children: SourceTypeTabs, LanguageSelect, Textarea (conditional), SubmitButton
  - Form handling: React Hook Form + Zod validation

- [X] T955 [P] [US5] Create SourceTypeTabs component in `frontend/src/features/courses/components/SourceTypeTabs.tsx`
  - Props: `{ value: 'text'|'photo', onChange: (v) => void }`
  - Layout: Shadcn Tabs with 2 tabs ("Document texte", "Photo")
  - State: Controlled by parent form

- [X] T956 [P] [US5] Create LanguageSelect component in `frontend/src/features/courses/components/LanguageSelect.tsx`
  - Props: `{ value: string, onChange: (v) => void, languages: string[] }`
  - Layout: Shadcn Select dropdown with language options (Français, English, Español, Deutsch, Italiano)
  - Default: "Français"

- [ ] T957 [US5] Add course creation submit logic to CourseCreationDialog
  - On submit: Call `CourseApi.createCourse({ title: auto-generated from first line, sourceText, language, emoji: random })`
  - On success: Close dialog, navigate to `/courses/:id`, show success toast
  - On error: Display error message (quota exceeded, AI unavailable, validation failed)

---

### Quiz Creation Dialog (Multi-Step)

- [X] T958 [P] [US5] Create QuizzCreationDialog component in `frontend/src/features/quizzes/components/QuizzCreationDialog.tsx`
  - Props: None (consumes `useQuizCreate()` hook)
  - Layout: Shadcn Dialog with header "Créer un quizz", StepIndicator, close button
  - Children: Conditional rendering based on `currentStep` (1=CoursePicker, 2=Customization)

- [X] T959 [P] [US5] Create StepIndicator component in `frontend/src/common/components/StepIndicator.tsx`
  - Props: `{ currentStep: number, totalSteps: number }`
  - Layout: Row of small circles (●=active, ○=inactive)
  - Styling: Reusable (export for other multi-step flows)

- [X] T960 [P] [US5] Create CoursePicker component in `frontend/src/features/quizzes/components/CoursePicker.tsx`
  - Props: `{ courses: Course[], onSelect: (id) => void }`
  - Layout: Vertical column list (single column, scrollable)
  - Behavior: Click selects & immediately advances (no next button)
  - Empty state: Show create-course CTA

- [X] T961 [P] [US5] Create SelectionCard component in `frontend/src/common/components/SelectionCard.tsx`
  - Props: `{ icon: string, label: string, subtitle?: string, selected: boolean, disabled: boolean, onClick: () => void }`
  - Layout: Horizontal row card with gray border (Tailwind: `border border-gray-300`)
  - Structure: Icon/illustration → Label → Radio button (or "Bientôt disponible" tag if disabled)
  - Selected state: Green border (`border-green-500`) + filled radio button with green center
  - Disabled state: Replace radio button with badge/tag "Bientôt disponible"
  - Reusable across quiz creation flows

- [X] T962 [P] [US5] Create ExerciseTypeCards component in `frontend/src/features/quizzes/components/ExerciseTypeCards.tsx`
  - Props: `{ value: 'MCQ'|'OPEN'|'FILL_BLANK', onChange: (v) => void }`
  - Data source: Get exercise type options from `useQuizCreate()` provider (with icons, labels, disabled states)
  - Layout: Vertical stack of SelectionCard components
  - Cards: "QCM" (enabled), "Réponse ouverte" (enabled), "Texte à trou" (disabled)
  - State: Single selection using SelectionCard component

- [X] T963 [P] [US5] Create AnswerCountCards component in `frontend/src/features/quizzes/components/AnswerCountCards.tsx`
  - Props: `{ value: 'duo'|'trio'|'square', onChange: (v) => void }`
  - Data source: Get answer count options from `useQuizCreate()` provider
  - Options: `[{ key: 'duo', label: 'Duo', subtitle: '2' }, { key: 'trio', label: 'Trio', subtitle: '3' }, { key: 'square', label: 'Carré', subtitle: '4' }]`
  - Layout: Vertical stack of SelectionCard components with subtitles
  - State: Single selection using SelectionCard component

- [X] T964 [US5] Add exercise type and answer count options to QuizzCreateProvider
  - Add to provider state: `exerciseTypeOptions`, `answerCountOptions`
  - Exercise types: `[{ key: 'MCQ', icon: '📝', label: 'QCM', disabled: false }, { key: 'OPEN', icon: '✍️', label: 'Réponse ouverte', disabled: false }, { key: 'FILL_BLANK', icon: '📄', label: 'Texte à trou', disabled: true }]`
  - Answer counts: `[{ key: 'duo', icon: '2️⃣', label: 'Duo', subtitle: '2 questions' }, { key: 'trio', icon: '3️⃣', label: 'Trio', subtitle: '3 questions' }, { key: 'square', icon: '4️⃣', label: 'Carré', subtitle: '4 questions' }]`
  - Export via context for ExerciseTypeCards and AnswerCountCards

- [ ] T965 [US5] Add quiz creation step 1 logic (auto-advance) to QuizzCreationDialog
  - Render: Column CoursePicker list using `useCourses()`
  - On course click: `updateFormData({ courseId })` then `setStep(2)`
  - Empty state: Button opens CourseCreationDialog, remains in step 1

- [ ] T966 [US5] Add quiz creation step 2 logic to QuizzCreationDialog
  - Render: ExerciseTypeCards, AnswerCountCards (now using SelectionCard)
  - Navigation: "← Retour" button (back to step 1), "Créer le quizz" button (disabled if type or count not selected)
  - On submit: Call `submitQuiz()` from `useQuizCreate()`

- [ ] T967 [US5] Add quiz creation submit logic to useQuizCreate hook
  - Transform answerCount string to numeric: `const countMap = { duo: 2, trio: 3, square: 4 }`
  - On submit: Call `QuizApi.generate(courseId, { type: exerciseType, count: countMap[answerCount] })`
  - On success: Close dialog, navigate to `/quizzes/:id`, show success toast
  - On error: Display error message (quota exceeded, course not found, AI unavailable)

---

### Integration with Existing Pages

- [X] T968 [P] [US5] Add course creation trigger to HomePage QuickActionsSection
  - Wire "Générer une fiche" card onClick to `openCourseDialog()` from `useCourseCreate()`
  - File: `frontend/src/features/home/components/QuickActionsSection.tsx`
  - Status: ✅ Implemented - openCourseDialog() wired to "Générer une fiche" action

- [X] T969 [P] [US5] Add course creation trigger to CoursesListPage toolbar
  - Wire "Ajouter un cours" button onClick to `openCourseDialog()` from `useCourseCreate()`
  - File: `frontend/src/features/courses/components/CourseListToolbar.tsx`
  - Status: ✅ Implemented - openDialog wired to onAddCourse in CourseListToolbar

- [X] T970 [P] [US5] Add quiz creation trigger to HomePage QuickActionsSection
  - Wire "Créer un quizz" card onClick to `openQuizDialog()` from `useQuizCreate()`
  - File: `frontend/src/features/home/components/QuickActionsSection.tsx`
  - Status: ✅ Implemented - openQuizDialog() wired to "Créer un quizz" action

- [ ] T971 [P] [US5] Add quiz creation trigger to CoursesListPage (future: course detail page)
  - Wire "+ Créer un quiz" button onClick to `openQuizDialog(courseId)` from `useQuizCreate()`
  - File: `frontend/src/features/courses/pages/CourseDetailPage.tsx` (when created)

- [ ] T972 [P] [US5] Add quiz creation trigger to QuizzesListPage toolbar
  - Wire "+ Créer un quiz" button onClick to `openQuizDialog()` from `useQuizCreate()`
  - File: `frontend/src/features/quizzes/components/QuizListToolbar.tsx`

---

### Type Definitions and Validation

- [X] T973 [P] [US5] Add CourseCreateFormData and QuizCreateFormData types to respective types files
  - File 1: `frontend/src/features/courses/types.ts`
    - Add: `export interface CourseCreateFormData { sourceType: 'text'|'photo'; language: string; sourceText: string; }`
  - File 2: `frontend/src/features/quizzes/types.ts`
    - Add: `export interface QuizCreateFormData { courseId?: string; exerciseType?: 'MCQ'|'OPEN'|'FILL_BLANK'; answerCount?: 2|3|4; }`
    - Add: `export interface QuizCreateState { isOpen: boolean; currentStep: 1|2; formData: QuizCreateFormData; }`

- [X] T974 [P] [US5] Create Zod schemas for form validation
  - File 1: `frontend/src/features/courses/schemas/course-create.schema.ts`
    - Schema: `courseCreateSchema` with sourceText (min 100, max 50k), language (enum), sourceType (enum)
  - File 2: `frontend/src/features/quizzes/schemas/quiz-create.schema.ts`
    - Schema: `quizCreateSchema` with courseId (uuid), exerciseType (enum), answerCount (enum 'duo'|'trio'|'square')

---

### Acceptance Tests

- [ ] T975 [US5] Add frontend integration test for CourseCreationDialog workflow
  - File: `frontend/src/features/courses/components/__tests__/CourseCreationDialog.test.tsx`
  - Test scenarios: Open dialog → fill form → submit → verify API call and navigation

- [ ] T976 [US5] Add frontend integration test for QuizzCreationDialog step 1 (auto-advance)
  - File: `frontend/src/features/quizzes/components/__tests__/QuizzCreationDialog.step1.test.tsx`
  - Test scenarios: Open dialog → click course card → assert auto-advance (currentStep=2) without next button

- [ ] T977 [US5] Add frontend integration test for QuizzCreationDialog step 2
  - File: `frontend/src/features/quizzes/components/__tests__/QuizzCreationDialog.step2.test.tsx`
  - Test scenarios: Step 2 rendered → select type and count → submit → verify API call and navigation

- [ ] T978 [US5] Add test for SelectionCard component states
  - File: `frontend/src/common/components/__tests__/SelectionCard.test.tsx`
  - Test scenarios: Default state, selected state (green border + filled radio), disabled state (shows "Bientôt disponible" tag)

---

## Summary

**Total New Tasks**: 28 (T951–T978)  
**Breakdown**:
- Providers: 3 tasks (T951–T953)
- Course Dialog: 4 tasks (T954–T957)
- Quiz Dialog: 11 tasks (T958–T967, including new SelectionCard component)
- Page Integration: 5 tasks (T968–T972)
- Types & Validation: 2 tasks (T973–T974)
- Tests: 4 tasks (T975–T978)

**New Tasks Added**:
- T961: SelectionCard reusable UI component with icon, label, radio button, selected/disabled states
- T964: Add exercise type and answer count options to QuizzCreateProvider
- T978: Test for SelectionCard component

**Refactored Tasks**:
- T962: ExerciseTypeCards now uses SelectionCard and gets data from provider
- T963: AnswerCountCards now uses SelectionCard and gets data from provider
- T965-T967: Renumbered from T963-T965 to accommodate new tasks

**Parallel Opportunities**:
- T951, T952 (providers) can be developed in parallel
- T954–T956 (course dialog components) can be developed in parallel
- T958–T961 (quiz dialog components including SelectionCard) can be developed in parallel
- T962–T963 (refactored cards using SelectionCard) can be developed in parallel after T961
- T968–T972 (page integrations) can be developed in parallel after providers/dialogs complete
- T973, T974 (types and schemas) can be developed in parallel

**Dependencies**:
- T953 depends on T951, T952 (providers must exist before wiring to app)
- T957 depends on T954–T956 (course dialog components must exist)
- T962–T963 depend on T961 (SelectionCard must exist)
- T964 depends on T952 (QuizzCreateProvider must exist to add options)
- T965–T967 depend on T958–T964 (quiz dialog components and provider options must exist)
- T968–T972 depend on T951–T967 (providers and dialogs must be fully implemented)
- T975–T978 depend on all implementation tasks (tests verify complete workflows)

**Estimated Implementation Order**:
1. **Phase 1** (Parallel): T951, T952, T973, T974 (providers + types)
2. **Phase 2**: T953 (wire providers to app)
3. **Phase 3** (Parallel): T954–T957 (course dialog), T958–T961 (quiz dialog base components including SelectionCard)
4. **Phase 4** (Parallel): T962–T964 (refactor cards to use SelectionCard + add provider options)
5. **Phase 5**: T965–T967 (quiz dialog logic and submit)
6. **Phase 6** (Parallel): T968–T972 (page integrations)
7. **Phase 7** (Parallel): T975–T978 (acceptance tests)

**Prerequisites**:
- Existing CourseApi and QuizApi interfaces (already implemented in previous phases)
- Shadcn UI Dialog, Tabs, Select, Textarea, Button, Card components
- React Hook Form + Zod installed and configured
- React Router for navigation
- Existing useCourses and useQuizzes hooks

**Files Created**: 22+ new files
**Files Modified**: 6 existing files (HomePage, CoursesListPage, QuizzesListPage, main.tsx, types files, QuizzCreateProvider)

**Key Changes from Original Spec**:
1. Added SelectionCard as a reusable UI component in common/components
2. Refactored ExerciseTypeCards and AnswerCountCards to use SelectionCard
3. Moved quiz options data (exercise types, answer counts) into QuizzCreateProvider
4. Added icons to all selection options for better UX
5. Added disabled state support for "Texte à trou" (coming soon)

---

## Updated Validation Checklist

- Total active tasks (including add-on): 157 (129 previous + 28 new)
- Tasks per story: US1:6, US2:17, US3:24, US4:17, US5:77 (49 previous + 28 new)
- Deferred tasks: 4 (unchanged: T314, T415, T416, T417)
- Parallel opportunities: Enhanced (multiple new parallel batches in US5 extension)
- New reusable components: SelectionCard (common/components)

---

**Path to this add-on**:  
`C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\tasks-addon-creation-dialogs.md`

**Integration**: These tasks should be appended to the main `tasks.md` file under User Story US5 extension section.
