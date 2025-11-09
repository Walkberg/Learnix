import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface Flashcard {
  id: string;
  courseId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface FlashcardsContextValue {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: Error | null;
  refresh: (courseId: string) => Promise<void>;
  create: (courseId: string, input: { question: string; answer: string }) => Promise<Flashcard>;
  update: (
    id: string,
    input: Partial<Pick<Flashcard, 'question' | 'answer'>>
  ) => Promise<Flashcard>;
  remove: (id: string) => Promise<void>;
}

const stub: FlashcardsContextValue = {
  flashcards: [],
  isLoading: false,
  error: null,
  async refresh(courseId: string) {
    void courseId;
  },
  async create(courseId, input) {
    return {
      id: 'stub',
      courseId,
      question: input.question,
      answer: input.answer,
      createdAt: new Date().toISOString(),
    };
  },
  async update(id, input) {
    return {
      id,
      courseId: 'stub-course',
      question: input.question ?? 'Q? (stub)',
      answer: input.answer ?? 'A (stub)',
      createdAt: new Date().toISOString(),
    };
  },
  async remove(id: string) {
    void id;
  },
};

const FlashcardsContext = createContext<FlashcardsContextValue | undefined>(undefined);

export function FlashcardsProvider({ children }: { children: ReactNode }) {
  return <FlashcardsContext.Provider value={stub}>{children}</FlashcardsContext.Provider>;
}

export function useFlashcards(): FlashcardsContextValue {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) throw new Error('useFlashcards must be used within FlashcardsProvider');
  return ctx;
}
