import { AIAdapter } from './adapter';

export class MockAdapter implements AIAdapter {
  async generateSummary(text: string, maxPoints = 5): Promise<string[]> {
    return Array.from({ length: maxPoints }).map((_, i) => `Mock summary point ${i + 1}`);
  }

  async generateQuizQuestions(text: string, count: number, type: 'mcq' | 'open' = 'mcq') {
    const questions: any[] = [];
    for (let i = 0; i < count; i++) {
      questions.push({ prompt: `Mock question ${i + 1}`, type, options: type === 'mcq' ? ['A', 'B', 'C', 'D'] : [] });
    }
    return questions;
  }
}

export default MockAdapter;
