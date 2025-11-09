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
import { ListQuizzesByUserUseCase } from './application/use-cases/list-quizzes-by-user.usecase';
import { SubmitQuizAttemptUseCase } from './application/use-cases/submit-quiz-attempt.usecase';
import { DomainExceptionFilter } from '../../common/filters/domain-exception.filter';
import type { CreateQuizRequestDto } from './dto/requests/create-quiz.dto';
import type { QuizResponseDto } from './dto/responses/quiz.response.dto';
import type { QuizListResponseDto } from './dto/responses/quiz-list.response.dto';
import type { SubmitQuizAttemptRequestDto } from './dto/requests/submit-quiz-attempt.dto';
import type { QuizAttemptResponseDto } from './dto/responses/quiz-attempt.response.dto';

@Controller()
@UseGuards(JwtAuthGuard)
@UseFilters(DomainExceptionFilter)
export class QuizzesController {
  constructor(
    private readonly generateQuizUseCase: GenerateQuizUseCase,
    private readonly getQuizByIdUseCase: GetQuizByIdUseCase,
    private readonly listQuizzesByCourseUseCase: ListQuizzesByCourseUseCase,
    private readonly listQuizzesByUserUseCase: ListQuizzesByUserUseCase,
    private readonly submitQuizAttemptUseCase: SubmitQuizAttemptUseCase,
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
      questions: quiz.questions.map((q) => {
        if (q.type === 'MCQ') {
          return {
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          };
        } else {
          return {
            id: q.id,
            type: q.type,
            question: q.question,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          };
        }
      }),
      createdAt: quiz.createdAt,
    };
  }

  @Get('quizzes')
  async listForUser(
    @CurrentUser() userId: string,
  ): Promise<QuizListResponseDto> {
    const result = await this.listQuizzesByUserUseCase.execute({ userId });
    return {
      items: result.map(({ quiz, lastAttemptSummary }) => ({
        id: quiz.id,
        courseId: quiz.courseId,
        params: quiz.params,
        questions: quiz.questions.map((q) => {
          if (q.type === 'MCQ') {
            return {
              id: q.id,
              type: q.type,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            } as const;
          } else {
            return {
              id: q.id,
              type: q.type,
              question: q.question,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            } as const;
          }
        }),
        createdAt: quiz.createdAt,
        lastAttemptSummary,
      })),
    };
  }

  @Get('courses/:courseId/quizzes')
  async listByCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() userId: string,
  ): Promise<QuizListResponseDto> {
    const result = await this.listQuizzesByCourseUseCase.execute({
      courseId,
      userId,
    });

    return {
      items: result.map(({ quiz, lastAttemptSummary }) => ({
        id: quiz.id,
        courseId: quiz.courseId,
        params: quiz.params,
        questions: quiz.questions.map((q) => {
          if (q.type === 'MCQ') {
            return {
              id: q.id,
              type: q.type,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            } as const;
          } else {
            return {
              id: q.id,
              type: q.type,
              question: q.question,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            } as const;
          }
        }),
        createdAt: quiz.createdAt,
        lastAttemptSummary,
      })),
    };
  }

  @Get('quizzes/:id')
  async getById(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<QuizResponseDto> {
    const { quiz, lastAttemptSummary } = await this.getQuizByIdUseCase.execute({
      id,
      userId,
    });

    return {
      id: quiz.id,
      courseId: quiz.courseId,
      params: quiz.params,
      questions: quiz.questions.map((q) => {
        if (q.type === 'MCQ') {
          return {
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          };
        } else {
          return {
            id: q.id,
            type: q.type,
            question: q.question,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          };
        }
      }),
      createdAt: quiz.createdAt,
      lastAttemptSummary,
    };
  }

  @Post('quizzes/:id/attempts')
  async submitAttempt(
    @Param('id') id: string,
    @Body() dto: SubmitQuizAttemptRequestDto,
    @CurrentUser() userId: string,
  ): Promise<QuizAttemptResponseDto> {
    const attempt = await this.submitQuizAttemptUseCase.execute({
      quizId: id,
      userId,
      answers: dto.answers,
    });
    return {
      attemptId: attempt.id,
      quizId: attempt.quizId,
      userId: attempt.userId,
      score: attempt.score,
      submittedAt: attempt.submittedAt,
    };
  }
}
