import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CoursesModule } from '../courses/courses.module';
import { PrismaStudySheetRepository } from './infrastructure/prisma-study-sheet.repository';
import { GenerateStudySheetUseCase } from './application/use-cases/generate-study-sheet.usecase';
import { ListSummariesUseCase } from './application/use-cases/list-summaries.usecase';
import { UpdateSummaryUseCase } from './application/use-cases/update-summary.usecase';
import { CourseCreatedHandler } from './application/handlers/course-created.handler';
import { STUDY_SHEET_REPOSITORY } from './domain/ports/tokens';
import SummariesController from './summaries.controller';

@Module({
  imports: [CoursesModule],
  controllers: [SummariesController],
  providers: [
    PrismaService,
    { provide: STUDY_SHEET_REPOSITORY, useClass: PrismaStudySheetRepository },
    GenerateStudySheetUseCase,
    ListSummariesUseCase,
    UpdateSummaryUseCase,
    CourseCreatedHandler,
  ],
  exports: [STUDY_SHEET_REPOSITORY, GenerateStudySheetUseCase],
})
export class SummariesModule {}
