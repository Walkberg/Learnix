import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { Course, CourseDetail } from '../types';
import { useCourseApi } from './course-api-provider';

// Legacy inline Course interface removed; now imported from ../types

export interface CoursesContextValue {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createCourse: (input: { title: string; emoji?: string }) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
}

const CoursesContext = createContext<CoursesContextValue | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const courseApi = useCourseApi();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await courseApi.listMyCourses();
      setCourses(list);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [courseApi]);

  const createCourse = useCallback(
    async (input: { title: string; emoji?: string }) => {
      try {
        const course = await courseApi.createCourse({
          title: input.title,
          sourceText: '',
          emoji: input.emoji,
        });
        setCourses((prev) => [course, ...prev]);
        return course;
      } catch (e) {
        throw e;
      }
    },
    [courseApi]
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      try {
        await courseApi.deleteCourse(id);
      } catch (e) {
      } finally {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    },
    [courseApi]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value: CoursesContextValue = useMemo(
    () => ({ courses, isLoading, error, refresh, createCourse, deleteCourse }),
    [courses, isLoading, error, refresh, createCourse, deleteCourse]
  );

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export function useCourses(): CoursesContextValue {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
}

// Hook for fetching individual course detail
export function useCourseDetail(courseId: string) {
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const courseApi = useCourseApi();

  useEffect(() => {
    let isMounted = true;

    async function fetchCourseDetail() {
      if (!courseId) return;

      setIsLoading(true);
      setError(null);
      try {
        const detail = await courseApi.getCourseDetail(courseId);
        if (isMounted) {
          setCourseDetail(detail);
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

    void fetchCourseDetail();

    return () => {
      isMounted = false;
    };
  }, [courseId, courseApi]);

  return { courseDetail, isLoading, error };
}
