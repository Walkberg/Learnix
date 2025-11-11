import api from '@/app/api';
import type { AxiosInstance } from 'axios';
import type { Course, CourseDetail, CourseSummary } from '../types';
import type { CourseApi, CreateCourseInput } from './course-api.interface';

// Backend DTOs (local to API impl)
interface CourseDto {
  id: string;
  authorId: string;
  title: string;
  sourceText?: string;
  emoji?: string;
}

interface CourseListDto {
  items: CourseDto[];
}

interface CourseDetailDto extends CourseDto {
  flashcardStats?: {
    total: number;
    mastered: number;
    learning: number;
  };
  quizStats?: {
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
  };
}

interface SummaryDto {
  id: string;
  content: string;
}

interface SummaryListDto {
  items: SummaryDto[];
}

function dtoToModel(dto: CourseDto): Course {
  return {
    id: dto.id,
    title: dto.title,
    emoji: dto.emoji,
    // Backend DTO currently doesn't expose createdAt in controller responses; synthesize for now
    createdAt: new Date().toISOString(),
  };
}

function dtoToDetailModel(dto: CourseDetailDto): CourseDetail {
  return {
    id: dto.id,
    title: dto.title,
    emoji: dto.emoji,
    createdAt: new Date().toISOString(),
    flashcardStats: dto.flashcardStats,
    quizStats: dto.quizStats,
  };
}

function summaryDtoToModel(dto: SummaryDto): CourseSummary {
  return {
    id: dto.id,
    content: dto.content,
  };
}

export class HttpCourseApi implements CourseApi {
  private http: AxiosInstance;
  constructor(http?: AxiosInstance) {
    this.http = http ?? api;
  }

  async listMyCourses(): Promise<Course[]> {
    const res = await this.http.get<CourseListDto>('/courses');
    return res.data.items.map(dtoToModel);
  }

  async getCourseDetail(id: string): Promise<CourseDetail> {
    const res = await this.http.get<CourseDetailDto>(`/courses/${id}`);
    return dtoToDetailModel(res.data);
  }

  async getCourseSummaries(courseId: string): Promise<CourseSummary[]> {
    const res = await this.http.get<SummaryListDto>(`/courses/${courseId}/summaries`);
    return res.data.items.map(summaryDtoToModel);
  }

  async createCourse(input: CreateCourseInput): Promise<Course> {
    const res = await this.http.post<CourseDto>('/courses', input);
    return dtoToModel(res.data);
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await this.http.delete(`/courses/${id}`);
    } catch {
      // Allow provider to treat as best-effort if backend lacks DELETE
    }
  }
}
