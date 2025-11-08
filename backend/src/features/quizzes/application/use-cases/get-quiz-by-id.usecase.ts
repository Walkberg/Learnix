import { Injectable, Inject } from '@nestjs/common';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import {
  QUIZ_REPOSITORY,
  QUIZ_ATTEMPT_REPOSITORY,
} from '../../domain/ports/tokens';
import type { IQuizAttemptRepository } from '../../domain/ports/i-quiz-attempt-repository';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import type { QuizWithAttempt } from '../../domain/quiz-with-attempt';
import {
  QuizNotFoundError,
  NotQuizOwnerError,
} from '../../domain/errors/quiz.errors';

interface GetQuizByIdQuery {
  id: string;
  userId: string;
}

@Injectable()
export class GetQuizByIdUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository,
  ) {}

  async execute(query: GetQuizByIdQuery): Promise<QuizWithAttempt> {
    const quiz = await this.quizRepository.findById(query.id);

    if (!quiz) {
      throw new QuizNotFoundError(query.id);
    }

    const course = await this.courseRepository.findById(quiz.courseId);
    if (!course || course.authorId !== query.userId) {
      throw new NotQuizOwnerError();
    }

    const lastAttemptSummary =
      await this.attemptRepository.findLastAttemptSummary(
        query.id,
        query.userId,
      );

    return {
      quiz,
      lastAttemptSummary,
    };
  }
}
