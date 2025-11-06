import { Injectable } from '@nestjs/common';
import type { ICourseRepository } from '../../domain/ports/i-course-repository';
import { Inject } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../domain/ports/tokens';
import { Course } from '../../domain/course.entity';

interface ListCoursesByAuthorQuery {
  authorId: string;
}

@Injectable()
export class ListCoursesByAuthorUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ authorId }: ListCoursesByAuthorQuery): Promise<Course[]> {
    return this.courseRepo.findByAuthorId(authorId);
  }
}
