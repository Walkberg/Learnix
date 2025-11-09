import React, { createContext, useContext } from 'react';

// Domain model (adjust as backend DTOs evolve)
export interface Course {
  id: string;
  title: string;
  emoji?: string;
  createdAt: string; // ISO string
}

// Public API surface for the courses context
export interface CoursesContextValue {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createCourse: (input: { title: string; emoji?: string }) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
}

// Internal stub (temporary – will be replaced by real implementation & state management)
const stub: CoursesContextValue = {
  courses: [],
  isLoading: false,
  error: null,
  async refresh() {
    // TODO: implement fetch from API
  },
  async createCourse(input) {
    // TODO: call POST /courses
    return {
      id: 'stub',
      title: input.title,
      emoji: input.emoji,
      createdAt: new Date().toISOString(),
    };
  },
  async deleteCourse(id: string) {
    // TODO: call DELETE /courses/:id
    void id;
  },
};

// Context with undefined default to enforce provider usage
const CoursesContext = createContext<CoursesContextValue | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  // TODO: replace stub with actual state, e.g. useState + useEffect + API integration (React Query / custom fetch)
  // For now we expose the stubbed value so components can start wiring.
  return <CoursesContext.Provider value={stub}>{children}</CoursesContext.Provider>;
}

export function useCourses(): CoursesContextValue {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
}

// Future extension notes:
// - Replace stub with a reducer to handle optimistic updates (create/delete)
// - Integrate error + retry logic
// - Consider pagination once course count grows
// - Memoize context value to avoid unnecessary rerenders
