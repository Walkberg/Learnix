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
  CourseNotFoundError,
  NotCourseOwnerError,
} from '../../../courses/domain/errors/course.errors';

interface ListQuizzesByCourseQuery {
  courseId: string;
  userId: string;
}

@Injectable()
export class ListQuizzesByCourseUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository,
  ) {}

  async execute(query: ListQuizzesByCourseQuery): Promise<QuizWithAttempt[]> {
    const course = await this.courseRepository.findById(query.courseId);
    if (!course) {
      throw new CourseNotFoundError(query.courseId);
    }
    if (course.authorId !== query.userId) {
      throw new NotCourseOwnerError();
    }

    const quizzes = await this.quizRepository.findByCourseId(query.courseId);
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
