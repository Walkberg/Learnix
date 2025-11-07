import { Injectable, Logger } from '@nestjs/common';
import {
  GenerativeModel,
  GoogleGenerativeAI,
  SchemaType,
  Schema,
} from '@google/generative-ai';
import { z } from 'zod';
import { AIAdapter, AiSummary, AiFlashCard } from './adapter';
import prompts from './prompts';

// Schémas Zod pour validation côté application
const summaryResponseSchema = z.object({
  title: z.string().default('Study Summary'),
  emoji: z.string().default('📝'),
  summary: z.string(),
});

const flashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const flashcardsResponseSchema = z.array(flashcardSchema);

const quizMCQQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  explanation: z.string(),
});

const quizOpenQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
});

const quizMCQResponseSchema = z.array(quizMCQQuestionSchema);
const quizOpenResponseSchema = z.array(quizOpenQuestionSchema);

// Types inférés
type SummaryResponse = z.infer<typeof summaryResponseSchema>;
type FlashcardsResponse = z.infer<typeof flashcardsResponseSchema>;
type QuizMCQResponse = z.infer<typeof quizMCQResponseSchema>;
type QuizOpenResponse = z.infer<typeof quizOpenResponseSchema>;

const summarySchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: 'The title of the summary',
      nullable: false,
    },
    emoji: {
      type: SchemaType.STRING,
      description: 'An emoji representing the content',
      nullable: false,
    },
    summary: {
      type: SchemaType.STRING,
      description: 'The summary text',
      nullable: false,
    },
  },
  required: ['title', 'emoji', 'summary'],
};

const flashcardsSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: {
        type: SchemaType.STRING,
        description: 'The question on the flashcard',
        nullable: false,
      },
      answer: {
        type: SchemaType.STRING,
        description: 'The answer to the question',
        nullable: false,
      },
    },
    required: ['question', 'answer'],
  },
};

const quizMCQSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: {
        type: SchemaType.STRING,
        description: 'The quiz question',
        nullable: false,
      },
      options: {
        type: SchemaType.ARRAY,
        description: 'Array of possible answers',
        items: {
          type: SchemaType.STRING,
        },
      },
      correctAnswer: {
        type: SchemaType.INTEGER,
        description: 'Index of the correct answer (0-based)',
        nullable: false,
      },
      explanation: {
        type: SchemaType.STRING,
        description: 'Short explanation of why this is the correct answer',
        nullable: false,
      },
    },
    required: ['question', 'options', 'correctAnswer', 'explanation'],
  },
};

const quizOpenSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: {
        type: SchemaType.STRING,
        description: 'The open-ended question',
        nullable: false,
      },
      answer: {
        type: SchemaType.STRING,
        description: 'The expected answer',
        nullable: false,
      },
      explanation: {
        type: SchemaType.STRING,
        description: 'Short explanation providing additional context',
        nullable: false,
      },
    },
    required: ['question', 'answer', 'explanation'],
  },
};

@Injectable()
export class GeminiAdapter implements AIAdapter {
  private readonly logger = new Logger(GeminiAdapter.name);
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  async generateSummary(content: string, maxPoints = 5): Promise<AiSummary> {
    try {
      const prompt = prompts.summaryPrompt(content, maxPoints);

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: summarySchema,
        },
      });

      const text = result.response.text();
      this.logger.debug(`Raw summary response: ${text}`);

      // Parse et valide avec Zod
      const parsed = summaryResponseSchema.parse(JSON.parse(text));

      return {
        title: parsed.title,
        emoji: parsed.emoji,
        summary: parsed.summary,
      };
    } catch (error) {
      this.logger.error('Failed to generate summary', error);

      return {
        title: 'Study Summary',
        emoji: '📝',
        summary: 'Unable to generate summary. Please try again.',
      };
    }
  }

  async generateFlashcards(
    content: string,
    count = 10,
  ): Promise<AiFlashCard[]> {
    try {
      const prompt = prompts.flashcardsPrompt(content, count);

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: flashcardsSchema,
        },
      });

      const text = result.response.text();
      this.logger.debug(`Raw flashcards response: ${text}`);

      // Parse et valide avec Zod
      const parsed = flashcardsResponseSchema.parse(JSON.parse(text));

      return parsed;
    } catch (error) {
      this.logger.error('Failed to generate flashcards', error);
      return [];
    }
  }

  async generateQuizQuestions(
    content: string,
    count: number,
    type: 'mcq' | 'open' = 'mcq',
  ): Promise<QuizMCQResponse | QuizOpenResponse> {
    try {
      const prompt = prompts.quizPrompt(content, count, type);

      const schema = type === 'mcq' ? quizMCQSchema : quizOpenSchema;
      const zodSchema =
        type === 'mcq' ? quizMCQResponseSchema : quizOpenResponseSchema;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const text = result.response.text();
      this.logger.debug(`Raw quiz response (${type}): ${text}`);

      // Parse et valide avec Zod
      const parsed = zodSchema.parse(JSON.parse(text));

      return parsed;
    } catch (error) {
      this.logger.error(`Failed to generate ${type} quiz questions`, error);
      return [];
    }
  }
}
