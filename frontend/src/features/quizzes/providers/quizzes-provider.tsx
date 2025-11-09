/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

type QuizzesContextValue = { _stub?: true };

const QuizzesContext = createContext<QuizzesContextValue | undefined>(undefined);

export function QuizzesProvider({ children }: { children: React.ReactNode }) {
  // TODO: implement state & API
  const value: QuizzesContextValue = {};
  return <QuizzesContext.Provider value={value}>{children}</QuizzesContext.Provider>;
}

export function useQuizzes() {
  const ctx = useContext(QuizzesContext);
  if (!ctx) throw new Error('useQuizzes must be used within QuizzesProvider');
  return ctx;
}
