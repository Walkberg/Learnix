import { Injectable, Inject } from '@nestjs/common';
import type { AIAdapter } from '../../../ai/adapter';
import { AI_ADAPTER } from '../../../ai/adapter';
import type { IFlashcardRepository } from '../../domain/ports/i-flashcard-repository';
import { Flashcard } from '../../domain/entities/flashcard.entity';
import type { IStudySheetRepository } from 'src/features/summaries/domain/ports/i-study-sheet-repository';
import { FLASHCARD_REPOSITORY } from '../../domain/ports/tokens';
import { STUDY_SHEET_REPOSITORY } from '../../../summaries/domain/ports/tokens';

@Injectable()
export class GenerateFlashcardsUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepository: IFlashcardRepository,
    @Inject(STUDY_SHEET_REPOSITORY)
    private readonly studySheetRepository: IStudySheetRepository,
    @Inject(AI_ADAPTER)
    private readonly aiAdapter: AIAdapter,
  ) {}

  async execute({ courseId }: { courseId: string }): Promise<void> {
    const studySheet = await this.studySheetRepository.findByCourseId(courseId);

    if (!studySheet) {
      return;
    }

    const aiFlashcards = await this.aiAdapter.generateFlashcards(
      studySheet.summary,
      20,
    );

    const flashcards = aiFlashcards.map((flashCard) => {
      return Flashcard.create({
        courseId,
        question: flashCard.question,
        answer: flashCard.answer,
      });
    });

    await this.flashcardRepository.createMany(flashcards);
  }
}
