import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { PrismaQuizRepository } from './infrastructure/repositories/prisma-quiz.repository';
import { PrismaService } from '../../common/prisma.service';
import { GenerateQuizUseCase } from './application/use-cases/generate-quiz.usecase';
import { GetQuizByIdUseCase } from './application/use-cases/get-quiz-by-id.usecase';
import { ListQuizzesByCourseUseCase } from './application/use-cases/list-quizzes-by-course.usecase';
import {
  QUIZ_REPOSITORY,
  QUIZ_ATTEMPT_REPOSITORY,
} from './domain/ports/tokens';
import { CoursesModule } from '../courses/courses.module';
import { AiModule } from '../ai/ai.module';
import { PrismaQuizAttemptRepository } from './infrastructure/repositories/prisma-quiz-attempt.repository';
import { SubmitQuizAttemptUseCase } from './application/use-cases/submit-quiz-attempt.usecase';
import { GetLastAttemptForUserUseCase } from './application/use-cases/get-last-attempt-for-user.usecase';

@Module({
  imports: [CoursesModule, AiModule],
  controllers: [QuizzesController],
  providers: [
    PrismaService,
    { provide: QUIZ_REPOSITORY, useClass: PrismaQuizRepository },
    { provide: QUIZ_ATTEMPT_REPOSITORY, useClass: PrismaQuizAttemptRepository },
    GenerateQuizUseCase,
    GetQuizByIdUseCase,
    ListQuizzesByCourseUseCase,
    SubmitQuizAttemptUseCase,
    GetLastAttemptForUserUseCase,
  ],
  exports: [
    GenerateQuizUseCase,
    GetQuizByIdUseCase,
    ListQuizzesByCourseUseCase,
    QUIZ_REPOSITORY,
    QUIZ_ATTEMPT_REPOSITORY,
    SubmitQuizAttemptUseCase,
    GetLastAttemptForUserUseCase,
  ],
})
export class QuizzesModule {}
