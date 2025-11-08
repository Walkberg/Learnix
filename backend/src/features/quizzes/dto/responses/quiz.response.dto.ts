export interface MCQQuestionDto {
  id: string;
  type: 'MCQ';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface OpenQuestionDto {
  id: string;
  type: 'OPEN';
  question: string;
  correctAnswer: string;
  explanation: string;
}

export type QuizQuestionDto = MCQQuestionDto | OpenQuestionDto;

export interface QuizResponseDto {
  id: string;
  courseId: string;
  params: {
    count: number;
    types: string[];
  };
  questions: QuizQuestionDto[];
  createdAt: Date;
  lastAttemptSummary?: {
    attemptId: string;
    score: number;
    submittedAt: Date;
  } | null;
}
