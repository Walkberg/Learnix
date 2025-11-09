// Quiz types
export type QuestionType = 'MCQ' | 'OPEN';

export interface MCQQuestion {
  id: string;
  type: 'MCQ';
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

export interface OpenQuestion {
  id: string;
  type: 'OPEN';
  question: string;
  correctAnswer: string;
  explanation: string;
}

export type Question = MCQQuestion | OpenQuestion;

export interface Quiz {
  id: string;
  courseId: string;
  params: {
    count: number;
    types: QuestionType[];
  };
  questions: Question[];
  createdAt: string;
  lastAttemptSummary?: AttemptSummary;
}

export interface AttemptSummary {
  id: string;
  score: number;
  submittedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { questionId: string; answer: string | number }[];
  score: number;
  submittedAt: string;
}
