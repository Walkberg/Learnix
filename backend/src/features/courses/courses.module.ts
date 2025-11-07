import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CourseRepository } from './infrastructure/course.repository';
import { PrismaService } from '../../common/prisma.service';
import { CreateCourseUseCase } from './application/use-cases/create-course.usecase';
import { GetCourseByIdUseCase } from './application/use-cases/get-course-by-id.usecase';
import { ListCoursesByAuthorUseCase } from './application/use-cases/list-courses-by-author.usecase';
import { COURSE_REPOSITORY } from './domain/ports/tokens';
import { UpdateCourseUseCase } from './application/use-cases/update-course.usecase';

@Module({
  imports: [],
  controllers: [CoursesController],
  providers: [
    PrismaService,
    { provide: COURSE_REPOSITORY, useClass: CourseRepository },
    CreateCourseUseCase,
    GetCourseByIdUseCase,
    ListCoursesByAuthorUseCase,
    UpdateCourseUseCase,
  ],
  exports: [
    CreateCourseUseCase,
    GetCourseByIdUseCase,
    ListCoursesByAuthorUseCase,
    UpdateCourseUseCase,
    COURSE_REPOSITORY,
  ],
})
export class CoursesModule {}
