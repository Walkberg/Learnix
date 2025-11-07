import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { DomainExceptionFilter } from '../../common/filters/domain-exception.filter';
import { CurrentUser } from '../../features/auth/auth.decorator';
import { ListFlashcardsUseCase } from './application/use-cases/list-flashcards.usecase';
import { DeleteFlashcardUseCase } from './application/use-cases/delete-flashcard.usecase';
import { UpdateFlashcardUseCase } from './application/use-cases/update-flashcard.usecase';
import type { UpdateFlashcardRequestDto } from './dto/requests/update-flashcard.dto';
import type { FlashcardListResponseDto } from './dto/responses/flashcard-list.response.dto';
import type { DeleteFlashcardResponseDto } from './dto/responses/delete-flashcard.response.dto';
import type { UpdateFlashcardResponseDto } from './dto/responses/update-flashcard.response.dto';

@Controller()
@UseGuards(JwtAuthGuard)
@UseFilters(DomainExceptionFilter)
export class FlashcardsController {
  constructor(
    private readonly listUseCase: ListFlashcardsUseCase,
    private readonly deleteUseCase: DeleteFlashcardUseCase,
    private readonly updateUseCase: UpdateFlashcardUseCase,
  ) {}

  @Get('courses/:courseId/flashcards')
  async listForCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() userId: string,
  ): Promise<FlashcardListResponseDto> {
    const flashcards = await this.listUseCase.execute({ courseId, userId });
    return {
      items: flashcards.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      })),
    };
  }

  @Delete('courses/:courseId/flashcards/:flashcardId')
  async delete(
    @Param('flashcardId') flashcardId: string,
    @CurrentUser() userId: string,
  ): Promise<DeleteFlashcardResponseDto> {
    await this.deleteUseCase.execute({ flashcardId, userId });
    return { status: 'ok' };
  }

  @Patch('flashcards/:flashcardId')
  async patch(
    @Param('flashcardId') flashcardId: string,
    @Body() dto: UpdateFlashcardRequestDto,
    @CurrentUser() userId: string,
  ): Promise<UpdateFlashcardResponseDto> {
    await this.updateUseCase.execute({
      flashcardId,
      userId,
      patch: { question: dto.question, answer: dto.answer },
    });
    return { status: 'ok' };
  }
}

export default FlashcardsController;
