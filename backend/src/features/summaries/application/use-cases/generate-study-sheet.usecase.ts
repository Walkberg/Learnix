import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IStudySheetRepository } from '../../domain/ports/i-study-sheet-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import type { AIAdapter } from '../../../ai/adapter';
import { StudySheet } from '../../domain/entities/study-sheet.entity';
import { StudySheetGeneratedEvent } from '../../domain/events/study-sheet-generated.event';
import { STUDY_SHEET_REPOSITORY } from '../../domain/ports/tokens';

export type GenerateStudySheetCommand = {
  courseId: string;
};

@Injectable()
export class GenerateStudySheetUseCase {
  constructor(
    @Inject(STUDY_SHEET_REPOSITORY)
    private readonly studySheetRepository: IStudySheetRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject('AIAdapter')
    private readonly aiAdapter: AIAdapter,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: GenerateStudySheetCommand): Promise<void> {
    const existingSheet = await this.studySheetRepository.findByCourseId(
      command.courseId,
    );

    if (existingSheet) {
      return;
    }

    const existingCourse = await this.courseRepository.findById(
      command.courseId,
    );

    if (!existingCourse) {
      return;
    }

    const aiSummary = await this.aiAdapter.generateSummary(
      existingCourse.sourceText,
    );

    const studySheet = StudySheet.create({
      courseId: command.courseId,
      summary: aiSummary.summary || '',
    });

    const savedSheet = await this.studySheetRepository.create(studySheet);

    if (aiSummary.title || aiSummary.emoji) {
      await this.courseRepository.update(command.courseId, {
        title: aiSummary.title || existingCourse.title,
        emoji: aiSummary.emoji ?? existingCourse.emoji,
      } as any);
    }

    this.eventEmitter.emit(
      'studysheet.generated',
      new StudySheetGeneratedEvent(savedSheet),
    );
  }
}
