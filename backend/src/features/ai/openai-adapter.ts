import { AIAdapter } from './adapter';

const OPENAI_API = process.env.OPENAI_API_KEY;

export class OpenAIAdapter implements AIAdapter {
  async generateSummary(text: string, maxPoints = 5): Promise<string[]> {
    // Minimal placeholder implementation — replace with real OpenAI calls
    // For now, return the first N sentences as bullets
    const bullets = text
      .split(/(?<=\.|\?|!)\s+/)
      .slice(0, maxPoints)
      .map((s) => s.trim());
    return bullets;
  }

  async generateQuizQuestions(
    text: string,
    count: number,
    type: 'mcq' | 'open' = 'mcq',
  ) {
    // Placeholder simple split-based questions
    const sentences = text.split(/(?<=\.|\?|!)\s+/).filter(Boolean);
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
      const prompt = sentences[i % sentences.length] || `Question ${i + 1}`;
      questions.push({
        prompt,
        type,
        options: type === 'mcq' ? ['A', 'B', 'C', 'D'] : [],
      });
    }
    return questions;
  }
}

export default OpenAIAdapter;

export type Question = {
  prompt: string;

  type: 'mcq' | 'open';
  options: string[];
};
