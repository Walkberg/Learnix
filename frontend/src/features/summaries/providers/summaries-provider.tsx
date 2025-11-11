import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CourseSummary } from '@/features/courses/types';
import { useCourseApi } from '@/features/courses/providers/course-api-provider';

export interface Summary {
  id: string;
  courseId: string;
  status: 'PENDING' | 'GENERATED' | 'ERROR';
  markdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface SummariesContextValue {
  summaries: CourseSummary[];
  isLoading: boolean;
  error: Error | null;
  refresh: (courseId: string) => Promise<void>;
}

const SummariesContext = createContext<SummariesContextValue | undefined>(undefined);

interface SummariesProviderProps {
  courseId: string;
  children: ReactNode;
}

export function SummariesProvider({ courseId, children }: SummariesProviderProps) {
  const [summaries, setSummaries] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const courseApi = useCourseApi();

  const refresh = async (refreshCourseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseApi.getCourseSummaries(refreshCourseId);
      setSummaries(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchSummaries() {
      if (!courseId) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await courseApi.getCourseSummaries(courseId);
        if (isMounted) {
          setSummaries(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchSummaries();

    return () => {
      isMounted = false;
    };
  }, [courseId, courseApi]);

  const value: SummariesContextValue = useMemo(
    () => ({ summaries, isLoading, error, refresh }),
    [summaries, isLoading, error]
  );

  return <SummariesContext.Provider value={value}>{children}</SummariesContext.Provider>;
}

export function useSummaries(): SummariesContextValue {
  const ctx = useContext(SummariesContext);
  if (!ctx) throw new Error('useSummaries must be used within SummariesProvider');
  return ctx;
}
