import type { Quiz, QuizQuestion } from './quiz.entity';
import { InvalidAttemptAnswersError } from './errors/quiz-attempt.errors';

export interface AttemptAnswer {
  questionId: string;
  answer: number | string;
}

export interface LastAttemptSummary {
  attemptId: string;
  score: number;
  submittedAt: Date;
}

export class QuizAttempt {
  constructor(
    public readonly id: string,
    public readonly quizId: string,
    public readonly userId: string,
    public readonly answers: AttemptAnswer[],
    public readonly score: number,
    public readonly submittedAt: Date = new Date(),
  ) {}

  static create(params: {
    id?: string;
    quizId: string;
    userId: string;
    answers: AttemptAnswer[];
    quiz: Quiz;
  }): QuizAttempt {
    const attempt = new QuizAttempt(
      params.id || crypto.randomUUID(),
      params.quizId,
      params.userId,
      params.answers,
      0,
    );
    attempt.validateAnswers(params.quiz);
    const score = attempt.computeScore(params.quiz);
    return new QuizAttempt(
      attempt.id,
      attempt.quizId,
      attempt.userId,
      attempt.answers,
      score,
      attempt.submittedAt,
    );
  }

  validateAnswers(quiz: Quiz): void {
    if (
      !Array.isArray(this.answers) ||
      this.answers.length !== quiz.questions.length
    ) {
      throw new InvalidAttemptAnswersError(
        `Expected ${quiz.questions.length} answers, got ${this.answers.length}`,
      );
    }

    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

    this.answers.forEach((attemptAnswer) => {
      const question = questionMap.get(attemptAnswer.questionId);
      if (!question) {
        throw new InvalidAttemptAnswersError(
          `Question with id ${attemptAnswer.questionId} not found in quiz`,
        );
      }

      if (question.type === 'MCQ') {
        if (
          typeof attemptAnswer.answer !== 'number' ||
          attemptAnswer.answer < 0 ||
          attemptAnswer.answer > 3
        ) {
          throw new InvalidAttemptAnswersError(
            `Invalid MCQ answer for question ${attemptAnswer.questionId}: must be a number between 0 and 3`,
          );
        }
      } else {
        if (
          typeof attemptAnswer.answer !== 'string' ||
          attemptAnswer.answer.trim().length === 0
        ) {
          throw new InvalidAttemptAnswersError(
            `Invalid OPEN answer for question ${attemptAnswer.questionId}: must be a non-empty string`,
          );
        }
      }
    });
  }

  computeScore(quiz: Quiz): number {
    let score = 0;
    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

    this.answers.forEach((attemptAnswer) => {
      const question = questionMap.get(attemptAnswer.questionId);
      if (!question) return;

      if (question.type === 'MCQ') {
        if (attemptAnswer.answer === question.correctAnswer) {
          score += 1;
        }
      } else {
        const givenAnswer = (attemptAnswer.answer as string)
          .trim()
          .toLowerCase();
        const correctAnswer = question.correctAnswer.trim().toLowerCase();
        if (givenAnswer === correctAnswer) {
          score += 1;
        }
      }
    });

    return score;
  }
}
