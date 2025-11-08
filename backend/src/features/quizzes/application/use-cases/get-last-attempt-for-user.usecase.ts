import { Injectable, Inject } from '@nestjs/common';
import { QUIZ_ATTEMPT_REPOSITORY } from '../../domain/ports/tokens';
import type { IQuizAttemptRepository } from '../../domain/ports/i-quiz-attempt-repository';
import type { LastAttemptSummary } from '../../domain/quiz-attempt.entity';

interface GetLastAttemptQuery {
  quizId: string;
  userId: string;
}

@Injectable()
export class GetLastAttemptForUserUseCase {
  constructor(
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository,
  ) {}

  async execute(
    query: GetLastAttemptQuery,
  ): Promise<LastAttemptSummary | null> {
    return this.attemptRepository.findLastAttemptSummary(
      query.quizId,
      query.userId,
    );
  }
}
