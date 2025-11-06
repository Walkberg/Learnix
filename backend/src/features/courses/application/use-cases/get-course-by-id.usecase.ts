import { Injectable } from '@nestjs/common';
import type { ICourseRepository } from '../../domain/ports/i-course-repository';
import { Inject } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/ports/tokens';
import { Course } from '../../domain/course.entity';
import {
  CourseNotFoundError,
  NotCourseOwnerError,
} from '../../domain/errors/course.errors';

interface GetCourseByIdQuery {
  id: string;
  authorId: string;
}

@Injectable()
export class GetCourseByIdUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ id, authorId }: GetCourseByIdQuery): Promise<Course> {
    const course = await this.courseRepo.findById(id);

    if (!course) {
      throw new CourseNotFoundError(id);
    }

    if (course.authorId !== authorId) {
      throw new NotCourseOwnerError(id);
    }

    return course;
  }
}
