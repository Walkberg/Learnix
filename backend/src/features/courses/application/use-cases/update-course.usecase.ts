import { Inject, Injectable } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/ports/tokens';
import type { ICourseRepository } from '../../domain/ports/i-course-repository';
import {
  CourseNotFoundError,
  NotCourseOwnerError,
} from '../../domain/errors/course.errors';

interface UpdateCourseCommand {
  id: string;
  authorId: string;
  patch: { title?: string; emoji?: string };
}

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ id, authorId, patch }: UpdateCourseCommand) {
    const course = await this.courseRepo.findById(id);

    if (!course) throw new CourseNotFoundError(id);

    if (course.authorId !== authorId) throw new NotCourseOwnerError();

    await this.courseRepo.update(id, patch);

    return { status: 'ok' };
  }
}
