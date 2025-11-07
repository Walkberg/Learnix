import { Inject, Injectable } from '@nestjs/common';
import { STUDY_SHEET_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import type { IStudySheetRepository } from '../../domain/ports/i-study-sheet-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { NotCourseOwnerError } from '../../../courses/domain/errors/course.errors';
import { SummaryNotFoundError } from '../../domain/errors/summary.errors';

interface UpdateSummaryCommand {
  summaryId: string;
  userId: string;
  patch: { summary?: string };
}

@Injectable()
export class UpdateSummaryUseCase {
  constructor(
    @Inject(STUDY_SHEET_REPOSITORY)
    private readonly studySheetRepo: IStudySheetRepository,
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ summaryId, userId, patch }: UpdateSummaryCommand) {
    const summary = await this.studySheetRepo.findById(summaryId);

    if (!summary) throw new SummaryNotFoundError(summaryId);

    const course = await this.courseRepo.findById(summary.courseId);

    if (!course || course.authorId !== userId) {
      throw new NotCourseOwnerError();
    }

    const count = await this.studySheetRepo.updateById(summaryId, patch);

    if (count === 0) throw new SummaryNotFoundError(summaryId);

    return { status: 'ok' };
  }
}
