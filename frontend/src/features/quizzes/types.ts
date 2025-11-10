export interface QuizCreateFormData {
  courseId?: string;
  exerciseType?: 'MCQ' | 'OPEN' | 'FILL_BLANK';
  answerCount?: 'duo' | 'trio' | 'square';
}

export interface QuizCreateState {
  isOpen: boolean;
  currentStep: 1 | 2;
  formData: QuizCreateFormData;
}
// Consolidated quiz model types (single declarations only)
export interface QuizAttemptSummary {
  score: number;
  totalQuestions: number;
  attemptedAt: string; // ISO date
}

export interface QuizQuestionMCQ {
  id: string;
  type: 'MCQ';
  question: string;
  options: string[]; // length 4
  correctAnswer: number; // 0..3
  explanation: string;
}

export interface QuizQuestionOpen {
  id: string;
  type: 'OPEN';
  question: string;
  correctAnswer: string;
  explanation: string;
}

export type QuizQuestion = QuizQuestionMCQ | QuizQuestionOpen;

export interface QuizParams {
  count: number;
  types: ('MCQ' | 'OPEN')[];
}

export interface Quiz {
  id: string;
  courseId: string;
  createdAt: string;
  params?: QuizParams; // optional if list endpoint omits
  questions?: QuizQuestion[]; // optional unless detailed fetch
  lastAttemptSummary?: QuizAttemptSummary;
}

export interface GenerateQuizInput {
  courseId: string;
  count: number;
  type: 'MCQ' | 'OPEN';
}
