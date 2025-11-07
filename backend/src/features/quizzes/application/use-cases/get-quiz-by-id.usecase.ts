import { Injectable, Inject } from '@nestjs/common';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { QUIZ_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import { Quiz } from '../../domain/quiz.entity';
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
  ) {}

  async execute(query: GetQuizByIdQuery): Promise<Quiz> {
    const quiz = await this.quizRepository.findById(query.id);

    if (!quiz) {
      throw new QuizNotFoundError(query.id);
    }

    const course = await this.courseRepository.findById(quiz.courseId);
    if (!course || course.authorId !== query.userId) {
      throw new NotQuizOwnerError();
    }

    return quiz;
  }
}
