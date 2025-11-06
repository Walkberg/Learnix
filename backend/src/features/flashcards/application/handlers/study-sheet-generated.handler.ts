import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StudySheetGeneratedEvent } from '../../../summaries/domain/events/study-sheet-generated.event';
import { GenerateFlashcardsUseCase } from '../use-cases/generate-flashcards.usecase';

@Injectable()
export class StudySheetGeneratedHandler {
  constructor(
    private readonly generateFlashcardsUseCase: GenerateFlashcardsUseCase,
  ) {}

  @OnEvent('studysheet.generated')
  async handleStudySheetGenerated(
    event: StudySheetGeneratedEvent,
  ): Promise<void> {
    console.log(
      `Handling studysheet.generated event for courseId: ${event.courseId}`,
    );
    await this.generateFlashcardsUseCase.execute({
      courseId: event.courseId,
    });
  }
}
