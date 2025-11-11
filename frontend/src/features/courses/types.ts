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

export interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
}

export interface QuizStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
}

export interface CourseDetail extends Course {
  flashcardStats?: FlashcardStats;
  quizStats?: QuizStats;
}

export interface CourseSummary {
  id: string;
  content: string;
}
