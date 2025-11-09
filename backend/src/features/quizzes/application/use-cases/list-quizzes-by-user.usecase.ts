import { Injectable, Inject } from '@nestjs/common';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';
import type { IQuizAttemptRepository } from '../../domain/ports/i-quiz-attempt-repository';
import {
  QUIZ_REPOSITORY,
  QUIZ_ATTEMPT_REPOSITORY,
} from '../../domain/ports/tokens';
import type { QuizWithAttempt } from '../../domain/quiz-with-attempt';

interface ListQuizzesByUserQuery {
  userId: string;
}

@Injectable()
export class ListQuizzesByUserUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository,
  ) {}

  async execute(query: ListQuizzesByUserQuery): Promise<QuizWithAttempt[]> {
    const quizzes = await this.quizRepository.findByUserId(query.userId);
    const quizIds = quizzes.map((q) => q.id);

    const attemptsMap = await this.attemptRepository.findLastAttemptsByQuizIds(
      quizIds,
      query.userId,
    );

    return quizzes.map((quiz) => ({
      quiz,
      lastAttemptSummary: attemptsMap.get(quiz.id) || null,
    }));
  }
}
