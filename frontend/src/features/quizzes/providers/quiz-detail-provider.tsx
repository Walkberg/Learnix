import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import api from '@/app/api';
import type { Quiz, QuizAttemptSummary } from '../types';
import { set } from 'zod';

export interface QuizDetailContextValue {
  quiz: Quiz | null;
  lastAttempt: QuizAttemptSummary | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  setSummary: (summary: QuizAttemptSummary) => void;
}

const QuizDetailContext = createContext<QuizDetailContextValue | undefined>(undefined);

export function QuizDetailProvider({ quizId, children }: { quizId: string; children: ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [lastAttempt, setLastAttempt] = useState<QuizAttemptSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      const data = res.data as any;
      const model: Quiz = {
        id: data.id,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        courseEmoji: data.courseEmoji,
        createdAt: data.createdAt,
        params: data.params,
        questions: data.questions,
        lastAttemptSummary: data.lastAttemptSummary,
      };
      setQuiz(model);
      setLastAttempt(data.lastAttemptSummary ?? null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    void fetchQuiz();
  }, [fetchQuiz]);

  const refresh = useCallback(async () => {
    await fetchQuiz();
  }, [fetchQuiz]);

  function setSummary(summary: QuizAttemptSummary) {
    setQuiz((q) => {
      if (!q) return q;
      return { ...q, lastAttemptSummary: summary };
    });
    setLastAttempt(summary);
  }

  const value = useMemo(
    () => ({ quiz, lastAttempt, isLoading, error, refresh, setSummary }),
    [quiz, lastAttempt, isLoading, error, refresh]
  );

  return <QuizDetailContext.Provider value={value}>{children}</QuizDetailContext.Provider>;
}

export function useQuizDetail(): QuizDetailContextValue {
  const ctx = useContext(QuizDetailContext);
  if (!ctx) throw new Error('useQuizDetail must be used within QuizDetailProvider');
  return ctx;
}

export default QuizDetailProvider;
