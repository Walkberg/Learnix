import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { GenerateQuizUseCase } from './application/use-cases/generate-quiz.usecase';
import { GetQuizByIdUseCase } from './application/use-cases/get-quiz-by-id.usecase';
import { ListQuizzesByCourseUseCase } from './application/use-cases/list-quizzes-by-course.usecase';
import { DomainExceptionFilter } from '../../common/filters/domain-exception.filter';
import type { CreateQuizRequestDto } from './dto/requests/create-quiz.dto';
import type { QuizResponseDto } from './dto/responses/quiz.response.dto';
import type { QuizListResponseDto } from './dto/responses/quiz-list.response.dto';

@Controller()
@UseGuards(JwtAuthGuard)
@UseFilters(DomainExceptionFilter)
export class QuizzesController {
  constructor(
    private readonly generateQuizUseCase: GenerateQuizUseCase,
    private readonly getQuizByIdUseCase: GetQuizByIdUseCase,
    private readonly listQuizzesByCourseUseCase: ListQuizzesByCourseUseCase,
  ) {}

  @Post('courses/:courseId/quizzes')
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateQuizRequestDto,
    @CurrentUser() userId: string,
  ): Promise<QuizResponseDto> {
    const quiz = await this.generateQuizUseCase.execute({
      courseId,
      userId,
      count: dto.count,
      type: dto.type,
    });

    return {
      id: quiz.id,
      courseId: quiz.courseId,
      params: quiz.params,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
      createdAt: quiz.createdAt,
    };
  }

  @Get('courses/:courseId/quizzes')
  async listByCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() userId: string,
  ): Promise<QuizListResponseDto> {
    const quizzes = await this.listQuizzesByCourseUseCase.execute({
      courseId,
      userId,
    });

    return {
      items: quizzes.map((quiz) => ({
        id: quiz.id,
        courseId: quiz.courseId,
        params: quiz.params,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
        createdAt: quiz.createdAt,
      })),
    };
  }

  @Get('quizzes/:id')
  async getById(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<QuizResponseDto> {
    const quiz = await this.getQuizByIdUseCase.execute({
      id,
      userId,
    });

    return {
      id: quiz.id,
      courseId: quiz.courseId,
      params: quiz.params,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
      createdAt: quiz.createdAt,
    };
  }
}
