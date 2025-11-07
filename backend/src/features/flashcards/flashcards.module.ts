import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { SummariesModule } from '../summaries/summaries.module';
import { CoursesModule } from '../courses/courses.module';
import { PrismaFlashcardRepository } from './infrastructure/prisma-flashcard.repository';
import { GenerateFlashcardsUseCase } from './application/use-cases/generate-flashcards.usecase';
import { ListFlashcardsUseCase } from './application/use-cases/list-flashcards.usecase';
import { DeleteFlashcardUseCase } from './application/use-cases/delete-flashcard.usecase';
import { UpdateFlashcardUseCase } from './application/use-cases/update-flashcard.usecase';
import { StudySheetGeneratedHandler } from './application/handlers/study-sheet-generated.handler';
import { FLASHCARD_REPOSITORY } from './domain/ports/tokens';
import FlashcardsController from './flashcards.controller';

@Module({
  imports: [SummariesModule, CoursesModule],
  controllers: [FlashcardsController],
  providers: [
    PrismaService,
    { provide: FLASHCARD_REPOSITORY, useClass: PrismaFlashcardRepository },
    GenerateFlashcardsUseCase,
    ListFlashcardsUseCase,
    DeleteFlashcardUseCase,
    UpdateFlashcardUseCase,
    StudySheetGeneratedHandler,
  ],
  exports: [FLASHCARD_REPOSITORY, GenerateFlashcardsUseCase],
})
export class FlashcardsModule {}
