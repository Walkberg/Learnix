export interface AIAdapter {
  generateSummary(text: string, maxPoints?: number): Promise<string[]>;
  generateQuizQuestions(text: string, count: number, type?: 'mcq' | 'open'): Promise<any[]>;
}

export type AIResponse = {
  id?: string;
  data: any;
};

// Minimal contract for adapters. Implementations should throw on errors.
