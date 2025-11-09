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

- [ ] T951 [P] [US5] Create CourseCreateProvider context in `frontend/src/features/courses/providers/course-create-provider.tsx`
  - Export: `CourseCreateProvider` component, `useCourseCreate` hook
  - State: `{ isOpen: boolean, formData: CourseCreateFormData }`
  - Methods: `openDialog()`, `closeDialog()`, `updateFormData(data)`, `submitCourse()`
  - Validation: Zod schema for form data (sourceText 100-50k chars, language required)

- [ ] T952 [P] [US5] Create QuizzCreateProvider context in `frontend/src/features/quizzes/providers/quiz-create-provider.tsx`
  - Export: `QuizzCreateProvider` component, `useQuizCreate` hook
  - State: `{ isOpen: boolean, currentStep: 1|2, formData: QuizCreateFormData }`
  - Methods: `openDialog(courseId?)`, `closeDialog()`, `setStep(step)`, `updateFormData(data)`, `submitQuiz()`
  - Pre-selection: If `courseId` passed to `openDialog()`, skip to step 2

- [ ] T953 [US5] Wire providers to app root in `frontend/src/main.tsx`
  - Nest `CourseCreateProvider` and `QuizzCreateProvider` inside existing provider hierarchy
  - Order: AuthProvider > CoursesProvider > QuizzesProvider > CourseCreateProvider > QuizzCreateProvider > RouterProvider

---

### Course Creation Dialog

- [ ] T954 [P] [US5] Create CourseCreationDialog component in `frontend/src/features/courses/components/CourseCreationDialog.tsx`
  - Props: None (consumes `useCourseCreate()` hook)
  - Layout: Shadcn Dialog with header "Ajouter un cours", close button
  - Children: SourceTypeTabs, LanguageSelect, Textarea (conditional), SubmitButton
  - Form handling: React Hook Form + Zod validation

- [ ] T955 [P] [US5] Create SourceTypeTabs component in `frontend/src/features/courses/components/SourceTypeTabs.tsx`
  - Props: `{ value: 'text'|'photo', onChange: (v) => void }`
  - Layout: Shadcn Tabs with 2 tabs ("Document texte", "Photo")
  - State: Controlled by parent form

- [ ] T956 [P] [US5] Create LanguageSelect component in `frontend/src/features/courses/components/LanguageSelect.tsx`
  - Props: `{ value: string, onChange: (v) => void, languages: string[] }`
  - Layout: Shadcn Select dropdown with language options (Français, English, Español, Deutsch, Italiano)
  - Default: "Français"

- [ ] T957 [US5] Add course creation submit logic to CourseCreationDialog
  - On submit: Call `CourseApi.createCourse({ title: auto-generated from first line, sourceText, language, emoji: random })`
  - On success: Close dialog, navigate to `/courses/:id`, show success toast
  - On error: Display error message (quota exceeded, AI unavailable, validation failed)

---

### Quiz Creation Dialog (Multi-Step)

- [ ] T958 [P] [US5] Create QuizzCreationDialog component in `frontend/src/features/quizzes/components/QuizzCreationDialog.tsx`
  - Props: None (consumes `useQuizCreate()` hook)
  - Layout: Shadcn Dialog with header "Créer un quizz", StepIndicator, close button
  - Children: Conditional rendering based on `currentStep` (1=CoursePicker, 2=Customization)

- [ ] T959 [P] [US5] Create StepIndicator component in `frontend/src/common/components/StepIndicator.tsx`
  - Props: `{ currentStep: number, totalSteps: number }`
  - Layout: Row of small circles (●=active, ○=inactive)
  - Styling: Reusable (export for other multi-step flows)

- [ ] T960 [P] [US5] Create CoursePicker component in `frontend/src/features/quizzes/components/CoursePicker.tsx`
  - Props: `{ courses: Course[], onSelect: (id) => void }`
  - Layout: Vertical column list (single column, scrollable)
  - Behavior: Click selects & immediately advances (no next button)
  - Empty state: Show create-course CTA

- [ ] T961 [P] [US5] Create ExerciseTypeCards component in `frontend/src/features/quizzes/components/ExerciseTypeCards.tsx`
  - Props: `{ value: 'MCQ'|'OPEN'|'FILL_BLANK', onChange: (v) => void }`
  - Layout: 3 clickable cards ("QCM", "Réponse ouverte", "Texte à trou")
  - State: Single selection, highlight selected
  - Used in: QuizzCreationDialog step 2

- [ ] T962 [P] [US5] Create AnswerCountCards component in `frontend/src/features/quizzes/components/AnswerCountCards.tsx`
  - Props: `{ value: 'duo'|'trio'|'square', onChange: (v) => void }`
  - Layout: 3 clickable cards ("Duo", "Trio", "Carré") with subtitle (2,3,4)
  - Mapping: 'duo'→2, 'trio'→3, 'square'→4 for API params
  - State: Single selection, highlight selected
  - Used in: QuizzCreationDialog step 2

- [ ] T963 [US5] Add quiz creation step 1 logic (auto-advance) to QuizzCreationDialog
  - Render: Column CoursePicker list using `useCourses()`
  - On course click: `updateFormData({ courseId })` then `setStep(2)`
  - Empty state: Button opens CourseCreationDialog, remains in step 1

- [ ] T964 [US5] Add quiz creation step 2 logic to QuizzCreationDialog
  - Render: ExerciseTypeCards, AnswerCountCards
  - Navigation: "← Retour" button (back to step 1), "Créer le quizz" button (disabled if type or count not selected)
  - On submit: Call `submitQuiz()` from `useQuizCreate()`

- [ ] T965 [US5] Add quiz creation submit logic to useQuizCreate hook
  - Transform answerCount string to numeric: `const countMap = { duo: 2, trio: 3, square: 4 }`
  - On submit: Call `QuizApi.generate(courseId, { type: exerciseType, count: countMap[answerCount] })`
  - On success: Close dialog, navigate to `/quizzes/:id`, show success toast
  - On error: Display error message (quota exceeded, course not found, AI unavailable)

---

### Integration with Existing Pages

- [ ] T966 [P] [US5] Add course creation trigger to HomePage QuickActionsSection
  - Wire "Générer une fiche" card onClick to `openCourseDialog()` from `useCourseCreate()`
  - File: `frontend/src/features/home/components/QuickActionsSection.tsx`

- [ ] T967 [P] [US5] Add course creation trigger to CoursesListPage toolbar
  - Wire "Ajouter un cours" button onClick to `openCourseDialog()` from `useCourseCreate()`
  - File: `frontend/src/features/courses/components/CourseListToolbar.tsx`

- [ ] T968 [P] [US5] Add quiz creation trigger to HomePage QuickActionsSection
  - Wire "Créer un quizz" card onClick to `openQuizDialog()` from `useQuizCreate()`
  - File: `frontend/src/features/home/components/QuickActionsSection.tsx`

- [ ] T969 [P] [US5] Add quiz creation trigger to CoursesListPage (future: course detail page)
  - Wire "+ Créer un quiz" button onClick to `openQuizDialog(courseId)` from `useQuizCreate()`
  - File: `frontend/src/features/courses/pages/CourseDetailPage.tsx` (when created)

- [ ] T970 [P] [US5] Add quiz creation trigger to QuizzesListPage toolbar
  - Wire "+ Créer un quiz" button onClick to `openQuizDialog()` from `useQuizCreate()`
  - File: `frontend/src/features/quizzes/components/QuizListToolbar.tsx`

---

### Type Definitions and Validation

- [ ] T971 [P] [US5] Add CourseCreateFormData and QuizCreateFormData types to respective types files
  - File 1: `frontend/src/features/courses/types.ts`
    - Add: `export interface CourseCreateFormData { sourceType: 'text'|'photo'; language: string; sourceText: string; }`
  - File 2: `frontend/src/features/quizzes/types.ts`
    - Add: `export interface QuizCreateFormData { courseId?: string; exerciseType?: 'MCQ'|'OPEN'|'FILL_BLANK'; answerCount?: 2|3|4; }`
    - Add: `export interface QuizCreateState { isOpen: boolean; currentStep: 1|2; formData: QuizCreateFormData; }`

- [ ] T972 [P] [US5] Create Zod schemas for form validation
  - File 1: `frontend/src/features/courses/schemas/course-create.schema.ts`
    - Schema: `courseCreateSchema` with sourceText (min 100, max 50k), language (enum), sourceType (enum)
  - File 2: `frontend/src/features/quizzes/schemas/quiz-create.schema.ts`
    - Schema: `quizCreateSchema` with courseId (uuid), exerciseType (enum), answerCount (enum 'duo'|'trio'|'square')

---

### Acceptance Tests

- [ ] T973 [US5] Add frontend integration test for CourseCreationDialog workflow
  - File: `frontend/src/features/courses/components/__tests__/CourseCreationDialog.test.tsx`
  - Test scenarios: Open dialog → fill form → submit → verify API call and navigation

- [ ] T974 [US5] Add frontend integration test for QuizzCreationDialog step 1 (auto-advance)
  - File: `frontend/src/features/quizzes/components/__tests__/QuizzCreationDialog.step1.test.tsx`
  - Test scenarios: Open dialog → click course card → assert auto-advance (currentStep=2) without next button

- [ ] T975 [US5] Add frontend integration test for QuizzCreationDialog step 2
  - File: `frontend/src/features/quizzes/components/__tests__/QuizzCreationDialog.step2.test.tsx`
  - Test scenarios: Step 2 rendered → select type and count → submit → verify API call and navigation

---

## Summary

**Total New Tasks**: 25 (T951–T975)  
**Breakdown**:
- Providers: 3 tasks (T951–T953)
- Course Dialog: 4 tasks (T954–T957)
- Quiz Dialog: 8 tasks (T958–T965)
- Page Integration: 5 tasks (T966–T970)
- Types & Validation: 2 tasks (T971–T972)
- Tests: 3 tasks (T973–T975)

**Parallel Opportunities**:
- T951, T952 (providers) can be developed in parallel
- T954–T956 (course dialog components) can be developed in parallel
- T958–T962 (quiz dialog components) can be developed in parallel
- T966–T970 (page integrations) can be developed in parallel after providers/dialogs complete
- T971, T972 (types and schemas) can be developed in parallel

**Dependencies**:
- T953 depends on T951, T952 (providers must exist before wiring to app)
- T957 depends on T954–T956 (course dialog components must exist)
- T963–T965 depend on T958–T962 (quiz dialog components must exist)
- T966–T970 depend on T951–T965 (providers and dialogs must be fully implemented)
- T973–T975 depend on all implementation tasks (tests verify complete workflows)

**Estimated Implementation Order**:
1. **Phase 1** (Parallel): T951, T952, T971, T972 (providers + types)
2. **Phase 2**: T953 (wire providers to app)
3. **Phase 3** (Parallel): T954–T957 (course dialog), T958–T962 (quiz dialog components)
4. **Phase 4**: T963–T965 (quiz dialog logic)
5. **Phase 5** (Parallel): T966–T970 (page integrations)
6. **Phase 6** (Parallel): T973–T975 (acceptance tests)

**Prerequisites**:
- Existing CourseApi and QuizApi interfaces (already implemented in previous phases)
- Shadcn UI Dialog, Tabs, Select, Textarea, Button, Card components
- React Hook Form + Zod installed and configured
- React Router for navigation
- Existing useCourses and useQuizzes hooks

**Files Created**: 20+ new files
**Files Modified**: 5 existing files (HomePage, CoursesListPage, QuizzesListPage, main.tsx, types files)

---

## Updated Validation Checklist

- Total active tasks (including add-on): 154 (129 previous + 25 new)
- Tasks per story: US1:6, US2:17, US3:24, US4:17, US5:74 (49 previous + 25 new)
- Deferred tasks: 4 (unchanged: T314, T415, T416, T417)
- Parallel opportunities: Enhanced (multiple new parallel batches in US5 extension)

---

**Path to this add-on**:  
`C:\Users\samue\Documents\Code\Learnix\specs\001-ai-study-generator\tasks-addon-creation-dialogs.md`

**Integration**: These tasks should be appended to the main `tasks.md` file under User Story US5 extension section.
