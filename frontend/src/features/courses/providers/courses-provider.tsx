import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { HttpCourseApi } from '../api/course-api.http';
import type { CourseApi } from '../api/course-api.interface';
import type { Course } from '../types';

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

  const courseApi: CourseApi = useMemo(() => new HttpCourseApi(), []);

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
  }, []);

  const createCourse = useCallback(async (input: { title: string; emoji?: string }) => {
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
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      await courseApi.deleteCourse(id);
    } catch (e) {
    } finally {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

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
