import { Inject, Injectable } from '@nestjs/common';
import { FLASHCARD_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import type { IFlashcardRepository } from '../../domain/ports/i-flashcard-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import {
  FlashcardNotFoundError,
  NotFlashcardOwnerError,
} from '../../domain/errors/flashcard.errors';

interface DeleteFlashcardCommand {
  flashcardId: string;
  userId: string;
}

@Injectable()
export class DeleteFlashcardUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY)
    private readonly flashcardRepo: IFlashcardRepository,
    @Inject(COURSE_REPOSITORY) private readonly courseRepo: ICourseRepository,
  ) {}

  async execute({ flashcardId, userId }: DeleteFlashcardCommand) {
    const flashcard = await this.flashcardRepo.findById(flashcardId);

    if (!flashcard) {
      throw new FlashcardNotFoundError(flashcardId);
    }

    const course = await this.courseRepo.findById(flashcard.courseId);

    if (!course || course.authorId !== userId) {
      throw new NotFlashcardOwnerError();
    }

    const count = await this.flashcardRepo.deleteById(flashcardId);

    if (count === 0) throw new FlashcardNotFoundError(flashcardId);

    return { status: 'ok' };
  }
}
