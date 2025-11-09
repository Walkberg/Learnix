import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// Domain models (align with backend Quiz & Attempt DTOs)
export interface QuizAttemptSummary {
  score: number;
  totalQuestions: number;
  attemptedAt: string; // ISO date string
}

export interface Quiz {
  id: string;
  courseId: string;
  courseTitle?: string; // convenience for UI list
  lastAttemptSummary?: QuizAttemptSummary;
  createdAt: string;
}

export interface QuizzesContextValue {
  quizzes: Quiz[];
  isLoading: boolean;
  error: Error | null;
  refresh: (courseId?: string) => Promise<void>;
  generate: (courseId: string, params: { count: number }) => Promise<Quiz>;
  deleteQuiz: (id: string) => Promise<void>;
  startAttempt: (quizId: string) => Promise<QuizAttemptSummary>; // Future: returns attempt id
}

const stub: QuizzesContextValue = {
  quizzes: [],
  isLoading: false,
  error: null,
  async refresh(courseId?: string) {
    void courseId;
  },
  async generate(courseId, _params) {
    return {
      id: 'stub-quiz',
      courseId,
      createdAt: new Date().toISOString(),
      lastAttemptSummary: undefined,
    };
  },
  async deleteQuiz(id: string) {
    void id;
  },
  async startAttempt(quizId: string) {
    void quizId;
    return {
      score: 0,
      totalQuestions: 0,
      attemptedAt: new Date().toISOString(),
    };
  },
};

const QuizzesContext = createContext<QuizzesContextValue | undefined>(undefined);

export function QuizzesProvider({ children }: { children: ReactNode }) {
  return <QuizzesContext.Provider value={stub}>{children}</QuizzesContext.Provider>;
}

export function useQuizzes(): QuizzesContextValue {
  const ctx = useContext(QuizzesContext);
  if (!ctx) throw new Error('useQuizzes must be used within QuizzesProvider');
  return ctx;
}
