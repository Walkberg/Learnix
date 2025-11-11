import type { Flashcard, CreateFlashcardInput, UpdateFlashcardInput } from '../types';

export interface FlashcardApi {
  /**
   * Get all flashcards for a specific course
   */
  getFlashcardsByCourse(courseId: string): Promise<Flashcard[]>;

  /**
   * Create a new flashcard for a course
   */
  createFlashcard(courseId: string, input: CreateFlashcardInput): Promise<Flashcard>;

  /**
   * Update an existing flashcard
   */
  updateFlashcard(flashcardId: string, input: UpdateFlashcardInput): Promise<Flashcard>;

  /**
   * Delete a flashcard
   */
  deleteFlashcard(courseId: string, flashcardId: string): Promise<void>;
}
