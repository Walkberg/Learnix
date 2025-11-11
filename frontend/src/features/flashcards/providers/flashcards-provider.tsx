import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Flashcard, CreateFlashcardInput, UpdateFlashcardInput } from '../types';
import { useFlashcardApi } from './flashcard-api-provider';

export interface FlashcardsContextValue {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createFlashcard: (input: CreateFlashcardInput) => Promise<Flashcard>;
  updateFlashcard: (flashcardId: string, input: UpdateFlashcardInput) => Promise<Flashcard>;
  deleteFlashcard: (flashcardId: string) => Promise<void>;
}

const FlashcardsContext = createContext<FlashcardsContextValue | undefined>(undefined);

interface FlashcardsProviderProps {
  courseId: string;
  children: ReactNode;
}

export function FlashcardsProvider({ courseId, children }: FlashcardsProviderProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const flashcardApi = useFlashcardApi();

  const refresh = useCallback(async () => {
    if (!courseId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await flashcardApi.getFlashcardsByCourse(courseId);
      setFlashcards(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, flashcardApi]);

  const createFlashcard = useCallback(
    async (input: CreateFlashcardInput) => {
      try {
        const flashcard = await flashcardApi.createFlashcard(courseId, input);
        setFlashcards((prev) => [...prev, flashcard]);
        return flashcard;
      } catch (e) {
        throw e;
      }
    },
    [courseId, flashcardApi]
  );

  const updateFlashcard = useCallback(
    async (flashcardId: string, input: UpdateFlashcardInput) => {
      try {
        const updated = await flashcardApi.updateFlashcard(flashcardId, input);
        setFlashcards((prev) => prev.map((f) => (f.id === flashcardId ? { ...f, ...updated } : f)));
        return updated;
      } catch (e) {
        throw e;
      }
    },
    [flashcardApi]
  );

  const deleteFlashcard = useCallback(
    async (flashcardId: string) => {
      try {
        await flashcardApi.deleteFlashcard(courseId, flashcardId);
        setFlashcards((prev) => prev.filter((f) => f.id !== flashcardId));
      } catch (e) {
        throw e;
      }
    },
    [courseId, flashcardApi]
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchFlashcards() {
      if (!courseId) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await flashcardApi.getFlashcardsByCourse(courseId);
        if (isMounted) {
          setFlashcards(data);
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

    void fetchFlashcards();

    return () => {
      isMounted = false;
    };
  }, [courseId, flashcardApi]);

  const value: FlashcardsContextValue = useMemo(
    () => ({
      flashcards,
      isLoading,
      error,
      refresh,
      createFlashcard,
      updateFlashcard,
      deleteFlashcard,
    }),
    [flashcards, isLoading, error, refresh, createFlashcard, updateFlashcard, deleteFlashcard]
  );

  return <FlashcardsContext.Provider value={value}>{children}</FlashcardsContext.Provider>;
}

export function useFlashcards(): FlashcardsContextValue {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) throw new Error('useFlashcards must be used within FlashcardsProvider');
  return ctx;
}
