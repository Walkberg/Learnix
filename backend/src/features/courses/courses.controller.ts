import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { CreateCourseUseCase } from './application/use-cases/create-course.usecase';
import { GetCourseByIdUseCase } from './application/use-cases/get-course-by-id.usecase';
import { ListCoursesByAuthorUseCase } from './application/use-cases/list-courses-by-author.usecase';
import { DomainExceptionFilter } from '../../common/filters/domain-exception.filter';

interface CreateCourseDto {
  title: string;
  sourceText: string;
  emoji?: string;
}

@Controller('courses')
@UseGuards(JwtAuthGuard)
@UseFilters(DomainExceptionFilter)
export class CoursesController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getCourseByIdUseCase: GetCourseByIdUseCase,
    private readonly listCoursesByAuthorUseCase: ListCoursesByAuthorUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCourseDto, @CurrentUser() userId: string) {
    return this.createCourseUseCase.execute({
      authorId: userId,
      title: dto.title,
      sourceText: dto.sourceText,
      emoji: dto.emoji,
    });
  }

  @Get()
  async listMyCourses(@CurrentUser() userId: string) {
    return this.listCoursesByAuthorUseCase.execute({ authorId: userId });
  }

  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.getCourseByIdUseCase.execute({ id, authorId: userId });
  }
}
