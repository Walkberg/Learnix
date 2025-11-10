import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { HttpQuizApi } from '../api/quiz-api.http';
import type { QuizApi } from '../api/quiz-api.interface';

interface QuizApiContextValue {
  quizApi: QuizApi;
}

const QuizApiContext = createContext<QuizApiContextValue | undefined>(undefined);

export const QuizApiProvider = ({ children }: { children: ReactNode }) => {
  // Single instance memoized for app lifetime
  const quizApi: QuizApi = useMemo(() => new HttpQuizApi(), []);
  return <QuizApiContext.Provider value={{ quizApi }}>{children}</QuizApiContext.Provider>;
};

export const useQuizApi = (): QuizApi => {
  const ctx = useContext(QuizApiContext);
  if (!ctx) throw new Error('useQuizApi must be used within QuizApiProvider');
  return ctx.quizApi;
};
