// Flashcard types
export interface Flashcard {
  id: string;
  courseId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface CreateFlashcardInput {
  question: string;
  answer: string;
}

export interface UpdateFlashcardInput {
  question?: string;
  answer?: string;
}
