import type { Course, CourseDetail } from '../types';

export interface CreateCourseInput {
  title: string;
  sourceText: string;
  emoji?: string;
}

export interface CourseApi {
  listMyCourses(): Promise<Course[]>;
  getCourseDetail(id: string): Promise<CourseDetail>;
  createCourse(input: CreateCourseInput): Promise<Course>;
  deleteCourse(id: string): Promise<void>; // May be unsupported backend yet
}
