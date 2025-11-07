import { Quiz } from '../quiz.entity';

export class QuizGeneratedEvent {
  public readonly quizId: string;
  public readonly courseId: string;
  public readonly questionCount: number;

  constructor(quiz: Quiz) {
    this.quizId = quiz.id;
    this.courseId = quiz.courseId;
    this.questionCount = quiz.questions.length;
  }
}
