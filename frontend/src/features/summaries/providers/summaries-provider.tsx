/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

type SummariesContextValue = { _stub?: true };

const SummariesContext = createContext<SummariesContextValue | undefined>(undefined);

export function SummariesProvider({ children }: { children: React.ReactNode }) {
  const value: SummariesContextValue = {};
  return <SummariesContext.Provider value={value}>{children}</SummariesContext.Provider>;
}

export function useSummaries() {
  const ctx = useContext(SummariesContext);
  if (!ctx) throw new Error('useSummaries must be used within SummariesProvider');
  return ctx;
}
