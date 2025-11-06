import { Flashcard } from '../entities/flashcard.entity';

export interface IFlashcardRepository {
  createMany(flashcards: Flashcard[]): Promise<void>;
}
