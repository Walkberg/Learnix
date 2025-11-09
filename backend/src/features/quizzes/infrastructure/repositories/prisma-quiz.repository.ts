import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma.service';
import { Quiz, QuizParams, QuizQuestion } from '../../domain/quiz.entity';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';

@Injectable()
export class PrismaQuizRepository implements IQuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(quiz: Quiz): Promise<Quiz> {
    const created = await this.prisma.quiz.create({
      data: {
        id: quiz.id,
        courseId: quiz.courseId,
        params: quiz.params as any,
        questions: quiz.questions as any,
        createdAt: quiz.createdAt,
      },
    });

    return Quiz.create({
      id: created.id,
      courseId: created.courseId,
      params: created.params as unknown as QuizParams,
      questions: created.questions as unknown as QuizQuestion[],
    });
  }

  async findById(id: string): Promise<Quiz | null> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return null;
    }

    return Quiz.create({
      id: quiz.id,
      courseId: quiz.courseId,
      params: quiz.params as unknown as QuizParams,
      questions: quiz.questions as unknown as QuizQuestion[],
    });
  }

  async findByCourseId(courseId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.quiz.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });

    return quizzes.map((quiz) =>
      Quiz.create({
        id: quiz.id,
        courseId: quiz.courseId,
        params: quiz.params as unknown as QuizParams,
        questions: quiz.questions as unknown as QuizQuestion[],
      }),
    );
  }

  async findByUserId(userId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.quiz.findMany({
      where: { course: { authorId: userId } },
      orderBy: { createdAt: 'desc' },
    });

    return quizzes.map((quiz) =>
      Quiz.create({
        id: quiz.id,
        courseId: quiz.courseId,
        params: quiz.params as unknown as QuizParams,
        questions: quiz.questions as unknown as QuizQuestion[],
      }),
    );
  }
}
