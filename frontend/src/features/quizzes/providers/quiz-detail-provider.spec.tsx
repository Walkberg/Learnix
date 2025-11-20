import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import QuizDetailProvider, { useQuizDetail } from './quiz-detail-provider';
import api from '@/app/api';

jest.mock('@/app/api');

describe('QuizDetailProvider', () => {
  it('fetches quiz and exposes data', async () => {
    const mocked = api as jest.Mocked<typeof api>;
    mocked.get.mockResolvedValueOnce({
      data: { id: 'q1', courseId: 'c1', courseTitle: 'C1', createdAt: new Date().toISOString() },
    });

    const wrapper = ({ children }: any) => (
      <QuizDetailProvider quizId="q1">{children}</QuizDetailProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useQuizDetail(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.quiz).not.toBeNull();
  });
});
