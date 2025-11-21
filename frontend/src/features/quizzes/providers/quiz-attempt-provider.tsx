import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizDetail } from './quiz-detail-provider';
import type { QuizQuestion, QuizQuestionMCQ } from '../types';

export type AnswerState = {
  selected: number | null;
  correct: boolean | null;
  openText?: string;
};

interface QuizAttemptContextValue {
  current: number;
  total: number;
  questions: QuizQuestion[];
  answers: Record<number, AnswerState>;
  handleSelectOption: (optIndex: number) => void;
  setOpenAnswer: (text: string) => void;
  goNext: () => void;
}

const QuizAttemptContext = createContext<QuizAttemptContextValue | undefined>(undefined);

export function QuizAttemptProvider({ children }: { children: ReactNode }) {
  const { quiz } = useQuizDetail();
  const navigate = useNavigate();

  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  const handleSelectOption = (optIndex: number) => {
    const currentQuestion = questions[current];

    if (!currentQuestion) return;

    if ((currentQuestion as QuizQuestionMCQ).type !== 'MCQ') return;

    const mcq = currentQuestion as QuizQuestionMCQ;
    const correct = optIndex === mcq.correctAnswer;
    setAnswers((s) => ({ ...s, [current]: { selected: optIndex, correct } }));
  };

  const setOpenAnswer = (text: string) => {
    setAnswers((s) => ({ ...s, [current]: { selected: null, correct: null, openText: text } }));
  };

  const goNext = () => {
    if (current + 1 >= total) {
      navigate('results');
      return;
    }
    setCurrent((c) => c + 1);
  };

  const value = useMemo(
    () => ({
      current,
      total,
      questions,
      answers,
      handleSelectOption,
      setOpenAnswer,
      goNext,
    }),
    [current, total, questions, answers]
  );

  return <QuizAttemptContext.Provider value={value}>{children}</QuizAttemptContext.Provider>;
}

export function useQuizAttempt() {
  const ctx = useContext(QuizAttemptContext);
  if (!ctx) throw new Error('useQuizAttempt must be used within QuizAttemptProvider');
  return ctx;
}
