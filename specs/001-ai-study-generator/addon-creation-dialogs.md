# Add-on: Course and Quiz Creation Dialogs

**Date**: 2025-11-09  
**Extends**: spec.md (User Story 5), ux-design.md (Dialogs section)

## Overview

This add-on specification defines two new providers and two multi-step dialog components for course and quiz creation workflows, integrated at the app root level for global access.

## New Functional Requirements

### FR-023: CourseCreateProvider
The system MUST provide a `CourseCreateProvider` context at app root to track course creation dialog state:
- `isOpen`: boolean (dialog visibility)
- `formData`: object with sourceType ('text'|'photo'), language, sourceText
- `openDialog()`: function to show dialog
- `closeDialog()`: function to hide dialog and reset form
- `updateFormData(data)`: function to update form state

### FR-024: QuizzCreateProvider
The system MUST provide a `QuizzCreateProvider` context at app root to track quiz creation dialog state:
- `isOpen`: boolean (dialog visibility)
- `currentStep`: `QuizCreateStep`
- `formData`: object with courseId, exerciseType ('MCQ'|'OPEN'|'FILL_BLANK'), answerCount ('duo'|'trio'|'square')
- `openDialog()`: function to show dialog
- `closeDialog()`: function to hide dialog and reset
- `setStep(step)`: function to navigate steps
- `updateFormData(data)`: function to update form state
- `submitQuiz()`: async function to create quiz and redirect

### FR-025: CourseCreationDialog
The system MUST display a modal dialog triggered by `CourseCreateProvider.isOpen === true`:

**Structure:**
```
┌─────────────────────────────────────────────┐
│ Ajouter un cours                      [×]   │
├─────────────────────────────────────────────┤
│                                             │
│ Source du cours                             │
│ ┌──────────────┬─────────────┐             │
│ │ Document     │ Photo       │             │
│ │ texte [✓]    │             │             │
│ └──────────────┴─────────────┘             │
│                                             │
│ Langue du cours                             │
│ ┌─────────────────────────────┐            │
│ │ [Français ▼]                │            │
│ └─────────────────────────────┘            │
│                                             │
│ Texte du cours (if text tab)               │
│ ┌─────────────────────────────┐            │
│ │ [Paste or type text here...]│            │
│ │                             │            │
│ │                             │            │
│ └─────────────────────────────┘            │
│                                             │
│          [Générer ma fiche]                │
└─────────────────────────────────────────────┘
```

**Fields:**
- **Source Type Tabs**: "Document texte" (default) | "Photo" (upload, future enhancement)
- **Language Select**: Dropdown with options (Français, English, Español, etc.)
- **Source Text**: Textarea (visible when "Document texte" selected)
- **CTA**: "Générer ma fiche" button (disabled if text empty or language not selected)

**Behavior:**
- On submit: Call `CourseApi.createCourse({ title: auto-generated, sourceText, emoji: random, language })`, close dialog, show success toast, navigate to `/courses/:id`
- On cancel/close: Reset form, close dialog

### FR-026: QuizzCreationDialog (2-Step Wizard)
The system MUST display a modal dialog with 2 steps triggered by `QuizzCreateProvider.isOpen === true`:

#### Step 1: Course Selection (Auto-advance, Column Layout)

```
┌─────────────────────────────────────────────┐
│ Créer un quizz                        [×]   │
│ ● ○  (Indicateur d'étapes)                 │
├─────────────────────────────────────────────┤
│ Sur quel cours veux-tu générer un quizz ?  │
│                                             │
│ ┌─────────────────────────────┐             │
│ │ 🎯 Mathématiques            │             │
│ │ (Cliquer pour sélectionner) │             │
│ └─────────────────────────────┘             │
│ ┌─────────────────────────────┐             │
│ │ 📚 Histoire                 │             │
│ │ (Cliquer pour sélectionner) │             │
│ └─────────────────────────────┘             │
│ ┌─────────────────────────────┐             │
│ │ 🧪 Physique                 │             │
│ │ (Cliquer pour sélectionner) │             │
│ └─────────────────────────────┘             │
│                                             │
│ (Sélection d'un cours → passage automatique │
│  à l'étape 2)                               │
└─────────────────────────────────────────────┘
```

**Fields:**
- **CoursePicker**: Column list (single column stacked CourseCards; scrollable if > viewport height) with selected state (green border + background tint).
- No navigation buttons; selection triggers immediate transition to step 2.

**Behavior:**
- On card click: Persist `formData.courseId`, highlight the card, immediately set `currentStep = 2`.
- Empty state (no courses): Show message "Aucun cours disponible" + button "Créer un cours" that opens `CourseCreationDialog` (does not advance).

#### Step 2: Quiz Customization

```
┌─────────────────────────────────────────────┐
│ Créer un quizz                        [×]   │
│ ○ ●  (Step indicators)                      │
├─────────────────────────────────────────────┤
│                                             │
│ Personnalise ton quizz                      │
│                                             │
│ Type d'exercice                             │
│ ┌────────┐  ┌────────┐  ┌────────┐         │
│ │  QCM   │  │ Réponse│  │ Texte  │         │
│ │   ✓    │  │ ouverte│  │ à trou │         │
│ └────────┘  └────────┘  └────────┘         │
│                                             │
│ Nombres de réponses possibles               │
│ ┌────────┐  ┌────────┐  ┌────────┐         │
│ │  Duo   │  │  Trio  │  │ Carré  │         │
│ │   (2)  │  │   (3)  │  │  (4)   │         │
│ └────────┘  └────────┘  └────────┘         │
│                                             │
│     [← Retour]      [Créer le quizz]       │
└─────────────────────────────────────────────┘
```

**Fields:**
- **Exercise Type**: 3 clickable cards (QCM | Réponse ouverte | Texte à trou) - single selection
- **Answer Count**: 3 clickable cards (Duo | Trio | Carré) - single selection; internal value 'duo' | 'trio' | 'square'
- **Navigation**: "← Retour" (back to step 1) | "Créer le quizz" (submit, disabled if type or count not selected)

**Behavior:**
- On type/count card click: Select option, highlight card
- On "← Retour": Set currentStep=1, preserve selections
- On "Créer le quizz": Map `answerCount` to numeric (`duo`→2, `trio`→3, `square`→4) and call `QuizApi.generate(courseId, { type, count })`, close dialog, redirect to `/quizzes/:id`, show success toast

## Provider Integration

Both providers MUST be added to the app root provider hierarchy in `frontend/src/main.tsx`:

```tsx
<AuthProvider>
  <CoursesProvider>
    <QuizzesProvider>
      <CourseCreateProvider>
        <QuizzCreateProvider>
          <RouterProvider router={router} />
        </QuizzCreateProvider>
      </CourseCreateProvider>
    </QuizzesProvider>
  </CoursesProvider>
</AuthProvider>
```

## Trigger Points

### CourseCreationDialog Triggers
- Home page "Générer une fiche" QuickActionCard → `openCourseDialog()`
- Courses list page "Ajouter un cours" button → `openCourseDialog()`
- App header "+" button (future) → `openCourseDialog()`

### QuizzCreationDialog Triggers
- Home page "Créer un quizz" QuickActionCard → `openQuizDialog()`
- Course detail page "Créer un quiz" button → `openQuizDialog(courseId)` (pre-select course)
- Quizzes list page "+ Créer un quiz" button → `openQuizDialog()`

## Acceptance Criteria

1. **Given** user on home page, **When** clicks "Générer une fiche", **Then** CourseCreationDialog opens with empty form
2. **Given** CourseCreationDialog open with text and language, **When** clicks "Générer ma fiche", **Then** course created, dialog closes, navigates to `/courses/:id`
3. **Given** user on home page, **When** clicks "Créer un quizz", **Then** QuizzCreationDialog opens at step 1
4. **Given** QuizzCreationDialog step 1, **When** user clicks a course card, **Then** step 2 displays immediately with customization options (auto-advance)
5. **Given** QuizzCreationDialog step 2 with type and count selected, **When** clicks "Créer le quizz", **Then** quiz created, dialog closes, navigates to `/quizzes/:id`
6. **Given** either dialog open, **When** clicks [×] or Cancel, **Then** dialog closes and form resets

## Files to Create

### Providers
- `frontend/src/features/courses/providers/course-create-provider.tsx`
- `frontend/src/features/quizzes/providers/quiz-create-provider.tsx`

### Dialogs
- `frontend/src/features/courses/components/CourseCreationDialog.tsx`
- `frontend/src/features/quizzes/components/QuizzCreationDialog.tsx`

### Sub-components
- `frontend/src/features/courses/components/SourceTypeTabs.tsx` (text/photo tabs)
- `frontend/src/features/courses/components/LanguageSelect.tsx`
- `frontend/src/features/quizzes/components/CoursePicker.tsx` (card grid for step 1)
- `frontend/src/features/quizzes/components/ExerciseTypeCards.tsx` (QCM/Open/Fill cards)
- `frontend/src/features/quizzes/components/AnswerCountCards.tsx` (Duo/Trio/Carré cards, values: 'duo'|'trio'|'square')
- `frontend/src/common/components/StepIndicator.tsx` (navigation cubes)

### Hooks
- Note: The hooks are exported from the provider files themselves.
  - `useCourseCreate` exported by `course-create-provider.tsx`
  - `useQuizCreate` exported by `quiz-create-provider.tsx`

## Dependencies

- Shadcn Dialog component
- Shadcn Tabs component
- Shadcn Select component
- Shadcn Textarea component
- Shadcn Button component
- Shadcn Card component
- React Hook Form + Zod for form validation
- Existing CourseApi and QuizApi interfaces

## Type Definitions

```typescript
// frontend/src/features/courses/types.ts
export interface CourseCreateFormData {
  sourceType: 'text' | 'photo';
  language: string;
  sourceText: string;
}

// frontend/src/features/quizzes/types.ts
export type QuizCreateStep = 1 | 2;
export interface QuizCreateFormData {
  courseId?: string;
  exerciseType?: 'MCQ' | 'OPEN' | 'FILL_BLANK';
  answerCount?: 'duo' | 'trio' | 'square';
}

export interface QuizCreateState {
  isOpen: boolean;
  currentStep: QuizCreateStep;
  formData: QuizCreateFormData;
}
```

## Validation Rules

### Course Creation
- sourceText: Required, minimum 100 characters, maximum 50,000 characters
- language: Required, must be one of supported languages
- sourceType: Required, one of 'text' | 'photo'

### Quiz Creation
- Step 1: courseId must be selected before proceeding to step 2
- Step 2: exerciseType and answerCount ('duo'|'trio'|'square') must be selected before submission
- Backend validates courseId exists and belongs to authenticated user

## Error Handling

### Course Creation
- Quota exceeded (Free: 3 courses) → Show upgrade prompt
- AI service unavailable → Show retry option with error message
- Invalid source text → Show validation error below textarea

### Quiz Creation
- Quota exceeded (Free: 3 quizzes) → Show upgrade prompt
- Course not found → Close dialog, show error toast
- AI generation failure → Close dialog, show error toast with retry option

## Next Steps

1. Update `ux-design.md` with complete component specifications
2. Generate tasks in `tasks.md` following strict checklist format
3. Implement providers (T950-T953)
4. Implement dialogs and sub-components (T954-T965)
5. Wire triggers to existing pages (T966-T970)
6. Add acceptance tests (T971-T972)
