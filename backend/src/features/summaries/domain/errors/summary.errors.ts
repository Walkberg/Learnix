export class SummaryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SummaryNotFoundError extends SummaryError {
  constructor(summaryId: string) {
    super(`Summary with id ${summaryId} not found`);
  }
}
