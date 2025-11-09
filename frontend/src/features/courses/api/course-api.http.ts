import api from '@/app/api';
import type { AxiosInstance } from 'axios';
import type { Course } from '../types';
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

function dtoToModel(dto: CourseDto): Course {
  return {
    id: dto.id,
    title: dto.title,
    emoji: dto.emoji,
    // Backend DTO currently doesn't expose createdAt in controller responses; synthesize for now
    createdAt: new Date().toISOString(),
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
