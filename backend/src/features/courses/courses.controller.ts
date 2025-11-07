import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { CreateCourseUseCase } from './application/use-cases/create-course.usecase';
import { GetCourseByIdUseCase } from './application/use-cases/get-course-by-id.usecase';
import { ListCoursesByAuthorUseCase } from './application/use-cases/list-courses-by-author.usecase';
import { UpdateCourseUseCase } from './application/use-cases/update-course.usecase';
import { DomainExceptionFilter } from '../../common/filters/domain-exception.filter';
import type { CreateCourseRequestDto } from './dto/requests/create-course.dto';
import type { UpdateCourseRequestDto } from './dto/requests/update-course.dto';
import type { CourseResponseDto } from './dto/responses/course.response.dto';
import type { CourseListResponseDto } from './dto/responses/course-list.response.dto';
import type { UpdateCourseResponseDto } from './dto/responses/update-course.response.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard)
@UseFilters(DomainExceptionFilter)
export class CoursesController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getCourseByIdUseCase: GetCourseByIdUseCase,
    private readonly listCoursesByAuthorUseCase: ListCoursesByAuthorUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateCourseRequestDto,
    @CurrentUser() userId: string,
  ): Promise<CourseResponseDto> {
    const course = await this.createCourseUseCase.execute({
      authorId: userId,
      title: dto.title,
      sourceText: dto.sourceText,
      emoji: dto.emoji,
    });
    return {
      id: course.id,
      authorId: course.authorId,
      title: course.title,
      sourceText: course.sourceText,
      emoji: course.emoji,
    };
  }

  @Get()
  async listMyCourses(
    @CurrentUser() userId: string,
  ): Promise<CourseListResponseDto> {
    const courses = await this.listCoursesByAuthorUseCase.execute({
      authorId: userId,
    });
    return {
      items: courses.map((course) => ({
        id: course.id,
        authorId: course.authorId,
        title: course.title,
        sourceText: course.sourceText,
        emoji: course.emoji,
      })),
    };
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<CourseResponseDto> {
    const course = await this.getCourseByIdUseCase.execute({
      id,
      authorId: userId,
    });
    return {
      id: course.id,
      authorId: course.authorId,
      title: course.title,
      sourceText: course.sourceText,
      emoji: course.emoji,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseRequestDto,
    @CurrentUser() userId: string,
  ): Promise<UpdateCourseResponseDto> {
    await this.updateCourseUseCase.execute({
      id,
      authorId: userId,
      patch: { title: dto.title, emoji: dto.emoji },
    });
    return { status: 'ok' };
  }
}
