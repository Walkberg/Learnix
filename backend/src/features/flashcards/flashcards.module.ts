import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { SummariesModule } from '../summaries/summaries.module';
import { PrismaFlashcardRepository } from './infrastructure/prisma-flashcard.repository';
import { GenerateFlashcardsUseCase } from './application/use-cases/generate-flashcards.usecase';
import { StudySheetGeneratedHandler } from './application/handlers/study-sheet-generated.handler';
import { FLASHCARD_REPOSITORY } from './domain/ports/tokens';

@Module({
  imports: [SummariesModule],
  providers: [
    PrismaService,
    { provide: FLASHCARD_REPOSITORY, useClass: PrismaFlashcardRepository },
    GenerateFlashcardsUseCase,
    StudySheetGeneratedHandler,
  ],
  exports: [FLASHCARD_REPOSITORY, GenerateFlashcardsUseCase],
})
export class FlashcardsModule {}
