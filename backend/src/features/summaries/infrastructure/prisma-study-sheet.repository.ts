import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { StudySheet } from '../domain/entities/study-sheet.entity';
import { IStudySheetRepository } from '../domain/ports/i-study-sheet-repository';

@Injectable()
export class PrismaStudySheetRepository implements IStudySheetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(studySheet: StudySheet): Promise<StudySheet> {
    const created = await this.prisma.studySheet.create({
      data: {
        keyPoints: [],
        title: '',
        summary: {},
        courseId: studySheet.courseId,
        summaryMd: studySheet.summary,
        generatedAt: studySheet.createdAt,
      },
    });

    return StudySheet.create({
      id: created.id,
      courseId: created.courseId,
      summary: created.summaryMd ?? '',
    });
  }

  async findByCourseId(courseId: string): Promise<StudySheet | null> {
    const studySheet = await this.prisma.studySheet.findFirst({
      where: { courseId },
    });

    if (!studySheet) {
      return null;
    }

    return StudySheet.create({
      id: studySheet.id,
      courseId: studySheet.courseId,
      summary: studySheet.summaryMd ?? '',
    });
  }

  async findById(id: string): Promise<StudySheet | null> {
    const studySheet = await this.prisma.studySheet.findUnique({
      where: { id },
    });
    if (!studySheet) return null;
    return StudySheet.create({
      id: studySheet.id,
      courseId: studySheet.courseId,
      summary: studySheet.summaryMd ?? '',
    });
  }

  async findManyByCourseId(courseId: string): Promise<StudySheet[]> {
    const studySheets = await this.prisma.studySheet.findMany({
      where: { courseId },
      orderBy: { generatedAt: 'desc' },
    });

    return studySheets.map((s) =>
      StudySheet.create({
        id: s.id,
        courseId: s.courseId,
        summary: s.summaryMd ?? '',
      }),
    );
  }

  async updateById(id: string, data: Partial<StudySheet>): Promise<number> {
    const prismaData: any = {};
    if (data.summary !== undefined) prismaData.summaryMd = data.summary;

    const res = await this.prisma.studySheet.updateMany({
      where: { id },
      data: prismaData,
    });
    return res.count;
  }
}
