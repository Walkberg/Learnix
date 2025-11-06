import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CourseCreatedEvent } from '../../../courses/domain/events/course-created.event';
import { GenerateStudySheetUseCase } from '../use-cases/generate-study-sheet.usecase';

@Injectable()
export class CourseCreatedHandler {
  constructor(
    private readonly generateStudySheetUseCase: GenerateStudySheetUseCase,
  ) {}

  @OnEvent('course.created')
  async handleCourseCreated(event: CourseCreatedEvent) {
    console.log(
      `Handling course.created event for courseId: ${event.courseId}`,
    );
    await this.generateStudySheetUseCase.execute({
      courseId: event.courseId,
    });
  }
}
