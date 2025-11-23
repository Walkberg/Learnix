import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizDetail } from './quiz-detail-provider';
import { useQuizApi } from './quiz-api-provider';
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
  submitting: boolean;
}

const QuizAttemptContext = createContext<QuizAttemptContextValue | undefined>(undefined);

export function QuizAttemptProvider({ children }: { children: ReactNode }) {
  const { quiz, setSummary } = useQuizDetail();

  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [submitting, setSubmitting] = useState(false);
  const quizApi = useQuizApi();

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

  const goNext = async () => {
    if (current + 1 >= total) {
      if (!quiz) return;
      try {
        setSubmitting(true);
        const payload: { questionId: string; answer: number | string }[] = [];
        for (const [idxStr, st] of Object.entries(answers)) {
          const idx = Number(idxStr);
          const currentQuestion = questions[idx];
          if (!currentQuestion) continue;
          if (st.selected != null) {
            payload.push({ questionId: currentQuestion.id, answer: st.selected });
          } else if (st.openText != null) {
            payload.push({ questionId: currentQuestion.id, answer: st.openText });
          }
        }

        const summary = await quizApi.startAttempt(quiz.id, payload);
        setSummary({ ...summary, answers: payload });
        //navigate(`/quizzes/${quiz.id}/results`);
      } catch (e) {
      } finally {
        setSubmitting(false);
      }

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
      submitting,
    }),
    [current, total, questions, answers, submitting]
  );

  return <QuizAttemptContext.Provider value={value}>{children}</QuizAttemptContext.Provider>;
}

export function useQuizAttempt() {
  const ctx = useContext(QuizAttemptContext);
  if (!ctx) throw new Error('useQuizAttempt must be used within QuizAttemptProvider');
  return ctx;
}
