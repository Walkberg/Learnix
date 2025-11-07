export class QuizError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class QuizQuotaExceededError extends QuizError {
  constructor(message = 'Quiz quota exceeded for this user') {
    super(message);
  }
}

export class InvalidQuestionsCountError extends QuizError {
  constructor(message = 'Invalid questions count provided') {
    super(message);
  }
}

export class QuizNotFoundError extends QuizError {
  constructor(quizId: string) {
    super(`Quiz with id ${quizId} not found`);
  }
}

export class NotQuizOwnerError extends QuizError {
  constructor(message = 'You are not authorized to access this quiz') {
    super(message);
  }
}
