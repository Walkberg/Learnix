export interface AttemptAnswerDto {
  questionId: string;
  answer: number | string;
}

export interface SubmitQuizAttemptRequestDto {
  answers: AttemptAnswerDto[];
}
