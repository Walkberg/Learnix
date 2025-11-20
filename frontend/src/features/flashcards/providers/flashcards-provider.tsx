import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
  // Stack navigation state
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  next: () => void;
  previous: () => void;
  goto: (i: number) => void;
  // Keyboard handler registration: components can register to receive next/previous requests
  registerKeyboardHandlers: (handlers: { onNext?: () => void; onPrev?: () => void } | null) => void;
  // Animated navigation state (managed by provider)
  anim: 'idle' | 'exit-right' | 'enter-right';
  animatedNext: () => void;
  animatedPrev: () => void;
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const keyboardHandlersRef = useRef<{ onNext?: () => void; onPrev?: () => void } | null>(null);
  const [anim, setAnim] = useState<'idle' | 'exit-right' | 'enter-right'>('idle');

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

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(0, flashcards.length - 1)));
  }, [flashcards.length]);

  const previous = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goto = useCallback(
    (i: number) => {
      setCurrentIndex(() => {
        if (i < 0) return 0;
        if (i >= flashcards.length) return Math.max(0, flashcards.length - 1);
        return i;
      });
    },
    [flashcards.length]
  );

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
          // Ensure currentIndex is valid when list changes
          setCurrentIndex((prev) => (data.length === 0 ? 0 : Math.min(prev, data.length - 1)));
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

  const ANIM_MS = 420;

  const animatedNext = useCallback(() => {
    if (currentIndex >= flashcards.length - 1) return;
    setAnim('exit-right');
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, Math.max(0, flashcards.length - 1)));
      setAnim('idle');
    }, ANIM_MS);
  }, [currentIndex, flashcards.length]);

  const animatedPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    requestAnimationFrame(() => setAnim('enter-right'));
    setTimeout(() => setAnim('idle'), ANIM_MS);
  }, [currentIndex]);

  // Global keyboard listener lives in the provider and delegates to registered handlers
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        if (keyboardHandlersRef.current?.onPrev) keyboardHandlersRef.current.onPrev();
        else animatedPrev();
      } else if (e.key === 'ArrowRight') {
        if (keyboardHandlersRef.current?.onNext) keyboardHandlersRef.current.onNext();
        else animatedNext();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [animatedNext, animatedPrev]);

  const value: FlashcardsContextValue = useMemo(
    () => ({
      flashcards,
      isLoading,
      error,
      refresh,
      createFlashcard,
      updateFlashcard,
      deleteFlashcard,
      currentIndex,
      setCurrentIndex,
      next,
      previous,
      goto,
      registerKeyboardHandlers: (handlers: { onNext?: () => void; onPrev?: () => void } | null) => {
        keyboardHandlersRef.current = handlers;
      },
      anim,
      animatedNext,
      animatedPrev,
    }),
    [
      flashcards,
      isLoading,
      error,
      refresh,
      createFlashcard,
      updateFlashcard,
      deleteFlashcard,
      currentIndex,
      next,
      previous,
      goto,
      anim,
      animatedNext,
      animatedPrev,
    ]
  );

  return <FlashcardsContext.Provider value={value}>{children}</FlashcardsContext.Provider>;
}

export function useFlashcards(): FlashcardsContextValue {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) throw new Error('useFlashcards must be used within FlashcardsProvider');
  return ctx;
}
