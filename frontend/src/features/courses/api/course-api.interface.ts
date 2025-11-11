import type { Course, CourseDetail, CourseSummary } from '../types';

export interface CreateCourseInput {
  title: string;
  sourceText: string;
  emoji?: string;
}

export interface CourseApi {
  listMyCourses(): Promise<Course[]>;
  getCourseDetail(id: string): Promise<CourseDetail>;
  getCourseSummaries(courseId: string): Promise<CourseSummary[]>;
  createCourse(input: CreateCourseInput): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
}
