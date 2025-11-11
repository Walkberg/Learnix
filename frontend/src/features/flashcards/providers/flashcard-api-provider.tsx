import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { FlashcardApi } from '../api/flashcard-api.interface';
import { HttpFlashcardApi } from '../api/flashcard-api.http';

const FlashcardApiContext = createContext<FlashcardApi | undefined>(undefined);

export function FlashcardApiProvider({ children }: { children: ReactNode }) {
  const flashcardApi = useMemo(() => new HttpFlashcardApi(), []);

  return (
    <FlashcardApiContext.Provider value={flashcardApi}>{children}</FlashcardApiContext.Provider>
  );
}

export function useFlashcardApi(): FlashcardApi {
  const context = useContext(FlashcardApiContext);
  if (!context) {
    throw new Error('useFlashcardApi must be used within FlashcardApiProvider');
  }
  return context;
}
