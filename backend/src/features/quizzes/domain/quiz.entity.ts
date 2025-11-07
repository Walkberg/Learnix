export interface QuizParams {
  count: number;
  types: string[];
}

export interface MCQQuestion {
  id: string;
  type: 'MCQ';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface OpenQuestion {
  id: string;
  type: 'OPEN';
  question: string;
  correctAnswer: string;
  explanation: string;
}

export type QuizQuestion = MCQQuestion | OpenQuestion;

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
