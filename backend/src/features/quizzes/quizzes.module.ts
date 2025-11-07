import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { PrismaQuizRepository } from './infrastructure/repositories/prisma-quiz.repository';
import { PrismaService } from '../../common/prisma.service';
import { GenerateQuizUseCase } from './application/use-cases/generate-quiz.usecase';
import { GetQuizByIdUseCase } from './application/use-cases/get-quiz-by-id.usecase';
import { ListQuizzesByCourseUseCase } from './application/use-cases/list-quizzes-by-course.usecase';
import { QUIZ_REPOSITORY } from './domain/ports/tokens';
import { CoursesModule } from '../courses/courses.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [CoursesModule, AiModule],
  controllers: [QuizzesController],
  providers: [
    PrismaService,
    { provide: QUIZ_REPOSITORY, useClass: PrismaQuizRepository },
    GenerateQuizUseCase,
    GetQuizByIdUseCase,
    ListQuizzesByCourseUseCase,
  ],
  exports: [
    GenerateQuizUseCase,
    GetQuizByIdUseCase,
    ListQuizzesByCourseUseCase,
    QUIZ_REPOSITORY,
  ],
})
export class QuizzesModule {}
