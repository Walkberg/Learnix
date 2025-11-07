import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IQuizRepository } from '../../domain/ports/i-quiz-repository';
import type { ICourseRepository } from '../../../courses/domain/ports/i-course-repository';
import { QUIZ_REPOSITORY } from '../../domain/ports/tokens';
import { COURSE_REPOSITORY } from '../../../courses/domain/ports/tokens';
import { Quiz, QuizQuestion } from '../../domain/quiz.entity';
import { QuizGeneratedEvent } from '../../domain/events/quiz-generated.event';
import { CourseNotFoundError } from '../../../courses/domain/errors/course.errors';
import { NotCourseOwnerError } from '../../../courses/domain/errors/course.errors';
import { InvalidQuestionsCountError } from '../../domain/errors/quiz.errors';
import { AI_ADAPTER } from '../../../ai/adapter';
import type { AIAdapter } from '../../../ai/adapter';

interface GenerateQuizCommand {
  courseId: string;
  userId: string;
  count: number;
  type: string;
}

@Injectable()
export class GenerateQuizUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(AI_ADAPTER)
    private readonly aiAdapter: AIAdapter,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: GenerateQuizCommand): Promise<Quiz> {
    if (command.count < 1 || command.count > 50) {
      throw new InvalidQuestionsCountError(
        'Question count must be between 1 and 50',
      );
    }

    const course = await this.courseRepository.findById(command.courseId);
    if (!course) {
      throw new CourseNotFoundError(command.courseId);
    }
    if (course.authorId !== command.userId) {
      throw new NotCourseOwnerError();
    }

    const aiType = command.type === 'MCQ' ? 'mcq' : 'open';
    const aiQuestions = await this.aiAdapter.generateQuizQuestions(
      course.sourceText,
      command.count,
      aiType,
    );

    const questions: QuizQuestion[] = aiQuestions.map((q) => {
      if ('options' in q) {
        return {
          id: crypto.randomUUID(),
          type: 'MCQ' as const,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        };
      } else {
        return {
          id: crypto.randomUUID(),
          type: 'OPEN' as const,
          question: q.question,
          correctAnswer: q.answer,
          explanation: q.explanation,
        };
      }
    });

    const quiz = Quiz.create({
      courseId: command.courseId,
      params: {
        count: command.count,
        types: [command.type],
      },
      questions,
    });

    const created = await this.quizRepository.create(quiz);

    this.eventEmitter.emit('quiz.generated', new QuizGeneratedEvent(created));

    return created;
  }
}
