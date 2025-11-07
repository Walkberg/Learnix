export interface QuizQuestionDto {
  id: string;
  type: 'MCQ' | 'OPEN';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizResponseDto {
  id: string;
  courseId: string;
  params: {
    count: number;
    types: string[];
  };
  questions: QuizQuestionDto[];
  createdAt: Date;
}
