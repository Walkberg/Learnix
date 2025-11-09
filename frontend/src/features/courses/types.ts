// Frontend model for Course (unified; ensure single interface export)
export interface Course {
  id: string;
  title: string;
  emoji?: string;
  sourceText?: string; // Optional in list contexts
  authorId?: string; // Optional if not returned by list endpoint
  createdAt: string; // ISO string (may be synthesized if backend omits temporarily)
}

export interface CreateCourseDto {
  title: string;
  emoji?: string;
  sourceText: string;
}
