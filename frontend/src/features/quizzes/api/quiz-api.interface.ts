import type { Quiz, QuizAttemptSummary } from '../types';

export interface QuizApi {
  listQuizzes(): Promise<Quiz[]>;
  listQuizzesByCourse(courseId: string): Promise<Quiz[]>;
  generate(courseId: string, params: { count: number; type: 'MCQ' | 'OPEN' }): Promise<Quiz>;
  deleteQuiz(id: string): Promise<void>;
  startAttempt(
    quizId: string,
    answers?: { questionId: string; answer: number | string }[]
  ): Promise<QuizAttemptSummary>;
  getQuizStatsByCourse?(courseId: string): Promise<{ averageScore: number; quizzesCompleted: number; totalQuizzes: number }>;
}
