import { AIAdapter, AiSummary } from './adapter';

export class MockAdapter implements AIAdapter {
  private mockResponses: {
    summary?: AiSummary | string[];
    quiz?: any[];
  } = {};

  setMockResponses(responses: {
    summary?: AiSummary | string[];
    quiz?: any[];
  }) {
    this.mockResponses = responses;
  }

  async generateSummary(text: string, maxPoints = 5): Promise<AiSummary> {
    if (this.mockResponses.summary) {
      const s = this.mockResponses.summary;
      if (Array.isArray(s)) {
        return {
          title: 'Mock Summary Title',
          emoji: '📝',
          summary: s.join('\n'),
        };
      }
      return s;
    }
    return {
      title: 'Mock Summary Title',
      emoji: '📝',
      summary: `This is a mock summary generated for the text: ${text}. It contains ${maxPoints} key points.`,
    };
  }

  async generateQuizQuestions(
    text: string,
    count: number,
    type: 'mcq' | 'open' = 'mcq',
  ) {
    if (this.mockResponses.quiz) {
      return this.mockResponses.quiz;
    }
    const questions: any[] = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        prompt: `Mock question ${i + 1}`,
        type,
        options: type === 'mcq' ? ['A', 'B', 'C', 'D'] : [],
      });
    }
    return questions;
  }

  generateFlashcards(
    text: string,
    count: number,
  ): Promise<{ question: string; answer: string }[]> {
    return Promise.resolve([]);
  }
}

export default MockAdapter;
