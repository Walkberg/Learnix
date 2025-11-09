/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

type FlashcardsContextValue = { _stub?: true };

const FlashcardsContext = createContext<FlashcardsContextValue | undefined>(undefined);

export function FlashcardsProvider({ children }: { children: React.ReactNode }) {
  const value: FlashcardsContextValue = {};
  return <FlashcardsContext.Provider value={value}>{children}</FlashcardsContext.Provider>;
}

export function useFlashcards() {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) throw new Error('useFlashcards must be used within FlashcardsProvider');
  return ctx;
}
