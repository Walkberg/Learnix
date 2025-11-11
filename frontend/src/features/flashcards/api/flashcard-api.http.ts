import api from '@/app/api';
import type { AxiosInstance } from 'axios';
import type { Flashcard, CreateFlashcardInput, UpdateFlashcardInput } from '../types';
import type { FlashcardApi } from './flashcard-api.interface';

// Backend DTOs (local to API impl)
interface FlashcardDto {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardListDto {
  items: FlashcardDto[];
}

function dtoToModel(dto: FlashcardDto): Flashcard {
  return {
    id: dto.id,
    courseId: '', // courseId not returned by backend, will be set by provider
    question: dto.question,
    answer: dto.answer,
    createdAt: new Date().toISOString(), // Backend doesn't expose createdAt; synthesize for now
  };
}

export class HttpFlashcardApi implements FlashcardApi {
  private http: AxiosInstance;

  constructor(http?: AxiosInstance) {
    this.http = http ?? api;
  }

  async getFlashcardsByCourse(courseId: string): Promise<Flashcard[]> {
    const res = await this.http.get<FlashcardListDto>(`/courses/${courseId}/flashcards`);
    return res.data.items.map((dto) => ({
      ...dtoToModel(dto),
      courseId, // Set courseId from parameter
    }));
  }

  async createFlashcard(courseId: string, input: CreateFlashcardInput): Promise<Flashcard> {
    const res = await this.http.post<FlashcardDto>(`/courses/${courseId}/flashcards`, input);
    return {
      ...dtoToModel(res.data),
      courseId,
    };
  }

  async updateFlashcard(flashcardId: string, input: UpdateFlashcardInput): Promise<Flashcard> {
    const res = await this.http.patch<FlashcardDto>(`/flashcards/${flashcardId}`, input);
    return dtoToModel(res.data);
  }

  async deleteFlashcard(courseId: string, flashcardId: string): Promise<void> {
    await this.http.delete(`/courses/${courseId}/flashcards/${flashcardId}`);
  }
}
