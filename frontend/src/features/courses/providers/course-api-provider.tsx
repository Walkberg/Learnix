import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { HttpCourseApi } from '../api/course-api.http';
import type { CourseApi } from '../api/course-api.interface';

interface CourseApiContextValue {
  courseApi: CourseApi;
}

const CourseApiContext = createContext<CourseApiContextValue | undefined>(undefined);

export const CourseApiProvider = ({ children }: { children: ReactNode }) => {
  const courseApi: CourseApi = useMemo(() => new HttpCourseApi(), []);
  return <CourseApiContext.Provider value={{ courseApi }}>{children}</CourseApiContext.Provider>;
};

export const useCourseApi = (): CourseApi => {
  const ctx = useContext(CourseApiContext);
  if (!ctx) throw new Error('useCourseApi must be used within CourseApiProvider');
  return ctx.courseApi;
};
