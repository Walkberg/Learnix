import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Quiz, QuizAttemptSummary } from '../types';
import { useQuizApi } from './quiz-api-provider';

type CourseStats = { averageScore: number; quizzesCompleted: number; totalQuizzes: number };

type CourseQuizzesProviderValue = {
  quizzes: Quiz[];
  stats: CourseStats | null;
  isLoading: boolean;
  error: Error | null;
  refresh: (courseId: string) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  startAttempt: (quizId: string) => Promise<QuizAttemptSummary>;
};

const CourseQuizzesContext = createContext<CourseQuizzesProviderValue | undefined>(undefined);

export function CourseQuizzesProvider({
  children,
  courseId,
}: {
  children: ReactNode;
  courseId: string;
}) {
  const quizApi = useQuizApi();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const list = await quizApi.listQuizzesByCourse(courseId);

      console.log(computeStats(list));
      setQuizzes(list);
      setStats(computeStats(list));
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const deleteQuiz = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await quizApi.deleteQuiz(id);
      setQuizzes((prev) => {
        const next = prev.filter((q) => q.id !== id);
        setStats(computeStats(next));
        return next;
      });
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startAttempt = useCallback(async (quizId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const summary = await quizApi.startAttempt(quizId, []);
      setQuizzes((prev) => {
        const next = prev.map((q) => (q.id === quizId ? { ...q, lastAttemptSummary: summary } : q));
        setStats(computeStats(next));
        return next;
      });
      return summary;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!courseId) return;
    void refresh();
  }, [courseId]);

  return (
    <CourseQuizzesContext.Provider
      value={{
        quizzes,
        stats,
        isLoading,
        error,
        refresh,
        deleteQuiz,
        startAttempt,
      }}
    >
      {children}
    </CourseQuizzesContext.Provider>
  );
}

export function useCourseQuizzes() {
  const ctx = useContext(CourseQuizzesContext);
  if (!ctx) throw new Error('useCourseQuizzes must be used within CourseQuizzesProvider');
  return ctx;
}

function computeStats(list: Quiz[]): CourseStats {
  const totalQuizzes = list.length;
  const completed = list.filter((q) => q.lastAttemptSummary ?? false);
  const quizzesCompleted = completed.length;
  const averageScore =
    quizzesCompleted === 0
      ? 0
      : Math.round(
          completed.reduce((acc, q) => acc + (q.lastAttemptSummary?.score ?? 0), 0) /
            quizzesCompleted
        );
  return { averageScore, quizzesCompleted, totalQuizzes };
}
