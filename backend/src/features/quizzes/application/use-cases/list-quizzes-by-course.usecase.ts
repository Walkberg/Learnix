import { Injectable, Inject } from '@nestjs/common';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { QUIZ_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import { Quiz } from '../../domain/quiz.entity';
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
  ) {}

  async execute(query: ListQuizzesByCourseQuery): Promise<Quiz[]> {
    const course = await this.courseRepository.findById(query.courseId);
    if (!course) {
      throw new CourseNotFoundError(query.courseId);
    }
    if (course.authorId !== query.userId) {
      throw new NotCourseOwnerError();
    }

    return this.quizRepository.findByCourseId(query.courseId);
  }
}
