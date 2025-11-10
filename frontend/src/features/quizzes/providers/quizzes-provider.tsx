import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Quiz, QuizAttemptSummary } from '../types';
import { useQuizApi } from './quiz-api-provider';

export interface QuizzesContextValue {
  quizzes: Quiz[];
  isLoading: boolean;
  error: Error | null;
  refresh: (courseId?: string) => Promise<void>;
  generate: (courseId: string, params: { count: number }) => Promise<Quiz>;
  deleteQuiz: (id: string) => Promise<void>;
  startAttempt: (quizId: string) => Promise<QuizAttemptSummary>; // Future: returns attempt id
}

export function QuizzesProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const quizApi = useQuizApi();

  const refresh = useCallback(
    async (courseId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const list = courseId
          ? await quizApi.listQuizzesByCourse(courseId)
          : await quizApi.listQuizzes();
        setQuizzes(list);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [quizApi]
  );

  const generate = useCallback(
    async (courseId: string, params: { count: number }) => {
      const quiz = await quizApi.generate(courseId, { count: params.count, type: 'MCQ' });
      setQuizzes((prev) => [quiz, ...prev]);
      return quiz;
    },
    [quizApi]
  );

  const deleteQuiz = useCallback(
    async (id: string) => {
      try {
        await quizApi.deleteQuiz(id);
      } finally {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
      }
    },
    [quizApi]
  );

  const startAttempt = useCallback(
    async (quizId: string) => {
      const summary = await quizApi.startAttempt(quizId, []);
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quizId ? { ...q, lastAttemptSummary: summary } : q))
      );
      return summary;
    },
    [quizApi]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value: QuizzesContextValue = useMemo(
    () => ({ quizzes, isLoading, error, refresh, generate, deleteQuiz, startAttempt }),
    [quizzes, isLoading, error, refresh, generate, deleteQuiz, startAttempt]
  );

  return <QuizzesContext.Provider value={value}>{children}</QuizzesContext.Provider>;
}

const QuizzesContext = createContext<QuizzesContextValue | undefined>(undefined);

export function useQuizzes(): QuizzesContextValue {
  const ctx = useContext(QuizzesContext);
  if (!ctx) throw new Error('useQuizzes must be used within QuizzesProvider');
  return ctx;
}
