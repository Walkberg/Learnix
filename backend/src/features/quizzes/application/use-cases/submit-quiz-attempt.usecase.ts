import { Injectable, Inject } from '@nestjs/common';
import {
  QUIZ_REPOSITORY,
  QUIZ_ATTEMPT_REPOSITORY,
} from '../../domain/ports/tokens';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';
import type { IQuizAttemptRepository } from '../../domain/ports/i-quiz-attempt-repository';
import {
  QuizAttempt,
  type AttemptAnswer,
} from '../../domain/quiz-attempt.entity';
import {
  QuizNotFoundError,
  NotQuizOwnerError,
} from '../../domain/errors/quiz.errors';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';

interface SubmitQuizAttemptCommand {
  quizId: string;
  userId: string;
  answers: AttemptAnswer[];
}

@Injectable()
export class SubmitQuizAttemptUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUIZ_ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IQuizAttemptRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: SubmitQuizAttemptCommand): Promise<QuizAttempt> {
    const quiz = await this.quizRepository.findById(command.quizId);
    if (!quiz) throw new QuizNotFoundError(command.quizId);

    const course = await this.courseRepository.findById(quiz.courseId);
    if (!course || course.authorId !== command.userId) {
      throw new NotQuizOwnerError();
    }

    const attempt = QuizAttempt.create({
      quizId: quiz.id,
      userId: command.userId,
      answers: command.answers,
      quiz,
    });

    await this.attemptRepository.create(attempt);
    return attempt;
  }
}
