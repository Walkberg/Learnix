export interface QuizParams {
  count: number;
  types: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'OPEN';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export class Quiz {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public readonly params: QuizParams,
    public readonly questions: QuizQuestion[],
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(params: {
    id?: string;
    courseId: string;
    params: QuizParams;
    questions: QuizQuestion[];
  }) {
    return new Quiz(
      params.id || crypto.randomUUID(),
      params.courseId,
      params.params,
      params.questions,
    );
  }
}
