import { Inject, Injectable } from '@nestjs/common';
import { STUDY_SHEET_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import type { IStudySheetRepository } from '../../domain/ports/i-study-sheet-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { NotCourseOwnerError } from '../../../courses/domain/errors/course.errors';

interface ListSummariesCommand {
  courseId: string;
  userId: string;
}

@Injectable()
export class ListSummariesUseCase {
  constructor(
    @Inject(STUDY_SHEET_REPOSITORY)
    private readonly studySheetRepo: IStudySheetRepository,
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ courseId, userId }: ListSummariesCommand) {
    const course = await this.courseRepo.findById(courseId);

    if (!course || course.authorId !== userId) {
      throw new NotCourseOwnerError();
    }

    return this.studySheetRepo.findManyByCourseId(courseId);
  }
}
