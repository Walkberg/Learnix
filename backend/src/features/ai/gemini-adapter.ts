import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAdapter, AiSummary } from './adapter';

@Injectable()
export class GeminiAdapter implements AIAdapter {
  private model: any;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateSummary(
    content: string,
    maxPoints?: number,
  ): Promise<AiSummary> {
    const pointCount = maxPoints || 10;
    const prompt = `Create a comprehensive study sheet summary from the following content. 
    Include exactly ${pointCount} key points, with concepts, definitions, and important information.
    Format each point as a separate line starting with a bullet point (*).
    Content: ${content}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return {
      title: 'Mock Summary Title',
      emoji: '📝',
      summary: `This is a mock summary generated for the text: ${content}. It contains ${pointCount} key points.`,
    };
  }

  async generateFlashcards(
    content: string,
    count: number = 10,
  ): Promise<Array<{ question: string; answer: string }>> {
    const prompt = `Create ${count} flashcards from the following content. 
    Each flashcard should have a question and answer that tests understanding of key concepts.
    Format as JSON array with "question" and "answer" fields. Content: ${content}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const parsedResponse = JSON.parse(response.text());
    return parsedResponse;
  }

  async generateQuizQuestions(
    text: string,
    count: number,
    type: 'mcq' | 'open' = 'mcq',
  ): Promise<any[]> {
    const prompt =
      type === 'mcq'
        ? `Create a multiple choice quiz with ${count} questions from the following content. 
         Each question should have 4 options with one correct answer.
         Format as JSON array with "question", "options" (array), and "correctAnswer" fields. Content: ${text}`
        : `Create ${count} open-ended quiz questions from the following content.
         Format as JSON array with "question" and "answer" fields. Content: ${text}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const parsedResponse = JSON.parse(response.text());
    return parsedResponse;
  }
}
