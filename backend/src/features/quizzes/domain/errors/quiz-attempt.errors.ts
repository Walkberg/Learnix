export class InvalidAttemptAnswersError extends Error {
  constructor(message = 'Invalid quiz attempt answers') {
    super(message);
    this.name = 'InvalidAttemptAnswersError';
  }
}

export class QuizAttemptNotAllowedError extends Error {
  constructor() {
    super('You are not allowed to attempt this quiz');
    this.name = 'QuizAttemptNotAllowedError';
  }
}
