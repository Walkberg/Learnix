export class StudySheet {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public readonly summary: string,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    id?: string;
    courseId: string;
    summary: string;
  }): StudySheet {
    return new StudySheet(
      params.id || crypto.randomUUID(),
      params.courseId,
      params.summary,
      new Date(),
    );
  }
}
