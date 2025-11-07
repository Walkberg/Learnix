import { Flashcard } from '../entities/flashcard.entity';

export interface IFlashcardRepository {
  createMany(flashcards: Flashcard[]): Promise<void>;
  findByCourseId(courseId: string): Promise<Flashcard[]>;
  findById(id: string): Promise<Flashcard | null>;
  deleteById(id: string): Promise<number>; // return deleted count
  updateById(id: string, data: Partial<Flashcard>): Promise<number>; // return updated count
}
