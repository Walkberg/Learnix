import api from '@/app/api';
import type { AxiosInstance } from 'axios';
import type { QuizApi } from './quiz-api.interface';
import type { Quiz, QuizAttemptSummary } from '../types';

interface QuizDto {
  id: string;
  courseId: string;
  courseTitle: string;
  courseEmoji?: string;
  createdAt: string;
  lastAttemptSummary?: QuizAttemptSummary;
}

interface QuizListDto {
  items: QuizDto[];
}

function dtoToModel(dto: QuizDto): Quiz {
  return {
    id: dto.id,
    courseTitle: dto.courseTitle,
    courseEmoji: dto.courseEmoji,
    courseId: dto.courseId,
    createdAt: dto.createdAt,
    lastAttemptSummary: dto.lastAttemptSummary,
  };
}

export class HttpQuizApi implements QuizApi {
  private http: AxiosInstance;
  constructor(http?: AxiosInstance) {
    this.http = http ?? api;
  }

  async listQuizzes(): Promise<Quiz[]> {
    const res = await this.http.get<QuizListDto>('/quizzes');
    return res.data.items.map(dtoToModel);
  }

  async listQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    const res = await this.http.get<QuizListDto>(`/courses/${courseId}/quizzes`);
    return res.data.items.map(dtoToModel);
  }

  async generate(courseId: string, params: { count: number; type: 'MCQ' | 'OPEN' }): Promise<Quiz> {
    const res = await this.http.post<QuizDto>(`/courses/${courseId}/quizzes`, {
      count: params.count,
      type: params.type,
    });
    return dtoToModel(res.data);
  }

  async deleteQuiz(id: string): Promise<void> {
    try {
      await this.http.delete(`/quizzes/${id}`);
    } catch {
      // Allow silent fallback if endpoint absent
    }
  }

  async startAttempt(
    quizId: string,
    answers: { questionId: string; answer: number | string }[] = []
  ): Promise<QuizAttemptSummary> {
    const res = await this.http.post<{
      attemptId: string;
      quizId: string;
      userId: string;
      score: number;
      submittedAt: string;
    }>(`/quizzes/${quizId}/attempts`, {
      answers,
    });
    return {
      score: res.data.score,
      totalQuestions: answers.length, // placeholder until backend returns questions count
      attemptedAt: res.data.submittedAt,
    };
  }
}
