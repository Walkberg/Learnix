import { Inject, Injectable } from '@nestjs/common';
import { FLASHCARD_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import type { IFlashcardRepository } from '../../domain/ports/i-flashcard-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { NotFlashcardOwnerError } from '../../domain/errors/flashcard.errors';

interface ListFlashcardsCommand {
  courseId: string;
  userId: string;
}

@Injectable()
export class ListFlashcardsUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepo: IFlashcardRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ courseId, userId }: ListFlashcardsCommand) {
    const course = await this.courseRepo.findById(courseId);

    if (!course || course.authorId !== userId) {
      throw new NotFlashcardOwnerError();
    }

    return this.flashcardRepo.findByCourseId(courseId);
  }
}
