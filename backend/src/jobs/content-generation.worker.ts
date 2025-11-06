import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import type { AIAdapter } from '../features/ai/adapter';
import { CourseCreatedEvent } from '../features/courses/domain/events/course-created.event';

@Processor('content-generation')
export class ContentGenerationWorker {
  private readonly logger = new Logger(ContentGenerationWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('AIAdapter') private readonly aiAdapter: AIAdapter,
  ) {}

  @Process('generate-study-materials')
  async handleContentGeneration(job: Job<CourseCreatedEvent>) {
    const { courseId, sourceText, title } = job.data;
    this.logger.log(`Generating study materials for course ${courseId}`);

    try {
      // Generate AI summary
      const aiSummary = await this.aiAdapter.generateSummary(sourceText);

      const summaryMd = aiSummary.summary || '';
      const keyPoints = summaryMd
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      // Save summary as StudySheet (use any casts to avoid temporary Prisma types mismatch)
      await this.prisma.studySheet.create({
        // @ts-ignore
        data: {
          courseId,
          title: aiSummary.title || title,
          summaryMd,
          keyPoints,
        } as any,
      });

      // Save flashcards for first key points
      await this.prisma.flashcard.createMany({
        data: keyPoints.slice(0, 5).map((point) => ({
          courseId,
          prompt: `Explain: ${point.replace(/^\*\s*/, '')}`,
          answer: point,
        })),
      });

      this.logger.log(
        `Successfully generated study materials for course ${courseId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to generate study materials for course ${courseId}`,
        error.stack,
      );
      throw error;
    }
  }
}
