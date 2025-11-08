export interface QuizAttemptResponseDto {
  attemptId: string;
  quizId: string;
  userId: string;
  score: number;
  submittedAt: Date;
}
