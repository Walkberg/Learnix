import { PrismaService } from '../../../common/prisma.service';
import { Injectable } from '@nestjs/common';
import { IFlashcardRepository } from '../domain/ports/i-flashcard-repository';
import { Flashcard } from '../domain/entities/flashcard.entity';

@Injectable()
export class PrismaFlashcardRepository implements IFlashcardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(flashcards: Flashcard[]): Promise<void> {
    await this.prisma.flashcard.createMany({
      data: flashcards.map((flashcard) => ({
        courseId: flashcard.courseId,
        prompt: flashcard.question,
        answer: flashcard.answer,
      })),
    });
  }

  async findByCourseId(courseId: string): Promise<Flashcard[]> {
    const rows = await this.prisma.flashcard.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) =>
      Flashcard.create({
        id: r.id,
        courseId: r.courseId,
        question: r.prompt,
        answer: r.answer,
      }),
    );
  }

  async deleteById(id: string): Promise<number> {
    const res = await this.prisma.flashcard.deleteMany({ where: { id } });
    return res.count;
  }

  async updateById(id: string, data: Partial<Flashcard>): Promise<number> {
    const prismaData: any = {};
    if (data.question !== undefined) prismaData.prompt = data.question;
    if (data.answer !== undefined) prismaData.answer = data.answer;
    const res = await this.prisma.flashcard.updateMany({
      where: { id },
      data: prismaData,
    });
    return res.count;
  }

  async findById(id: string): Promise<Flashcard | null> {
    const row = await this.prisma.flashcard.findUnique({ where: { id } });
    if (!row) return null;
    return Flashcard.create({
      id: row.id,
      courseId: row.courseId,
      question: row.prompt,
      answer: row.answer,
    });
  }
}
