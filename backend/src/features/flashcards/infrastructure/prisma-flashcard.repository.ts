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
}
