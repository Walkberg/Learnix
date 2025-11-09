#### CoursePicker
- Location: `frontend/src/features/quizzes/components/CoursePicker.tsx`
- Props: `{ courses: Course[], onSelect: (id: string) => void }`
- Layout: Vertical column list (single column). Scroll if overflow.
- Card Style:
  - Default: White background, subtle border, hover lift + shadow
  - Selected (transient highlight pre-transition): Green border + tinted background (150ms)
- Content: Emoji + Title (clamp 2 lines) + optional meta (createdAt relative)
- Behavior: Click selects and immediately advances to step 2; no separate next button.
- Empty state: "Aucun cours disponible" + button "Créer un cours" (opens CourseCreationDialog)
**Step 1:**
- courseId: Required; progression only occurs upon selection.
- No navigation button; selection itself is the trigger.
#### Step 1: Course Selection (Updated Flow)

1. **Initial State**
  - Column list of user's courses (`useCourses()` hook).
  - Empty → message + create course button.
2. **Selection**
  - Click: highlight briefly, set `courseId`, auto calls `setStep(2)`.
3. **Transition**
  - No manual next; slide animation begins after selection.
**QuizzCreationDialog:**
- Step 1 Tab order: Course cards (vertical list) → Annuler
- Step 2 Tab order: Exercise type cards → Answer count cards → Retour → Créer le quizz
### CoursePicker (Updated)
1. Step 1 displays + column list loaded
2. Click course card → auto-advance to step 2 (verify `currentStep` == 2)
3. Empty state → Click "Créer un cours" opens CourseCreationDialog (still step 1 afterward)
# UX Design Add-on: Creation Dialogs

**Feature**: AI-assisted Study Generator  
**Add-on for**: ux-design.md (Dialogs & Modals section)  
**Date**: 2025-11-09

## Table of Contents
1. [CourseCreationDialog](#coursecreationdialog)
2. [QuizzCreationDialog](#quizzcreationdialog)
3. [State Management Providers](#state-management-providers)
4. [Component Specifications](#component-specifications)

---

## CourseCreationDialog

### Overview

Modal dialog for creating a new course with source text and language selection. Triggered globally via `CourseCreateProvider`.

### Visual Layout

```
┌─────────────────────────────────────────────────────┐
│ Ajouter un cours                              [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Source du cours                                     │
│ ┌──────────────────┬─────────────────┐             │
│ │ 📄 Document      │ 📷 Photo        │             │
│ │    texte  [✓]    │                 │             │
│ └──────────────────┴─────────────────┘             │
│                                                     │
│ Langue du cours *                                   │
│ ┌─────────────────────────────────────┐            │
│ │ Français                        [▼] │            │
│ └─────────────────────────────────────┘            │
│                                                     │
│ Texte du cours * (min 100 caractères)              │
│ ┌─────────────────────────────────────┐            │
│ │ [Paste or type your course text...] │            │
│ │                                     │            │
│ │                                     │            │
│ │                                     │            │
│ │                                     │            │
│ │                                     │            │
│ └─────────────────────────────────────┘            │
│ Caractères: 0/50,000                                │
│                                                     │
│              [Annuler] [Générer ma fiche]          │
└─────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
CourseCreationDialog
├── DialogHeader
│   ├── DialogTitle: "Ajouter un cours"
│   └── DialogClose (X button)
├── DialogContent
│   ├── SourceTypeTabs
│   │   ├── Tab: "Document texte" (icon: 📄)
│   │   └── Tab: "Photo" (icon: 📷, disabled in MVP)
│   ├── LanguageSelect
│   │   ├── Label: "Langue du cours *"
│   │   └── Select: Dropdown with languages
│   ├── Textarea (conditional: visible if sourceType='text')
│   │   ├── Label: "Texte du cours * (min 100 caractères)"
│   │   ├── Input: Multi-line textarea
│   │   └── CharacterCount: "Caractères: X/50,000"
│   └── PhotoUpload (conditional: visible if sourceType='photo', future)
└── DialogFooter
    ├── Button: "Annuler" (variant: ghost)
    └── Button: "Générer ma fiche" (variant: default, disabled if invalid)
```

### Props & State

**CourseCreationDialog Component**
- Location: `frontend/src/features/courses/components/CourseCreationDialog.tsx`
- Props: None (consumes `useCourseCreate()` hook)
- State: Managed by `CourseCreateProvider`

**useCourseCreate Hook**
- Exposes:
  ```typescript
  {
    isOpen: boolean,
    formData: CourseCreateFormData,
    openDialog: () => void,
    closeDialog: () => void,
    updateFormData: (data: Partial<CourseCreateFormData>) => void,
    submitCourse: () => Promise<void>,
    isSubmitting: boolean,
    error: string | null
  }
  ```

**CourseCreateFormData Type**
```typescript
interface CourseCreateFormData {
  sourceType: 'text' | 'photo';
  language: string;
  sourceText: string;
}
```

### Field Specifications

**SourceTypeTabs**
- Options: "Document texte" (default) | "Photo"
- Behavior: Single selection, updates `formData.sourceType`
- Photo tab: Disabled with tooltip "Disponible prochainement"

**LanguageSelect**
- Options: 
  - Français (default)
  - English
  - Español
  - Deutsch
  - Italiano
  - Português
- Required: Yes
- Default: "Français"

**Textarea (Source Text)**
- Min length: 100 characters
- Max length: 50,000 characters
- Placeholder: "Copiez ou tapez le texte de votre cours ici..."
- Character counter: Real-time display "Caractères: X/50,000"
- Error states:
  - Empty: "Le texte du cours est requis"
  - Too short: "Le texte doit contenir au moins 100 caractères"
  - Too long: "Le texte ne peut pas dépasser 50,000 caractères"

**PhotoUpload (Future)**
- Accepts: JPG, PNG, PDF
- Max size: 10MB
- Multiple: Yes (up to 5 files)
- Preview: Thumbnails of uploaded files

### Validation Rules

- sourceType: Required (default 'text')
- language: Required
- sourceText: Required IF sourceType='text', min 100 chars, max 50k chars
- photos: Required IF sourceType='photo', 1-5 files, max 10MB each (future)

### Behavior Flow

1. **Open Dialog**
   - User clicks trigger (QuickAction card, toolbar button)
   - `openDialog()` called → `isOpen` set to `true`
   - Dialog appears with empty form, default values (sourceType='text', language='Français')

2. **Fill Form**
   - User selects tab (if switching to photo in future)
   - User selects language from dropdown
   - User types/pastes text in textarea
   - Real-time validation: Character count updates, button enable/disable

3. **Submit**
   - User clicks "Générer ma fiche"
   - Validation runs (Zod schema)
   - If invalid: Show field-specific errors
   - If valid:
     - `isSubmitting` set to `true` → button shows loading spinner
     - Call `CourseApi.createCourse({ title: auto-generated, sourceText, language, emoji: random })`
     - On success:
       - Close dialog (`closeDialog()`)
       - Navigate to `/courses/:id`
       - Show success toast: "Cours créé! Génération de la fiche en cours..."
     - On error:
       - Show error message below form:
         - Quota exceeded: "Limite atteinte. Vous avez déjà 3 cours (compte gratuit). Passez à Premium pour créer des cours illimités."
         - AI unavailable: "Service temporairement indisponible. Veuillez réessayer dans quelques instants."
         - Network error: "Erreur de connexion. Vérifiez votre connexion internet."
       - `isSubmitting` set to `false`

4. **Cancel**
   - User clicks "Annuler" or [X] button or presses Escape
   - `closeDialog()` called → form reset, `isOpen` set to `false`
   - Dialog disappears

### Error States

**Field Errors** (inline, below field)
- Empty sourceText: Red border + "Le texte du cours est requis"
- Too short sourceText: Red border + "Le texte doit contenir au moins 100 caractères (actuel: X)"
- Too long sourceText: Red border + "Le texte ne peut pas dépasser 50,000 caractères (actuel: X)"

**Form Errors** (banner at bottom)
- Quota exceeded: Yellow banner + "⚠ Limite atteinte. Passez à Premium." + [Voir les offres] button
- AI unavailable: Red banner + "❌ Service indisponible. Réessayez plus tard."
- Network error: Red banner + "❌ Erreur de connexion. Vérifiez votre réseau."

### Responsive Behavior

- Desktop: 600px width, centered
- Tablet: 90% width, centered, max 600px
- Mobile: Full-width, slide up from bottom

---

## QuizzCreationDialog

### Overview

Multi-step wizard dialog for creating a quiz from a course. Step 1 selects course, Step 2 customizes quiz parameters. Triggered globally via `QuizzCreateProvider`.

### Step 1: Course Selection (Column + Auto-advance)

```
┌─────────────────────────────────────────────────────┐
│ Créer un quizz                                [×]   │
│ ● ○  (Indicateur d'étapes)                          │
├─────────────────────────────────────────────────────┤
│ Sur quel cours veux-tu générer un quizz ?           │
│                                                     │
│ ┌────────────────────────────────────────────┐      │
│ │ 🎯 Mathématiques                          │      │
│ │ (Cliquer pour sélectionner)               │      │
│ └────────────────────────────────────────────┘      │
│ ┌────────────────────────────────────────────┐      │
│ │ 📚 Histoire                                │      │
│ │ (Cliquer pour sélectionner)               │      │
│ └────────────────────────────────────────────┘      │
│ ┌────────────────────────────────────────────┐      │
│ │ 🧪 Physique                                │      │
│ │ (Cliquer pour sélectionner)               │      │
│ └────────────────────────────────────────────┘      │
│                                                     │
│ (Sélection d'un cours → passage automatique à       │
│  l'étape 2)                                         │
└─────────────────────────────────────────────────────┘
```

### Step 2: Quiz Customization

```
┌─────────────────────────────────────────────────────┐
│ Créer un quizz                                [×]   │
│ ○ ●  (Step indicators)                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Personnalise ton quizz                              │
│                                                     │
│ Type d'exercice *                                   │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│ │    ✓     │  │          │  │          │          │
│ │   QCM    │  │ Réponse  │  │  Texte   │          │
│ │          │  │ ouverte  │  │ à trou   │          │
│ └──────────┘  └──────────┘  └──────────┘          │
│ (single selection cards)                            │
│                                                     │
│ Nombres de réponses *                               │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│ │          │  │    ✓     │  │          │          │
│ │   Duo    │  │  Trio    │  │  Carré   │          │
│ │   (2)    │  │   (3)    │  │   (4)    │          │
│ └──────────┘  └──────────┘  └──────────┘          │
│ (single selection cards)                            │
│                                                     │
│        [← Retour]             [Créer le quizz]     │
└─────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
QuizzCreationDialog
├── DialogHeader
│   ├── DialogTitle: "Créer un quizz"
│   ├── StepIndicator (● ○ or ○ ●)
│   └── DialogClose (X button)
├── DialogContent (conditional based on currentStep)
│   ├── Step 1: Course Selection
│   │   ├── Heading: "Sur quel cours veux-tu générer un quizz ?"
│   │   └── CoursePicker (grid of CourseCard)
│   └── Step 2: Quiz Customization
│       ├── Heading: "Personnalise ton quizz"
│       ├── SectionTitle: "Type d'exercice *"
│       ├── ExerciseTypeCards (3 cards)
│       ├── SectionTitle: "Nombres de réponses *"
│       └── AnswerCountCards (3 cards)
└── DialogFooter (conditional based on currentStep)
    ├── Step 1:
    │   ├── Button: "Annuler" (variant: ghost)
    │   └── Button: "Suivant →" (variant: default, disabled if no course selected)
    └── Step 2:
        ├── Button: "← Retour" (variant: ghost)
        └── Button: "Créer le quizz" (variant: default, disabled if type or count not selected)
```

### Props & State

**QuizzCreationDialog Component**
- Location: `frontend/src/features/quizzes/components/QuizzCreationDialog.tsx`
- Props: None (consumes `useQuizCreate()` hook)
- State: Managed by `QuizzCreateProvider`

**useQuizCreate Hook**
- Exposes:
  ```typescript
  {
    isOpen: boolean,
    currentStep: 1 | 2,
    formData: QuizCreateFormData,
    openDialog: (courseId?: string) => void,
    closeDialog: () => void,
    setStep: (step: 1 | 2) => void,
    updateFormData: (data: Partial<QuizCreateFormData>) => void,
    submitQuiz: () => Promise<void>,
    isSubmitting: boolean,
    error: string | null
  }
  ```

**QuizCreateFormData Type**
```typescript
interface QuizCreateFormData {
  courseId?: string;
  exerciseType?: 'MCQ' | 'OPEN' | 'FILL_BLANK';
  answerCount?: 'duo' | 'trio' | 'square';
}
```

### Sub-Component Specifications

#### StepIndicator
- Location: `frontend/src/features/quizzes/components/StepIndicator.tsx`
- Props: `{ currentStep: 1 | 2, totalSteps: 2 }`
- Layout: Horizontal row of circles
  - Active step: Solid circle (●) with primary color
  - Inactive step: Hollow circle (○) with muted color
- Example: Step 1 active: `● ○`, Step 2 active: `○ ●`

#### CoursePicker
- Location: `frontend/src/features/quizzes/components/CoursePicker.tsx`
- Props: `{ courses: Course[], selectedCourseId?: string, onSelect: (id: string) => void }`
- Layout: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- Card Style:
  - Default: White background, gray border, hover effect (lift + shadow)
  - Selected: Green border (2px), green background tint
- Each card shows: Emoji (large), Course title (truncated to 2 lines)
- Behavior: Click to select, only one selected at a time

#### ExerciseTypeCards
- Location: `frontend/src/features/quizzes/components/ExerciseTypeCards.tsx`
- Props: `{ value?: 'MCQ' | 'OPEN' | 'FILL_BLANK', onChange: (v) => void }`
- Layout: 3 horizontal cards (full width on mobile)
- Options:
  1. **QCM** (Questions à Choix Multiples)
     - Icon: ☑️
     - Description: "Questions avec plusieurs choix de réponses"
  2. **Réponse ouverte**
     - Icon: ✏️
     - Description: "Questions nécessitant une réponse textuelle"
  3. **Texte à trou** (disabled in MVP)
     - Icon: 🔍
     - Description: "Complétez les phrases avec les mots manquants"
     - Badge: "Bientôt disponible"
- Card Style: Same as CoursePicker (default, selected states)

#### AnswerCountCards
- Location: `frontend/src/features/quizzes/components/AnswerCountCards.tsx`
- Props: `{ value?: 'duo' | 'trio' | 'square', onChange: (v) => void }`
- Layout: 3 horizontal cards
- Options:
  1. **Duo** (2) — "2 questions"
  2. **Trio** (3) — "3 questions"
  3. **Carré** (4) — "4 questions"
- Internal mapping: `{ duo:2, trio:3, square:4 }`
- Card Style: Same as CoursePicker (default, selected states)

### Validation Rules

**Step 1:**
- courseId: Required; progression occurs upon selection (auto-advance)
- No navigation button; selection itself triggers step change

**Step 2:**
- exerciseType: Required before submission
- answerCount: Required before submission ('duo'|'trio'|'square')
- Validation trigger: "Créer le quizz" button disabled until both selected

### Behavior Flow

#### Opening Dialog

**Scenario 1: Open from Home/Quizzes page (no pre-selection)**
1. User clicks "Créer un quizz" trigger
2. `openDialog()` called → `isOpen` set to `true`, `currentStep` set to `1`
3. Dialog appears at Step 1 (course selection)

**Scenario 2: Open from Course Detail page (pre-selection)**
1. User clicks "Créer un quiz" on course detail page
2. `openDialog(courseId)` called → `isOpen` set to `true`, `formData.courseId` set, `currentStep` set to `2`
3. Dialog appears at Step 2 (quiz customization) with course already selected

#### Step 1: Course Selection (Updated)

1. **Initial State**
  - Display a vertical column list of user's courses (from `useCourses()` hook)
  - If no courses exist: Show empty state "Vous n'avez pas encore de cours. Créez-en un d'abord!" with CTA to open CourseCreationDialog

2. **User Selects Course**
  - User clicks a course card → brief highlight (green border + tint)
  - `updateFormData({ courseId })` then `setStep(2)` are called immediately (auto-advance)

3. **Transition**
  - Dialog transitions to Step 2 with slide animation; no "Suivant" button

#### Step 2: Quiz Customization

1. **Initial State**
   - Display exercise type cards (3 options)
   - Display answer count cards (3 options)
   - "Créer le quizz" button disabled
   - "← Retour" button enabled

2. **User Selects Options**
  - User clicks exercise type card → Card highlighted
  - User clicks answer count card → Card highlighted (value stored as string)
  - `updateFormData({ exerciseType, answerCount })` called
  - "Créer le quizz" button enabled when both selected

3. **User Goes Back**
   - User clicks "← Retour"
   - `setStep(1)` called → `currentStep` set to `1`
   - Dialog returns to Step 1
   - Previous selections preserved in `formData`

4. **User Submits**
   - User clicks "Créer le quizz"
   - `submitQuiz()` called:
     - `isSubmitting` set to `true` → button shows loading spinner
     - Internal: map answerCount string to numeric and call `QuizApi.generate(courseId, { type: exerciseType, count })`
     - On success:
       - Close dialog (`closeDialog()`)
       - Navigate to `/quizzes/:id`
       - Show success toast: "Quiz créé! Prêt à être réalisé."
     - On error:
       - Show error message below form (similar to CourseCreationDialog)
       - `isSubmitting` set to `false`

#### Canceling

- User clicks "Annuler" (Step 1) or [X] button (any step) or presses Escape
- `closeDialog()` called → form reset, `isOpen` set to `false`, `currentStep` set to `1`
- Dialog disappears

### Error States

**Step 1 Errors:**
- No courses available: Empty state card with "Créer mon premier cours" button → Opens CourseCreationDialog

**Step 2 Errors:**
- Quota exceeded: Yellow banner + "⚠ Limite atteinte (3 quizz gratuits). Passez à Premium." + [Voir les offres] button
- Course not found: Red banner + "❌ Cours introuvable. Veuillez réessayer."
- AI unavailable: Red banner + "❌ Service indisponible. Réessayez plus tard."
- Network error: Red banner + "❌ Erreur de connexion."

### Responsive Behavior

- Desktop: 700px width, centered, 2-column grid for cards
- Tablet: 90% width, centered, max 700px, 2-column grid
- Mobile: Full-width, slide up from bottom, 1-column grid for cards

---

## State Management Providers

### CourseCreateProvider

**Location**: `frontend/src/features/courses/providers/course-create-provider.tsx`

**Interface:**
```typescript
interface CourseCreateContextValue {
  isOpen: boolean;
  formData: CourseCreateFormData;
  openDialog: () => void;
  closeDialog: () => void;
  updateFormData: (data: Partial<CourseCreateFormData>) => void;
  submitCourse: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}
```

**Default State:**
```typescript
{
  isOpen: false,
  formData: {
    sourceType: 'text',
    language: 'Français',
    sourceText: ''
  },
  isSubmitting: false,
  error: null
}
```

**Methods:**
- `openDialog()`: Sets `isOpen` to `true`
- `closeDialog()`: Sets `isOpen` to `false`, resets `formData` to default
- `updateFormData(data)`: Merges `data` into `formData`
- `submitCourse()`: Validates form, calls API, handles success/error

**Integration:**
- Wraps entire app in `main.tsx`
- Consumed by `CourseCreationDialog` and trigger components (HomePage, CoursesListPage)

### QuizzCreateProvider

**Location**: `frontend/src/features/quizzes/providers/quiz-create-provider.tsx`

**Interface:**
```typescript
interface QuizCreateContextValue {
  isOpen: boolean;
  currentStep: 1 | 2;
  formData: QuizCreateFormData;
  openDialog: (courseId?: string) => void;
  closeDialog: () => void;
  setStep: (step: 1 | 2) => void;
  updateFormData: (data: Partial<QuizCreateFormData>) => void;
  submitQuiz: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}
```

**Default State:**
```typescript
{
  isOpen: false,
  currentStep: 1,
  formData: {
    courseId: undefined,
    exerciseType: undefined,
    answerCount: undefined
  },
  isSubmitting: false,
  error: null
}
```

**Methods:**
- `openDialog(courseId?)`: Sets `isOpen` to `true`, optionally sets `formData.courseId` and `currentStep` to `2` if `courseId` provided
- `closeDialog()`: Sets `isOpen` to `false`, resets `formData` and `currentStep` to defaults
- `setStep(step)`: Sets `currentStep` to `step` (1 or 2)
- `updateFormData(data)`: Merges `data` into `formData`
- `submitQuiz()`: Validates form, calls API, handles success/error, navigates on success

**Integration:**
- Wraps entire app in `main.tsx`
- Consumed by `QuizzCreationDialog` and trigger components (HomePage, CoursesListPage, CourseDetailPage, QuizzesListPage)

---

## Integration Points

### Trigger Components

**HomePage QuickActionsSection** (`frontend/src/features/home/components/QuickActionsSection.tsx`)
- "Générer une fiche" card → `useCourseCreate().openDialog()`
- "Créer un quizz" card → `useQuizCreate().openDialog()`

**CoursesListPage CourseListToolbar** (`frontend/src/features/courses/components/CourseListToolbar.tsx`)
- "Ajouter un cours" button → `useCourseCreate().openDialog()`

**CourseDetailPage** (`frontend/src/features/courses/pages/CourseDetailPage.tsx`)
- "+ Créer un quiz" button → `useQuizCreate().openDialog(courseId)` (pre-selects course, opens at step 2)

**QuizzesListPage QuizListToolbar** (`frontend/src/features/quizzes/components/QuizListToolbar.tsx`)
- "+ Créer un quiz" button → `useQuizCreate().openDialog()`

### Dialog Mounting

Both dialogs are rendered conditionally based on `isOpen` state:

```tsx
// In app root or layout component
<CourseCreationDialog /> {/* Renders when useCourseCreate().isOpen === true */}
<QuizzCreationDialog />  {/* Renders when useQuizCreate().isOpen === true */}
```

Alternatively, dialogs can be rendered directly in trigger components with conditional mounting.

---

## Accessibility

### Keyboard Navigation

**CourseCreationDialog:**
- Tab order: Source type tabs → Language select → Textarea → Annuler → Générer ma fiche
- Escape: Close dialog
- Enter (when focused on textarea): No action (allow newlines)
- Enter (when focused on button): Submit form

**QuizzCreationDialog:**
- Step 1 Tab order: Course cards (vertical list) → Annuler
- Step 2 Tab order: Exercise type cards → Answer count cards → Retour → Créer le quizz
- Escape: Close dialog
- Arrow keys: Navigate within card grids
- Enter/Space (on card): Select card

### ARIA Labels

- Dialog: `role="dialog"`, `aria-labelledby="dialog-title"`, `aria-modal="true"`
- Step indicators: `aria-label="Étape 1 sur 2"` / `aria-label="Étape 2 sur 2"`
- Card grids: `role="radiogroup"`, `aria-labelledby="section-title"`
- Cards: `role="radio"`, `aria-checked="true|false"`
- Disabled cards: `aria-disabled="true"`, `title="Bientôt disponible"`

### Screen Reader Announcements

- On dialog open: "Dialogue ouvert: [Dialog title]"
- On step change: "Étape [X] sur 2"
- On card selection: "[Option name] sélectionné(e)"
 - On answer count selection: "Mode [Duo|Trio|Carré] sélectionné"
- On form submission: "Création en cours..."
- On success: "Créé avec succès. Redirection..."
- On error: "[Error message]"

---

## Animation & Transitions

### Dialog Entrance/Exit

- Entrance: Fade in (opacity 0 → 1) + Scale up (scale 0.95 → 1) over 200ms
- Exit: Fade out (opacity 1 → 0) + Scale down (scale 1 → 0.95) over 150ms
- Backdrop: Fade in/out over 200ms

### Step Transitions (QuizzCreationDialog)

- Step change: Slide animation (step 1 → 2: slide left; step 2 → 1: slide right) over 300ms with ease-in-out
- Content crossfade: Outgoing content fades out (150ms) → Incoming content fades in (150ms)

### Card Selection

- Hover: Lift (translateY: -2px) + Shadow increase over 150ms
- Selection: Border color change + Background tint over 100ms
- Deselection: Reverse animation

---

## Error Handling UX

### Validation Errors (Inline)

- Display immediately below affected field
- Red text with error icon (⚠)
- Field border turns red
- Error persists until field is corrected

### Form-Level Errors (Banner)

- Display at bottom of dialog, above footer buttons
- Colored banner (yellow for warnings, red for errors)
- Icon + Message + Optional action button
- Auto-dismiss after 5 seconds for non-critical errors
- Persist for critical errors (quota exceeded, network failure)

### Loading States

- Submitting: Button disabled, spinner icon, text changes to "Création en cours..."
- Dialog content dimmed (opacity 0.6)
- Prevent dialog close during submission

---

## Testing Scenarios

### CourseCreationDialog

1. Open dialog → Verify default values (text tab, Français language, empty textarea)
2. Type < 100 chars → Verify "Suivant" disabled + error message
3. Type > 50k chars → Verify error message + red border
4. Select language → Verify dropdown updates
5. Submit valid form → Verify API call + navigation + success toast
6. Submit with quota exceeded → Verify error banner + upgrade prompt
7. Cancel → Verify dialog closes + form resets
8. Switch tabs → Verify textarea/upload section toggles

### QuizzCreationDialog

1. Open dialog → Verify step 1 displays + column list loaded
2. Click course card → Verify auto-advance to step 2 (no button present)
3. Empty state path → create course opens CourseCreationDialog and returns still at step 1 afterwards
4. Select exercise type → Verify card highlighted
5. Select answer count → Verify card highlighted + "Créer le quizz" enabled
6. Click "Retour" → Verify step 1 displays + previous selection preserved
7. Submit valid form → Verify API call + navigation + success toast
8. Submit with quota exceeded → Verify error banner
9. Cancel at any step → Verify dialog closes + form resets
10. Open with pre-selected course → Verify step 2 displays immediately

---

**End of UX Design Add-on**
