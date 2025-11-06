import { Course } from '../course.entity';

export interface ICourseRepository {
  create(course: Course): Promise<Course>;

  findById(id: string): Promise<Course | null>;

  findByAuthorId(authorId: string): Promise<Course[]>;

  update(
    id: string,
    data: { title?: string; emoji?: string | null },
  ): Promise<Course>;
}
