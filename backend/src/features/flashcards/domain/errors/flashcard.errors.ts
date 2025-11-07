export class FlashcardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFlashcardOwnerError extends FlashcardError {
  constructor(message = 'You are not authorized to modify this flashcard') {
    super(message);
  }
}

export class FlashcardNotFoundError extends FlashcardError {
  constructor(flashcardId: string) {
    super(`Flashcard with id ${flashcardId} not found`);
  }
}
