import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { DomainExceptionFilter } from '../../common/filters/domain-exception.filter';
import { CurrentUser } from '../auth/auth.decorator';
import { ListSummariesUseCase } from './application/use-cases/list-summaries.usecase';
import { UpdateSummaryUseCase } from './application/use-cases/update-summary.usecase';
import type { UpdateSummaryRequestDto } from './dto/requests/update-summary.dto';
import type { SummaryListResponseDto } from './dto/responses/summary-list.response.dto';
import type { UpdateSummaryResponseDto } from './dto/responses/update-summary.response.dto';

@Controller()
@UseGuards(JwtAuthGuard)
@UseFilters(DomainExceptionFilter)
export class SummariesController {
  constructor(
    private readonly listUseCase: ListSummariesUseCase,
    private readonly updateUseCase: UpdateSummaryUseCase,
  ) {}

  @Get('courses/:courseId/summaries')
  async listForCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() userId: string,
  ): Promise<SummaryListResponseDto> {
    const summaries = await this.listUseCase.execute({ courseId, userId });
    return {
      items: summaries.map((s) => ({
        id: s.id,
        content: s.summary,
      })),
    };
  }

  @Patch('summaries/:summaryId')
  async patch(
    @Param('summaryId') summaryId: string,
    @Body() dto: UpdateSummaryRequestDto,
    @CurrentUser() userId: string,
  ): Promise<UpdateSummaryResponseDto> {
    await this.updateUseCase.execute({
      summaryId,
      userId,
      patch: { summary: dto.content },
    });
    return { status: 'ok' };
  }
}

export default SummariesController;
