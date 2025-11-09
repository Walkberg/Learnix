/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

type CoursesContextValue = { _stub?: true };

const CoursesContext = createContext<CoursesContextValue | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  // TODO: implement state & API
  const value: CoursesContextValue = {};
  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
}
