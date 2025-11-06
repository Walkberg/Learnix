export class Flashcard {
  constructor(
    public readonly id: string | null,
    public readonly courseId: string,
    public readonly question: string,
    public readonly answer: string,
  ) {}

  static create(params: {
    id?: string;
    courseId: string;
    question: string;
    answer: string;
  }): Flashcard {
    return new Flashcard(
      params.id ?? null,
      params.courseId,
      params.question,
      params.answer,
    );
  }
}
