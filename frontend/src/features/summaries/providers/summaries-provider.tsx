import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface Summary {
  id: string;
  courseId: string;
  status: 'PENDING' | 'GENERATED' | 'ERROR';
  markdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface SummariesContextValue {
  summaries: Summary[];
  isLoading: boolean;
  error: Error | null;
  refresh: (courseId: string) => Promise<void>;
  regenerate: (summaryId: string) => Promise<Summary>;
  edit: (summaryId: string, markdown: string) => Promise<Summary>;
}

const stub: SummariesContextValue = {
  summaries: [],
  isLoading: false,
  error: null,
  async refresh(courseId: string) {
    void courseId;
  },
  async regenerate(summaryId: string) {
    return {
      id: summaryId,
      courseId: 'stub-course',
      status: 'GENERATED',
      markdown: '# Résumé (stub)\nContenu généré...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  async edit(summaryId: string, markdown: string) {
    return {
      id: summaryId,
      courseId: 'stub-course',
      status: 'GENERATED',
      markdown,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

const SummariesContext = createContext<SummariesContextValue | undefined>(undefined);

export function SummariesProvider({ children }: { children: ReactNode }) {
  return <SummariesContext.Provider value={stub}>{children}</SummariesContext.Provider>;
}

export function useSummaries(): SummariesContextValue {
  const ctx = useContext(SummariesContext);
  if (!ctx) throw new Error('useSummaries must be used within SummariesProvider');
  return ctx;
}
