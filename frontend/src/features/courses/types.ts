// Course types
export interface Course {
  id: string;
  title: string;
  emoji?: string;
  sourceText: string;
  authorId: string;
  createdAt: string;
}

export interface CreateCourseDto {
  title: string;
  emoji?: string;
  sourceText: string;
}
