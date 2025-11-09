# UX Design Document: Learnix Frontend

**Feature**: AI-assisted Study Generator  
**Branch**: `001-ai-study-generator`  
**Created**: 2025-11-09  
**Based on**: PLAN.md - Étape 5: UX et design du site

## Table of Contents
1. [Application Layout](#application-layout)
2. [Navigation Architecture](#navigation-architecture)
3. [Page Components Breakdown](#page-components-breakdown)
4. [Reusable Components Library](#reusable-components-library)
5. [Data Flow & State Management](#data-flow--state-management)
6. [Implementation Checklist](#implementation-checklist)

---

## Application Layout

### Global Layout Structure

All pages (except authentication pages) use a consistent layout with a sidebar navigation:

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────┬───────────────────────────────────────────┐   │
│  │          │                                           │   │
│  │          │                                           │   │
│  │ Sidebar  │        Main Content Area                  │   │
│  │          │                                           │   │
│  │          │                                           │   │
│  └──────────┴───────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Component

**AppSidebar**
- Location: `src/features/layout/components/AppSidebar.tsx`
- Props: `{ isCollapsed: boolean, onToggleCollapse: () => void }`
- States: Expanded (default), Collapsed (icons only)

#### Sidebar Structure (Expanded)

```
┌────────────────┐
│ 🎓 Learnix [◀] │ ← Logo + Collapse button
├────────────────┤
│                │
│ 🏠 Accueil     │ ← Navigation items (icon + text)
│ 📚 Cours       │
│ ❓ Quizz       │
│ 💬 Chat        │
│                │
│                │
│                │
│   (spacer)     │
│                │
│                │
├────────────────┤
│ 👤 John Doe    │ ← User avatar + name (popover trigger)
└────────────────┘
```

#### Sidebar Structure (Collapsed)

```
┌────┐
│ 🎓▶│ ← Logo + Expand button
├────┤
│    │
│ 🏠 │ ← Navigation icons only (with tooltip)
│ 📚 │
│ ❓ │
│ 💬 │
│    │
│    │
│    │
│    │
│    │
│    │
├────┤
│ 👤 │ ← User avatar only (popover trigger)
└────┘
```

#### Sidebar Components

**SidebarHeader**
- Location: `src/features/layout/components/SidebarHeader.tsx`
- Props: `{ isCollapsed: boolean, onToggleCollapse: () => void }`
- Contains: Logo + Collapse/Expand button

**SidebarNavigation**
- Location: `src/features/layout/components/SidebarNavigation.tsx`
- Props: `{ isCollapsed: boolean }`
- Contains: 4 navigation items

**SidebarNavItem**
- Location: `src/features/layout/components/SidebarNavItem.tsx`
- Props: `{ icon: ReactNode, label: string, href: string, isActive: boolean, isCollapsed: boolean }`
- Features: 
  - Active state highlighting
  - Tooltip when collapsed
  - Icon + text when expanded
  - Icon only when collapsed

**Navigation Items:**
1. 🏠 Accueil → `/`
2. 📚 Cours → `/courses`
3. ❓ Quizz → `/quizzes`
4. 💬 Chat → `/chat`

**SidebarFooter**
- Location: `src/features/layout/components/SidebarFooter.tsx`
- Props: `{ user: User, isCollapsed: boolean }`
- Contains: UserProfileButton

**UserProfileButton**
- Location: `src/features/layout/components/UserProfileButton.tsx`
- Props: `{ user: User, isCollapsed: boolean }`
- Features:
  - Shows avatar + name when expanded
  - Shows avatar only when collapsed
  - Opens UserProfilePopover on click

**UserProfilePopover**
- Location: `src/features/layout/components/UserProfilePopover.tsx`
- Props: `{ onNavigateToAccount: () => void, onLogout: () => void }`
- Content:
  ```
  ┌─────────────────────┐
  │ Mon Compte          │
  │ Se déconnecter      │
  └─────────────────────┘
  ```

### Layout Wrapper

**AppLayout**
- Location: `src/features/layout/components/AppLayout.tsx`
- Props: `{ children: ReactNode }`
- Features:
  - Manages sidebar collapse state (persisted in localStorage)
  - Wraps all authenticated pages
  - Does NOT wrap authentication pages

**Usage:**
```typescript
// In main App routing
<Routes>
  {/* Auth routes - no sidebar */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* App routes - with sidebar */}
  <Route element={<AppLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/courses" element={<CoursesPage />} />
    {/* ... other routes */}
  </Route>
</Routes>
```

---

## Navigation Architecture

### Route Structure

```
/                           → Home Page (Dashboard)
/courses                    → Course List Page
/courses/:id                → Course Detail Page (redirects to /courses/:id/summary)
/courses/:id/summary        → Course Summary Tab
/courses/:id/flashcards     → Course Flashcards Tab
/courses/:id/quiz-summary   → Quiz Summary Tab (Entraînement)
/courses/:id/quiz-results   → Quiz Results Overview (Résumé des quizz)
/courses/:id/quizzes        → Quiz List for Course
/quizzes                    → All Quizzes Page
/quizzes/:id                → Quiz Detail/Results Page
/quizzes/:id/attempt        → Quiz Taking Page (active attempt)
/chat                       → AI Chat Page
/settings                   → Settings Page
/settings/account           → Account Settings
/settings/subscription      → Subscription Settings
/settings/other             → Other Settings
```

### Navigation Hierarchy

```
├── Home (/)
│   ├── Quick Actions (3 cards)
│   ├── My Courses Section
│   └── My Quizzes Section
├── Courses (/courses)
│   └── Course Detail (/courses/:id)
│       ├── Summary Tab (/courses/:id/summary)
│       ├── Flashcards Tab (/courses/:id/flashcards)
│       ├── Training Tab (/courses/:id/quiz-summary)
│       ├── Quiz Results Tab (/courses/:id/quiz-results)
│       └── Quiz List Tab (/courses/:id/quizzes)
├── Quizzes (/quizzes)
│   └── Quiz Detail (/quizzes/:id)
│       ├── Results View (if completed)
│       └── Attempt View (/quizzes/:id/attempt)
├── Chat (/chat)
└── Settings (/settings)
    ├── Account (/settings/account)
    ├── Subscription (/settings/subscription)
    └── Other (/settings/other)
```

---

## Page Components Breakdown

### 1. Home Page `/`

**Route**: `/`  
**Purpose**: Dashboard showing quick actions and recent courses/quizzes

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  PageHeader: "Accueil"                           │
│          │                                                  │
│          │  QuickActionsSection                             │
│          │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│          │  │ Quick    │  │ Quick    │  │ Quick    │       │
│  Sidebar │  │ Action   │  │ Action   │  │ Action   │       │
│          │  │ (Fiche)  │  │ (Quiz)   │  │ (Révise) │       │
│          │  └──────────┘  └──────────┘  └──────────┘       │
│          │                                                  │
│          │  CoursesSection                                  │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ SectionHeader: "Mes cours" + AddButton  │     │
│          │  └─────────────────────────────────────────┘     │
│          │  ┌────────┐  ┌────────┐  ┌────────┐            │
│          │  │ Course │  │ Course │  │ Course │            │
│          │  │  Card  │  │  Card  │  │  Card  │            │
│          │  └────────┘  └────────┘  └────────┘            │
│          │                                                  │
│          │  QuizzesSection                                  │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ SectionHeader: "Mes quizz" + AddButton │     │
│          │  └─────────────────────────────────────────┘     │
│          │  ┌────────┐  ┌────────┐  ┌────────┐            │
│          │  │  Quiz  │  │  Quiz  │  │  Quiz  │            │
│          │  │  Card  │  │  Card  │  │  Card  │            │
│          │  └────────┘  └────────┘  └────────┘            │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuickActionsSection**
- Location: `src/features/home/components/QuickActionsSection.tsx`
- Props: None
- Children: 3 × QuickActionCard

**QuickActionCard**
- Location: `src/features/home/components/QuickActionCard.tsx`
- Props: `{ title: string, description: string, icon: ReactNode, onClick: () => void }`
- Variants:
  - "Générer une fiche" → Navigate to course creation
  - "Créer un quizz" → Open quiz creation dialog
  - "Réviser avec Learnix" → Navigate to chat

**CoursesSection**
- Location: `src/features/courses/components/CoursesSection.tsx`
- Props: `{ courses: Course[], maxDisplay?: number }`
- Children: SectionHeader + CourseCard grid

**SectionHeader**
- Location: `src/components/SectionHeader.tsx`
- Props: `{ title: string, count?: number, actionLabel?: string, onAction?: () => void }`
- Displays: Title with optional count badge + action button (right-aligned)

**CourseCard**
- Location: `src/features/courses/components/CourseCard.tsx`
- Props: `{ course: Course, onDelete: (id: string) => void }`
- Layout:
  ```
  ┌────────────────────────┐
  │ 🎯 Emoji    [⋮ Menu]   │ ← Header
  │                        │
  │ Course Title           │ ← Content
  │                        │
  │ Created: 2 days ago    │ ← Footer
  └────────────────────────┘
  ```
- Contains: Emoji icon (top-left), Kebab menu (top-right), Title, Creation date
- Kebab menu opens: DeleteCoursePopover

**QuizzesSection**
- Location: `src/features/quizzes/components/QuizzesSection.tsx`
- Props: `{ quizzes: Quiz[], maxDisplay?: number }`
- Children: SectionHeader + QuizCard grid

**QuizCard**
- Location: `src/features/quizzes/components/QuizCard.tsx`
- Props: `{ quiz: Quiz, onDelete: (id: string) => void }`
- Layout:
  ```
  ┌────────────────────────┐
  │ 📝 Icon     [⋮ Menu]   │ ← Header
  │                        │
  │ Course Name            │ ← Content
  │ ▓▓▓▓▓▓▓░░░  5/10       │ ← Progress Bar
  │ [Badge: Non appris]    │ ← Status Tag
  └────────────────────────┘
  ```
- Contains: Generic quiz icon, Kebab menu, Course name, Progress bar, Status badge
- Progress bar colors: Red (<30%), Yellow (30-70%), Green (>70%)
- Status badges: "Non appris" (red), "À revoir" (yellow), "Acquis" (green)

---

### 2. Course List Page `/courses`

**Route**: `/courses`  
**Purpose**: Full list of user's courses with search

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  PageHeader: "Mes cours" [Badge: 12]            │
│          │                                                  │
│          │  CourseListToolbar                               │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ [🔍 Search...]      [+ Ajouter cours]  │     │
│  Sidebar │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  CourseGrid                                      │
│          │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────┐   │
│          │  │ Course │  │ Course │  │ Course │  │... │   │
│          │  │  Card  │  │  Card  │  │  Card  │  │    │   │
│          │  └────────┘  └────────┘  └────────┘  └────┘   │
│          │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────┐   │
│          │  │ Course │  │ Course │  │ Course │  │... │   │
│          │  │  Card  │  │  Card  │  │  Card  │  │    │   │
│          │  └────────┘  └────────┘  └────────┘  └────┘   │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**PageHeader**
- Location: `src/components/PageHeader.tsx`
- Props: `{ title: string, count?: number }`
- Displays: Title with optional count badge

**CourseListToolbar**
- Location: `src/features/courses/components/CourseListToolbar.tsx`
- Props: `{ onSearch: (query: string) => void, onAddCourse: () => void }`
- Contains: SearchBar (left) + AddCourseButton (right)

**SearchBar**
- Location: `src/components/SearchBar.tsx`
- Props: `{ placeholder: string, value: string, onChange: (value: string) => void }`
- Standard search input with icon

**AddCourseButton**
- Location: `src/features/courses/components/AddCourseButton.tsx`
- Props: `{ onClick: () => void }`
- Button with "+" icon + "Ajouter un cours" label

**CourseGrid**
- Location: `src/features/courses/components/CourseGrid.tsx`
- Props: `{ courses: Course[], onDeleteCourse: (id: string) => void }`
- Responsive grid of CourseCard components

---

### 3. Course Detail Page `/courses/:id`

**Route**: `/courses/:id/*`  
**Purpose**: Detailed view of a course with multiple tabs

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  CourseDetailHeader                              │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ 🎯 Course Title          [⋮ Menu]      │     │
│          │  └─────────────────────────────────────────┘     │
│  Sidebar │                                                  │
│          │  CourseTabNavigation                             │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ [Résumé] [Flashcards] [Entraînement]...│     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  <RouteOutlet: Tab Content>                      │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**CourseDetailHeader**
- Location: `src/features/courses/components/CourseDetailHeader.tsx`
- Props: `{ course: Course, onEdit: () => void, onDelete: () => void }`
- Contains: Emoji + Title + Kebab menu

**CourseTabNavigation**
- Location: `src/features/courses/components/CourseTabNavigation.tsx`
- Props: `{ courseId: string, activeTab: string }`
- Tabs: "Résumé" | "Flashcards" | "Entraînement" | "Résumé des quizz" | "Liste des quizz"

---

### 3a. Course Summary Tab `/courses/:id/summary`

**Route**: `/courses/:id/summary`  
**Purpose**: Display AI-generated summary of the course

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  SummaryContent                                  │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ Summary Status Badge [Généré ✓]        │     │
│          │  │                                         │     │
│  Sidebar │  │ # Course Title                          │     │
│          │  │                                         │     │
│          │  │ Summary paragraphs here...              │     │
│          │  │                                         │     │
│          │  │ ## Points clés                          │     │
│          │  │ • Key point 1                           │     │
│          │  │ • Key point 2                           │     │
│          │  │ • Key point 3                           │     │
│          │  │                                         │     │
│          │  │ [🔄 Régénérer] [✏️ Éditer]              │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**SummaryContent**
- Location: `src/features/summaries/components/SummaryContent.tsx`
- Props: `{ summary: Summary, onRegenerate: () => void, onEdit: () => void }`
- Contains: Status badge + Markdown renderer + Action buttons

**StatusBadge**
- Location: `src/components/StatusBadge.tsx`
- Props: `{ status: 'PENDING' | 'GENERATED' | 'ERROR' }`
- Variants: Loading (yellow), Success (green), Error (red)

**MarkdownRenderer**
- Location: `src/components/MarkdownRenderer.tsx`
- Props: `{ content: string }`
- Renders: Formatted markdown with custom styles

**RegenerateButton**
- Location: `src/features/summaries/components/RegenerateButton.tsx`
- Props: `{ onRegenerate: () => void, isLoading: boolean }`

**EditSummaryButton**
- Location: `src/features/summaries/components/EditSummaryButton.tsx`
- Props: `{ onEdit: () => void }`
- Opens: EditSummaryDialog

---

### 3b. Course Flashcards Tab `/courses/:id/flashcards`

**Route**: `/courses/:id/flashcards`  
**Purpose**: Display and manage flashcards for the course

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  FlashcardsToolbar                               │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ [+ Ajouter flashcard]       [Mode]     │     │
│          │  └─────────────────────────────────────────┘     │
│  Sidebar │                                                  │
│          │  FlashcardsList / FlashcardsStudyMode            │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                                         │     │
│          │  │  [FlashcardItem] or                     │     │
│          │  │  [FlashcardStudyCard]                   │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**FlashcardsToolbar**
- Location: `src/features/flashcards/components/FlashcardsToolbar.tsx`
- Props: `{ onAddFlashcard: () => void, mode: 'list' | 'study', onModeChange: (mode) => void }`

**FlashcardsList**
- Location: `src/features/flashcards/components/FlashcardsList.tsx`
- Props: `{ flashcards: Flashcard[], onEdit: (id) => void, onDelete: (id) => void }`
- Grid/list of editable flashcard items

**FlashcardItem**
- Location: `src/features/flashcards/components/FlashcardItem.tsx`
- Props: `{ flashcard: Flashcard, onEdit: () => void, onDelete: () => void }`
- Layout:
  ```
  ┌────────────────────────┐
  │ Q: Question here?      │
  │ A: Answer here.        │
  │ [✏️ Edit] [🗑️ Delete]  │
  └────────────────────────┘
  ```

**FlashcardsStudyMode**
- Location: `src/features/flashcards/components/FlashcardsStudyMode.tsx`
- Props: `{ flashcards: Flashcard[] }`
- Interactive study interface with flip cards

**FlashcardStudyCard**
- Location: `src/features/flashcards/components/FlashcardStudyCard.tsx`
- Props: `{ flashcard: Flashcard, onFlip: () => void }`
- Flippable card showing question/answer

---

### 3c. Course Quiz Summary Tab `/courses/:id/quiz-summary`

**Route**: `/courses/:id/quiz-summary`  
**Purpose**: Training mode - quick start a quiz

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  QuizSummaryContent                              │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                                         │     │
│          │  │  📊 Statistics Overview                 │     │
│          │  │  ┌────────┐  ┌────────┐  ┌────────┐   │     │
│  Sidebar │  │  │ Total  │  │  Avg   │  │  Best  │   │     │
│          │  │  │ Quiz   │  │ Score  │  │ Score  │   │     │
│          │  │  │   12   │  │  75%   │  │  95%   │   │     │
│          │  │  └────────┘  └────────┘  └────────┘   │     │
│          │  │                                         │     │
│          │  │  [🎯 Démarrer un quiz d'entraînement]  │     │
│          │  │                                         │     │
│          │  │  Recent Attempts                        │     │
│          │  │  ┌──────────────────────────────┐      │     │
│          │  │  │ Quiz 1 - 8/10 - Il y a 2 j   │      │     │
│          │  │  │ Quiz 2 - 7/10 - Il y a 3 j   │      │     │
│          │  │  └──────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuizSummaryContent**
- Location: `src/features/quizzes/components/QuizSummaryContent.tsx`
- Props: `{ courseId: string, statistics: QuizStatistics, recentAttempts: QuizAttempt[] }`

**StatisticsGrid**
- Location: `src/features/quizzes/components/StatisticsGrid.tsx`
- Props: `{ stats: QuizStatistics }`
- Display: Total quizzes, average score, best score

**StatCard**
- Location: `src/components/StatCard.tsx`
- Props: `{ title: string, value: string | number, icon?: ReactNode }`

**StartTrainingButton**
- Location: `src/features/quizzes/components/StartTrainingButton.tsx`
- Props: `{ courseId: string }`
- Action: Creates new quiz attempt and navigates to attempt page

**RecentAttemptsList**
- Location: `src/features/quizzes/components/RecentAttemptsList.tsx`
- Props: `{ attempts: QuizAttempt[] }`

---

### 3d. Course Quiz Results Tab `/courses/:id/quiz-results`

**Route**: `/courses/:id/quiz-results`  
**Purpose**: Overview of all quiz results for the course

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  QuizResultsOverview                             │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                                         │     │
│          │  │  Overall Performance                    │     │
│  Sidebar │  │  ┌──────────────────────────────┐      │     │
│          │  │  │ ○ 75% - Moyenne générale    │      │     │
│          │  │  │     😊 Bon travail!          │      │     │
│          │  │  └──────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │  Performance by Topic/Quiz              │     │
│          │  │  ┌──────────────────────────────┐      │     │
│          │  │  │ [▓▓▓▓▓▓] Quiz 1: 90%  ✓     │      │     │
│          │  │  │ [▓▓▓░░░] Quiz 2: 60%  ⚠     │      │     │
│          │  │  │ [▓░░░░░] Quiz 3: 45%  ✗     │      │     │
│          │  │  └──────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuizResultsOverview**
- Location: `src/features/quizzes/components/QuizResultsOverview.tsx`
- Props: `{ courseId: string, results: QuizResultSummary[] }`

**OverallPerformanceCard**
- Location: `src/features/quizzes/components/OverallPerformanceCard.tsx`
- Props: `{ averageScore: number, totalQuizzes: number }`
- Circular progress with emoji based on score

**QuizPerformanceList**
- Location: `src/features/quizzes/components/QuizPerformanceList.tsx`
- Props: `{ results: QuizResultSummary[] }`

**QuizPerformanceItem**
- Location: `src/features/quizzes/components/QuizPerformanceItem.tsx`
- Props: `{ quiz: Quiz, result: QuizResultSummary }`
- Progress bar with colored indicator

---

### 3e. Course Quiz List Tab `/courses/:id/quizzes`

**Route**: `/courses/:id/quizzes`  
**Purpose**: List all quizzes for a specific course

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  QuizListToolbar                                 │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                  [+ Créer un quiz]     │     │
│  Sidebar │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  QuizListGrid                                    │
│          │  ┌────────┐  ┌────────┐  ┌────────┐            │
│          │  │  Quiz  │  │  Quiz  │  │  Quiz  │            │
│          │  │  Card  │  │  Card  │  │  Card  │            │
│          │  └────────┘  └────────┘  └────────┘            │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuizListToolbar**
- Location: `src/features/quizzes/components/QuizListToolbar.tsx`
- Props: `{ onCreateQuiz: () => void }`

**QuizListGrid**
- Location: `src/features/quizzes/components/QuizListGrid.tsx`
- Props: `{ quizzes: Quiz[], onDeleteQuiz: (id) => void }`
- Grid of QuizCard components (reused from home page)

---

### 4. All Quizzes Page `/quizzes`

**Route**: `/quizzes`  
**Purpose**: View all quizzes across all courses

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  PageHeader: "Mes quizz" [Badge: 24]            │
│          │                                                  │
│          │  QuizListToolbar                                 │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                  [+ Créer un quiz]     │     │
│  Sidebar │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  QuizzesGroupedByCourse                          │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ 🎯 Mathematics (3 quizzes)              │     │
│          │  │ ┌────────┐  ┌────────┐  ┌────────┐     │     │
│          │  │ │  Quiz  │  │  Quiz  │  │  Quiz  │     │     │
│          │  │ │  Card  │  │  Card  │  │  Card  │     │     │
│          │  │ └────────┘  └────────┘  └────────┘     │     │
│          │  │                                         │     │
│          │  │ 📚 History (2 quizzes)                  │     │
│          │  │ ┌────────┐  ┌────────┐                 │     │
│          │  │ │  Quiz  │  │  Quiz  │                 │     │
│          │  │ │  Card  │  │  Card  │                 │     │
│          │  │ └────────┘  └────────┘                 │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuizzesGroupedByCourse**
- Location: `src/features/quizzes/components/QuizzesGroupedByCourse.tsx`
- Props: `{ quizzesByCourse: Map<Course, Quiz[]>, onDeleteQuiz: (id) => void }`

**CourseQuizGroup**
- Location: `src/features/quizzes/components/CourseQuizGroup.tsx`
- Props: `{ course: Course, quizzes: Quiz[], onDeleteQuiz: (id) => void }`
- Contains: Course header + QuizCard grid

---

### 5. Quiz Detail/Results Page `/quizzes/:id`

**Route**: `/quizzes/:id`  
**Purpose**: Display quiz results after completion

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  QuizResultHeader                                │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ Quizz du 09/11/2024                     │     │
│          │  │ 🎯 Course Name                          │     │
│  Sidebar │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  ScoreCircle                                     │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │           ╱───────╲                     │     │
│          │  │          │   8/10  │                    │     │
│          │  │          │   😊    │                    │     │
│          │  │           ╲───────╱                     │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  QuizResultActions                               │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ [🏠 Retour] [🔄 Rejouer le quiz]       │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  CorrectionSection                               │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ Correction                              │     │
│          │  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [✓] Question 1: What is...?  │      │     │
│          │  │ │ ○ Option A (incorrect)       │      │     │
│          │  │ │ ● Option B (correct) ✓       │      │     │
│          │  │ │ ○ Option C (incorrect)       │      │     │
│          │  │ │ ○ Option D (incorrect)       │      │     │
│          │  │ │ ➜ Explanation: Because...    │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [✗] Question 2: Why did...?  │      │     │
│          │  │ │ ...                           │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuizResultHeader**
- Location: `src/features/quizzes/components/QuizResultHeader.tsx`
- Props: `{ quiz: Quiz, attemptDate: Date }`

**ScoreCircle**
- Location: `src/features/quizzes/components/ScoreCircle.tsx`
- Props: `{ score: number, total: number }`
- Circular progress indicator with emoji based on percentage

**QuizResultActions**
- Location: `src/features/quizzes/components/QuizResultActions.tsx`
- Props: `{ onReturnHome: () => void, onRetakeQuiz: () => void }`

**CorrectionSection**
- Location: `src/features/quizzes/components/CorrectionSection.tsx`
- Props: `{ quiz: Quiz, attempt: QuizAttempt }`
- Header: "Correction"

**QuestionCorrectionCard**
- Location: `src/features/quizzes/components/QuestionCorrectionCard.tsx`
- Props: `{ question: Question, userAnswer: Answer, isCorrect: boolean }`
- Layout:
  - Header: Check/X icon + question text
  - Content: List of options with correct (green) and incorrect selected (red) highlighted
  - Footer: Explanation (if wrong or always shown)

---

### 6. Quiz Attempt Page `/quizzes/:id/attempt`

**Route**: `/quizzes/:id/attempt`  
**Purpose**: Active quiz-taking interface

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  QuizProgressBar                                 │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ ■■■■■■■■□□□□□□□□□□□□    (7/20)         │     │
│          │  └─────────────────────────────────────────┘     │
│  Sidebar │                                                  │
│          │  QuestionCounter                                 │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ Question 7/20                           │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  QuestionDisplay                                 │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                                         │     │
│          │  │ What is the capital of France?          │     │
│          │  │                                         │     │
│          │  │ [AnswerOptions: MCQ or OPEN input]      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  QuestionFeedback (after answer selected)        │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ ✓ Bonne réponse!                        │     │
│          │  │ [Selected wrong option in red]          │     │
│          │  │ [Correct option in green]               │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  QuizAttemptActions                              │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │          [Question suivante →]          │     │
│          │  │       or [Voir mon score 🏆]            │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**QuizProgressBar**
- Location: `src/features/quizzes/components/QuizProgressBar.tsx`
- Props: `{ currentQuestion: number, totalQuestions: number, answeredQuestions: boolean[] }`
- Visual: Small squares (gray = unanswered, colored = answered)

**QuestionCounter**
- Location: `src/features/quizzes/components/QuestionCounter.tsx`
- Props: `{ current: number, total: number }`

**QuestionDisplay**
- Location: `src/features/quizzes/components/QuestionDisplay.tsx`
- Props: `{ question: Question, onAnswer: (answer: Answer) => void, showFeedback: boolean }`
- Children: MCQAnswerOptions or OpenAnswerInput

**MCQAnswerOptions**
- Location: `src/features/quizzes/components/MCQAnswerOptions.tsx`
- Props: `{ options: string[], selectedIndex?: number, correctIndex?: number, onSelect: (index: number) => void, showFeedback: boolean }`
- Grid of clickable option cards
- States: Default, Selected, Correct (green), Incorrect (red)

**OpenAnswerInput**
- Location: `src/features/quizzes/components/OpenAnswerInput.tsx`
- Props: `{ value: string, onChange: (value: string) => void, onSubmit: () => void }`
- Text input with submit button

**QuestionFeedback**
- Location: `src/features/quizzes/components/QuestionFeedback.tsx`
- Props: `{ isCorrect: boolean, correctAnswer: string, selectedAnswer: string }`
- Shows after answer submission

**QuizAttemptActions**
- Location: `src/features/quizzes/components/QuizAttemptActions.tsx`
- Props: `{ onNext: () => void, onFinish: () => void, isLastQuestion: boolean, hasAnswered: boolean }`
- Button text changes: "Question suivante" → "Voir mon score 🏆" on last question

---

### 7. AI Chat Page `/chat`

**Route**: `/chat`  
**Purpose**: Chat with AI about selected course

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  ChatHeader                                      │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ [🎯 Sélectionner un cours ▼]           │     │
│  Sidebar │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  ChatMessagesContainer                           │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                                         │     │
│          │  │ [AI Message Bubble]                     │     │
│          │  │                                         │     │
│          │  │          [User Message Bubble]          │     │
│          │  │                                         │     │
│          │  │ [AI Message Bubble]                     │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
│          │  ChatInputArea                                   │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ [Type your message...]         [Send]  │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**ChatHeader**
- Location: `src/features/chat/components/ChatHeader.tsx`
- Props: `{ selectedCourse?: Course, onSelectCourse: (course: Course) => void }`

**CoursePicker**
- Location: `src/features/chat/components/CoursePicker.tsx`
- Props: `{ courses: Course[], selectedCourse?: Course, onSelect: (course: Course) => void }`
- Dropdown/select component

**ChatMessagesContainer**
- Location: `src/features/chat/components/ChatMessagesContainer.tsx`
- Props: `{ messages: Message[] }`
- Scrollable container

**MessageBubble**
- Location: `src/features/chat/components/MessageBubble.tsx`
- Props: `{ message: Message, isUser: boolean }`
- Styled bubble with alignment (left for AI, right for user)

**ChatInputArea**
- Location: `src/features/chat/components/ChatInputArea.tsx`
- Props: `{ onSend: (message: string) => void, disabled: boolean }`
- Text input + send button

---

### 8. Settings Page `/settings`

**Route**: `/settings/*`  
**Purpose**: User settings with sub-pages

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  ┌──────────┬──────────────────────────────┐     │
│          │  │          │                              │     │
│  Sidebar │  │ Settings │  <RouteOutlet: Settings     │     │
│          │  │ Sidebar  │   Content>                  │     │
│          │  │          │                              │     │
│          │  │ [Compte] │                              │     │
│          │  │ [Abonne  │                              │     │
│          │  │  ment]   │                              │     │
│          │  │ [Autre]  │                              │     │
│          │  │          │                              │     │
│          │  └──────────┴──────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**SettingsSidebar**
- Location: `src/features/settings/components/SettingsSidebar.tsx`
- Props: `{ activeSection: string }`
- Navigation links: "Compte" | "Abonnement" | "Autre"

---

### 8a. Account Settings `/settings/account`

**Route**: `/settings/account`  
**Purpose**: Manage account details and password

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  AccountSettingsContent                          │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ Mon compte                              │     │
│          │  │                                         │     │
│  Sidebar │  │ ┌───────────────────────────────┐      │     │
│  (with   │  │ │ Email: user@example.com      │      │     │
│  Settings│  │ │ [Modifier]                    │      │     │
│  Sidebar)│  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ Nom: John Doe                │      │     │
│          │  │ │ [Modifier]                    │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ Changer de mot de passe                │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [Ancien mot de passe]        │      │     │
│          │  │ │ [Nouveau mot de passe]       │      │     │
│          │  │ │ [Confirmer mot de passe]     │      │     │
│          │  │ │ [Changer le mot de passe]    │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**AccountSettingsContent**
- Location: `src/features/settings/components/AccountSettingsContent.tsx`
- Props: `{ user: User, onUpdateUser: (data) => void, onChangePassword: (data) => void }`

**AccountInfoCard**
- Location: `src/features/settings/components/AccountInfoCard.tsx`
- Props: `{ label: string, value: string, onEdit: () => void }`

**ChangePasswordForm**
- Location: `src/features/settings/components/ChangePasswordForm.tsx`
- Props: `{ onSubmit: (data: PasswordChangeData) => void }`

---

### 8b. Subscription Settings `/settings/subscription`

**Route**: `/settings/subscription`  
**Purpose**: Manage subscription plan

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  SubscriptionSettingsContent                     │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │ Mon abonnement                          │     │
│  Sidebar │  │                                         │     │
│  (with   │  │ ┌───────────────────────────────┐      │     │
│  Settings│  │ │ Plan actuel: Free            │      │     │
│  Sidebar)│  │ │ Limites: 3 cours, 3 quizz    │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ [⭐ Passer à Premium]                   │     │
│          │  │                                         │     │
│          │  │ Parrainage                              │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ Votre code: ABC123           │      │     │
│          │  │ │ Parrainages: 2               │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**SubscriptionSettingsContent**
- Location: `src/features/settings/components/SubscriptionSettingsContent.tsx`
- Props: `{ user: User, onUpgrade: () => void }`

**CurrentPlanCard**
- Location: `src/features/settings/components/CurrentPlanCard.tsx`
- Props: `{ plan: 'FREE' | 'PREMIUM', limits: PlanLimits }`

**UpgradeToPremiumButton**
- Location: `src/features/settings/components/UpgradeToPremiumButton.tsx`
- Props: `{ onClick: () => void }`

**ReferralCard**
- Location: `src/features/settings/components/ReferralCard.tsx`
- Props: `{ referralCode: string, referralCount: number }`

---

### 8c. Other Settings `/settings/other`

**Route**: `/settings/other`  
**Purpose**: Legal, support, and account actions

#### Page Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│          │  OtherSettingsContent                            │
│          │  ┌─────────────────────────────────────────┐     │
│          │  │                                         │     │
│  Sidebar │  │ ┌───────────────────────────────┐      │     │
│  (with   │  │ │ [📄 Conditions générales]    │      │     │
│  Settings│  │ └───────────────────────────────┘      │     │
│  Sidebar)│  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [🐛 Signaler un bug]         │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [✉️ Nous contacter]           │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [⭐ Laisser un avis]          │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ Actions dangereuses                     │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [🚪 Se déconnecter]          │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  │ ┌───────────────────────────────┐      │     │
│          │  │ │ [🗑️ Supprimer mon compte]    │      │     │
│          │  │ └───────────────────────────────┘      │     │
│          │  │                                         │     │
│          │  └─────────────────────────────────────────┘     │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Components

**OtherSettingsContent**
- Location: `src/features/settings/components/OtherSettingsContent.tsx`
- Props: `{ onLogout: () => void, onDeleteAccount: () => void }`

**SettingsActionButton**
- Location: `src/features/settings/components/SettingsActionButton.tsx`
- Props: `{ label: string, icon: ReactNode, onClick: () => void, variant?: 'default' | 'danger' }`

---

## Reusable Components Library

### Core UI Components

Located in: `src/components/ui/` (Shadcn components)

**Button**
- Variants: default, destructive, outline, ghost, link
- Sizes: sm, md, lg

**Card**
- Composed of: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

**Dialog**
- Modal overlay with content
- Used for: Create course, Create quiz, Confirm delete

**Popover**
- Floating content for: Kebab menus, tooltips

**Badge**
- Variants: default, secondary, destructive, outline
- Used for: Status indicators, counts

**Progress**
- Linear and circular variants
- Used for: Quiz progress, score displays

**Input**
- Text, email, password types
- Used throughout forms

**Select**
- Dropdown component
- Used for: Course selection, quiz parameters

**Tabs**
- Tab navigation component
- Used for: Course detail tabs

**Separator**
- Visual divider line

### Custom Components

Located in: `src/components/`

**SearchBar** (`SearchBar.tsx`)
- Props: `{ placeholder: string, value: string, onChange: (value: string) => void }`

**SectionHeader** (`SectionHeader.tsx`)
- Props: `{ title: string, count?: number, actionLabel?: string, onAction?: () => void }`

**PageHeader** (`PageHeader.tsx`)
- Props: `{ title: string, count?: number }`

**StatusBadge** (`StatusBadge.tsx`)
- Props: `{ status: 'PENDING' | 'GENERATED' | 'ERROR' }`

**StatCard** (`StatCard.tsx`)
- Props: `{ title: string, value: string | number, icon?: ReactNode }`

**MarkdownRenderer** (`MarkdownRenderer.tsx`)
- Props: `{ content: string }`

**LoadingSpinner** (`LoadingSpinner.tsx`)
- Props: `{ size?: 'sm' | 'md' | 'lg' }`

**EmptyState** (`EmptyState.tsx`)
- Props: `{ title: string, description: string, action?: { label: string, onClick: () => void } }`

### Layout Components

Located in: `src/features/layout/components/`

**AppLayout** (`AppLayout.tsx`)
- Props: `{ children: ReactNode }`
- Wrapper for all authenticated pages with sidebar

**AppSidebar** (`AppSidebar.tsx`)
- Props: `{ isCollapsed: boolean, onToggleCollapse: () => void }`
- Main navigation sidebar (expanded/collapsed states)

**SidebarHeader** (`SidebarHeader.tsx`)
- Props: `{ isCollapsed: boolean, onToggleCollapse: () => void }`
- Logo + collapse/expand button

**SidebarNavigation** (`SidebarNavigation.tsx`)
- Props: `{ isCollapsed: boolean }`
- Navigation items container

**SidebarNavItem** (`SidebarNavItem.tsx`)
- Props: `{ icon: ReactNode, label: string, href: string, isActive: boolean, isCollapsed: boolean }`
- Individual navigation item with active state

**SidebarFooter** (`SidebarFooter.tsx`)
- Props: `{ user: User, isCollapsed: boolean }`
- User profile section at bottom of sidebar

**UserProfileButton** (`UserProfileButton.tsx`)
- Props: `{ user: User, isCollapsed: boolean }`
- Trigger for user profile popover

**UserProfilePopover** (`UserProfilePopover.tsx`)
- Props: `{ onNavigateToAccount: () => void, onLogout: () => void }`
- Popover menu with "Mon Compte" and "Se déconnecter"

---

## Data Flow & State Management

### State Architecture

**Global State** (Context API / Zustand)
- `AuthContext`: Current user, login/logout
- `CoursesContext`: User's courses list
- `QuizzesContext`: User's quizzes list

**Local State** (React useState/useReducer)
- Form inputs
- UI state (modals, dropdowns)
- Component-specific data

### API Integration

**API Client** (`src/app/api.ts`)
- Axios instance with:
  - Base URL configuration
  - Auth token interceptor
  - Error handling interceptor

**API Hooks** (React Query / Custom hooks)
```typescript
// src/features/courses/hooks/useCourses.ts
export const useCourses = () => {
  // Fetch courses
  // Create course
  // Delete course
}

// src/features/quizzes/hooks/useQuizzes.ts
export const useQuizzes = (courseId?: string) => {
  // Fetch quizzes
  // Create quiz
  // Delete quiz
}

// src/features/quizzes/hooks/useQuizAttempt.ts
export const useQuizAttempt = (quizId: string) => {
  // Start attempt
  // Submit answer
  // Finish attempt
}
```

### Data Flow Example: Quiz Attempt

```
User clicks "Démarrer un quiz"
  ↓
StartTrainingButton onClick
  ↓
useQuizAttempt.startAttempt(quizId)
  ↓
POST /quizzes/:id/attempts → Backend creates attempt
  ↓
Navigate to /quizzes/:id/attempt
  ↓
QuizAttemptPage loads quiz data
  ↓
User answers questions → Local state updates
  ↓
User clicks "Question suivante" → Local state progresses
  ↓
User clicks "Voir mon score" → useQuizAttempt.submitAttempt(answers)
  ↓
POST /quizzes/:id/attempts/:attemptId/submit → Backend scores attempt
  ↓
Navigate to /quizzes/:id (results page)
```

---

## Implementation Checklist

### Phase 1: Core Layout & Navigation
- [ ] Setup React Router with routes
- [ ] Create AppLayout wrapper component
- [ ] Implement AppSidebar with expand/collapse functionality
- [ ] Create SidebarHeader (Logo + collapse button)
- [ ] Create SidebarNavigation with 4 nav items
- [ ] Implement SidebarNavItem with active state and tooltips
- [ ] Create SidebarFooter with user profile
- [ ] Implement UserProfileButton and UserProfilePopover
- [ ] Add localStorage persistence for sidebar collapse state
- [ ] Create base page layouts
- [ ] Setup Shadcn UI components

### Phase 2: Authentication Pages
- [ ] Login page
- [ ] Register page
- [ ] Auth context and hooks

### Phase 3: Home & Course List
- [ ] Home page with QuickActions
- [ ] CoursesSection component
- [ ] QuizzesSection component
- [ ] CourseCard and QuizCard components
- [ ] Course list page
- [ ] CourseListToolbar with search

### Phase 4: Course Detail & Tabs
- [ ] Course detail page layout
- [ ] CourseTabNavigation
- [ ] Summary tab with MarkdownRenderer
- [ ] Flashcards tab (list and study mode)
- [ ] Quiz summary tab
- [ ] Quiz results tab
- [ ] Quiz list tab

### Phase 5: Quiz Taking Flow
- [ ] Quiz attempt page
- [ ] QuizProgressBar
- [ ] QuestionDisplay (MCQ and OPEN)
- [ ] QuestionFeedback
- [ ] Quiz result page
- [ ] QuestionCorrectionCard

### Phase 6: All Quizzes & Grouping
- [ ] All quizzes page
- [ ] QuizzesGroupedByCourse component
- [ ] CourseQuizGroup component

### Phase 7: AI Chat
- [ ] Chat page layout
- [ ] CoursePicker
- [ ] ChatMessagesContainer
- [ ] MessageBubble
- [ ] ChatInputArea

### Phase 8: Settings
- [ ] Settings page layout with sidebar
- [ ] Account settings page
- [ ] Subscription settings page
- [ ] Other settings page
- [ ] All settings forms and actions

### Phase 9: Dialogs & Modals
- [ ] Create course dialog
- [ ] Create quiz dialog (multi-step)
- [ ] Edit summary dialog
- [ ] Delete confirmation dialogs
- [ ] Upgrade to premium dialog

### Phase 10: Polish & Responsiveness
- [ ] Mobile responsive layouts
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Animations and transitions
- [ ] Accessibility (ARIA labels, keyboard navigation)

---

## Component Dependency Graph

```
AppLayout
  ├── AppSidebar (persistent across all authenticated pages)
  │   ├── SidebarHeader
  │   ├── SidebarNavigation
  │   │   └── SidebarNavItem (×4: Accueil, Cours, Quizz, Chat)
  │   └── SidebarFooter
  │       └── UserProfileButton
  │           └── UserProfilePopover
  └── Page Content (children)

CourseCard
  └── Used by: CoursesSection, CourseGrid, CourseQuizGroup

QuizCard
  └── Used by: QuizzesSection, QuizListGrid, QuizzesGroupedByCourse

SectionHeader
  └── Used by: CoursesSection, QuizzesSection

PageHeader
  └── Used by: Course list page, All quizzes page

StatusBadge
  └── Used by: SummaryContent, CourseCard

MarkdownRenderer
  └── Used by: SummaryContent, QuestionCorrectionCard

QuizProgressBar
  └── Used by: QuizAttemptPage

ScoreCircle
  └── Used by: QuizResultPage, OverallPerformanceCard

QuestionDisplay
  ├── MCQAnswerOptions
  └── OpenAnswerInput
  └── Used by: QuizAttemptPage

QuestionCorrectionCard
  └── Used by: CorrectionSection

SettingsActionButton
  └── Used by: All settings pages
```

---

## Notes

- All components should be typed with TypeScript interfaces
- Use React Hook Form for form handling
- Use Zod for form validation
- Follow Shadcn UI patterns for consistency
- Implement responsive design (mobile-first)
- Add loading states for all async operations
- Add error boundaries for robustness
- Use semantic HTML for accessibility
- Follow ARIA best practices
- Implement keyboard navigation where appropriate

---

**End of UX Design Document**
