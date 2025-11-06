export class Course {
  constructor(
    public readonly id: string,
    public readonly authorId: string,
    public readonly title: string,
    public readonly sourceText: string,
    public readonly emoji: string | null,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(params: {
    id?: string;
    authorId: string;
    title: string;
    sourceText: string;
    emoji?: string | null;
  }) {
    return new Course(
      params.id || crypto.randomUUID(),
      params.authorId,
      params.title,
      params.sourceText,
      params.emoji ?? null,
    );
  }
}
