import { Quiz } from '../quiz.entity';

export interface IQuizRepository {
  create(quiz: Quiz): Promise<Quiz>;

  findById(id: string): Promise<Quiz | null>;

  findByCourseId(courseId: string): Promise<Quiz[]>;
}
