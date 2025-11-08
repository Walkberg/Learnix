import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma.service';
import type { IQuizAttemptRepository } from '../../domain/ports/i-quiz-attempt-repository';
import { QuizAttempt } from '../../domain/quiz-attempt.entity';
import type { LastAttemptSummary } from '../../domain/quiz-attempt.entity';

@Injectable()
export class PrismaQuizAttemptRepository implements IQuizAttemptRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attempt: QuizAttempt): Promise<QuizAttempt> {
    await this.prisma.quizAttempt.create({
      data: {
        id: attempt.id,
        quizId: attempt.quizId,
        userId: attempt.userId,
        answers: attempt.answers as any,
        score: attempt.score,
        submittedAt: attempt.submittedAt,
      },
    });
    return attempt;
  }

  async findLastAttemptSummary(
    quizId: string,
    userId: string,
  ): Promise<LastAttemptSummary | null> {
    const attempt = await this.prisma.quizAttempt.findFirst({
      where: { quizId, userId },
      orderBy: { submittedAt: 'desc' },
    });
    if (!attempt) return null;
    return {
      attemptId: attempt.id,
      score: attempt.score,
      submittedAt: attempt.submittedAt,
      answers: (attempt.answers as any) ?? [],
    };
  }

  async findLastAttemptsByQuizIds(
    quizIds: string[],
    userId: string,
  ): Promise<Map<string, LastAttemptSummary>> {
    if (quizIds.length === 0) {
      return new Map();
    }

    const latestAttempts = await this.prisma.quizAttempt.groupBy({
      by: ['quizId'],
      where: {
        quizId: { in: quizIds },
        userId,
      },
      _max: {
        submittedAt: true,
      },
    });

    const maxDates = latestAttempts
      .map((a) => a._max.submittedAt)
      .filter((d): d is Date => d !== null);

    if (maxDates.length === 0) {
      return new Map();
    }

    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizIds },
        submittedAt: { in: maxDates },
      },
    });

    const map = new Map<string, LastAttemptSummary>();
    attempts.forEach((attempt) => {
      const existing = map.get(attempt.quizId);
      if (
        !existing ||
        attempt.submittedAt.getTime() > existing.submittedAt.getTime()
      ) {
        map.set(attempt.quizId, {
          attemptId: attempt.id,
          score: attempt.score,
          submittedAt: attempt.submittedAt,
          answers: (attempt.answers as any) ?? [],
        });
      }
    });

    return map;
  }
}
