export type AiFlashCard = { question: string; answer: string };

export type AiSummary = {
  title: string;
  emoji: string;
  summary: string;
};

export interface AIAdapter {
  generateSummary(text: string, maxPoints?: number): Promise<AiSummary>;
  generateFlashcards(text: string, count: number): Promise<AiFlashCard[]>;
  generateQuizQuestions(
    text: string,
    count: number,
    type?: 'mcq' | 'open',
  ): Promise<any[]>;
}
