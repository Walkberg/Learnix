import type { QuizAttempt, LastAttemptSummary } from '../quiz-attempt.entity';

export interface IQuizAttemptRepository {
  create(attempt: QuizAttempt): Promise<QuizAttempt>;
  findLastAttemptSummary(
    quizId: string,
    userId: string,
  ): Promise<LastAttemptSummary | null>;
  findLastAttemptsByQuizIds(
    quizIds: string[],
    userId: string,
  ): Promise<Map<string, LastAttemptSummary>>;
}
