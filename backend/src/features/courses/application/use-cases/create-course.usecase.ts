import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { ICourseRepository } from '../../domain/ports/i-course-repository';
import { COURSE_REPOSITORY } from '../../domain/ports/tokens';
import { Course } from '../../domain/course.entity';
import { CourseCreatedEvent } from '../../domain/events/course-created.event';

interface CreateCourseCommand {
  authorId: string;
  title: string;
  sourceText: string;
  emoji?: string;
}

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateCourseCommand): Promise<Course> {
    const course = Course.create({
      authorId: command.authorId,
      title: command.title,
      sourceText: command.sourceText,
      emoji: command.emoji ?? '📚',
    });

    const created = await this.courseRepository.create(course);

    this.eventEmitter.emit('course.created', new CourseCreatedEvent(created));

    return created;
  }
}
