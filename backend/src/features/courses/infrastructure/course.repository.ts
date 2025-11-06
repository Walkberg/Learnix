import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { Course } from '../domain/course.entity';

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: Course): Promise<Course> {
    const created = await this.prisma.course.create({
      data: {
        id: course.id,
        authorId: course.authorId,
        title: course.title,
        sourceText: course.sourceText,
        emoji: course.emoji,
      },
    });

    return Course.create({
      id: created.id,
      authorId: created.authorId,
      title: created.title,
      sourceText: created.sourceText,
      emoji: created.emoji ?? null,
    });
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return null;
    }

    return Course.create({
      id: course.id,
      authorId: course.authorId,
      title: course.title,
      sourceText: course.sourceText,
      emoji: course.emoji ?? null,
    });
  }

  async findByAuthorId(authorId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((course) =>
      Course.create({
        id: course.id,
        authorId: course.authorId,
        title: course.title,
        sourceText: course.sourceText,
        emoji: course.emoji ?? null,
      }),
    );
  }

  async update(
    id: string,
    data: { title?: string; emoji?: string | null },
  ): Promise<Course> {
    const updated = await this.prisma.course.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.emoji !== undefined ? { emoji: data.emoji } : {}),
      },
    });

    return Course.create({
      id: updated.id,
      authorId: updated.authorId,
      title: updated.title,
      sourceText: updated.sourceText,
      emoji: updated.emoji ?? null,
    });
  }
}
