# data-model.md

This document describes the domain entities and their fields, validation rules and relationships. It maps to the Prisma schema to be implemented under `backend/prisma/schema.prisma`.

## Clarifications

### Session 2025-11-06
- Q: Should StudySheet content be stored as structured JSON or Markdown? → A: Store as Markdown with defined sections for better formatting and readability
- Q: How should summary/flashcard generation be handled after course creation? → A: Use domain events (CourseCreatedEvent) with message queue for async generation
- Q: Which AI provider should be used by default? → A: Gemini as the default AI provider

## Entities

### User
- id: string (cuid)
- displayName: string (required)
- email: string (required, unique)
- passwordHash: string (required)
- role: enum (FREE, PREMIUM)
- createdAt: DateTime

Validation rules:
- email must be a valid email
- password hashed, never stored raw

### Course
- id: string (cuid)
- authorId: string -> User
- title: string (required)
- emoji: string (optional, single emoji)
- sourceText: string (required)
- createdAt: DateTime

Business rules:
- Free users: max 3 courses

### StudySheet (Summary)
- id: string (cuid)
- courseId: string -> Course
- content: string (markdown formatted)
- status: enum (PENDING, GENERATED, ERROR)
- createdAt: DateTime
- updatedAt: DateTime

Validation rules:
- content must be valid markdown with sections:
  - Title (H1)
  - Summary (2-3 paragraphs)
  - Key Points (3-10 bullet points)
- status tracks async generation state

### Quiz
- id: string (cuid)
- courseId: string -> Course
- generatedFromSummaryId?: string -> StudySheet
- params: {count: number, types: string[]} (store as JSON)
- questions: Question[] (store as JSON for flexibility)
- createdAt: DateTime

### Question (part of Quiz.questions)
Discriminated union stored as JSON:
1. MCQQuestion
  - id: string
  - type: 'MCQ'
  - question: string
  - options: string[4]
  - correctAnswer: number (0-3 index)
  - explanation: string (short justification)
2. OpenQuestion
  - id: string
  - type: 'OPEN'
  - question: string
  - correctAnswer: string (expected concise answer)
  - explanation: string (short reasoning / context)

### QuizAttempt
- id: string (cuid)
- quizId: string -> Quiz
- userId: string -> User
- answers: {questionId:string, answer:string}[] (JSON)
- score: int
- submittedAt: DateTime

### Flashcard
- id: string (cuid)
- courseId: string -> Course
- question: string
- answer: string
- createdAt: DateTime

## Prisma sketch (to be synchronized to `schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  displayName  String
  email        String   @unique
  passwordHash String
  role         UserRole @default(FREE)
  createdAt    DateTime @default(now())
  courses      Course[]
}

enum UserRole {
  FREE
  PREMIUM
}

model Course {
  id         String      @id @default(cuid())
  author     User        @relation(fields: [authorId], references: [id])
  authorId   String
  title      String
  emoji      String?
  sourceText String
  createdAt  DateTime    @default(now())
  summaries  StudySheet[]
  quizzes    Quiz[]
  flashcards Flashcard[]
}

enum GenerationStatus {
  PENDING
  GENERATED
  ERROR
}

model StudySheet {
  id        String   @id @default(cuid())
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  content   String   @db.Text
  status    GenerationStatus @default(PENDING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Quiz {
  id            String   @id @default(cuid())
  course        Course   @relation(fields: [courseId], references: [id])
  courseId      String
  generatedFrom String?  
  params         Json
  questions      Json
  createdAt     DateTime @default(now())
}

model QuizAttempt {
  id         String   @id @default(cuid())
  quizId     String
  userId     String
  answers    Json
  score      Int
  submittedAt DateTime @default(now())
}

model Flashcard {
  id        String   @id @default(cuid())
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  question  String
  answer    String
  createdAt DateTime @default(now())
}
```

Notes:
- Use Json fields to allow flexible question structures and params. If strict querying needed later, normalize into relational tables.
- Add indexes on `authorId`, `courseId` for performance.
