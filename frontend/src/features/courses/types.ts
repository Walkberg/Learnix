export type LanguageId = 'fr' | 'en' | 'es' | 'de' | 'it';

export interface LanguageOption {
  id: LanguageId; // e.g. 'fr'
  label: string; // e.g. 'Français'
}

export interface CourseCreateFormData {
  sourceType: 'text' | 'photo' | 'document';
  language: LanguageOption;
  sourceText: string;
}

export interface Course {
  id: string;
  title: string;
  emoji?: string;
  sourceText?: string;
  authorId?: string;
  createdAt: string;
}

export interface CreateCourseDto {
  title: string;
  emoji?: string;
  sourceText: string;
}
