import { Quiz } from '../quiz.entity';

export interface IQuizRepository {
  create(quiz: Quiz): Promise<Quiz>;

  findById(id: string): Promise<Quiz | null>;

  findByCourseId(courseId: string): Promise<Quiz[]>;

  /**
   * Find all quizzes for courses owned by the given user
   */
  findByUserId(userId: string): Promise<Quiz[]>;
}
