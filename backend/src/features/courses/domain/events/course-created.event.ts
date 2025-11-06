import { Course } from '../course.entity';

export class CourseCreatedEvent {
  public readonly courseId: string;
  public readonly authorId: string;
  public readonly title: string;
  public readonly sourceText: string;

  constructor(course: Course) {
    this.courseId = course.id;
    this.authorId = course.authorId;
    this.title = course.title;
    this.sourceText = course.sourceText;
  }
}
