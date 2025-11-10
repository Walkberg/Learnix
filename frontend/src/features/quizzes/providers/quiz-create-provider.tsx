import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { QuizCreateFormData } from '../types';
import { quizCreateSchema } from '../schemas/quiz-create.schema';
import type { QuizApi } from '../api/quiz-api.interface';
import { HttpQuizApi } from '../api/quiz-api.http';

const defaultFormData: QuizCreateFormData = {};

export type QuizzType = 'MCQ' | 'OPEN' | 'FILL_BLANK';

export type MCQType = 'duo' | 'trio' | 'square';

interface ExerciseTypeOption {
  key: QuizzType;
  icon: string;
  label: string;
  disabled: boolean;
}

interface AnswerCountOption {
  key: MCQType;
  icon: string;
  label: string;
}

const exerciseTypeOptions: ExerciseTypeOption[] = [
  { key: 'MCQ', icon: '📝', label: 'QCM', disabled: false },
  { key: 'OPEN', icon: '✍️', label: 'Réponse ouverte', disabled: false },
  { key: 'FILL_BLANK', icon: '📄', label: 'Texte à trou', disabled: true },
];

const answerCountOptions: AnswerCountOption[] = [
  { key: 'duo', icon: '2️⃣', label: 'Duo' },
  { key: 'trio', icon: '3️⃣', label: 'Trio' },
  { key: 'square', icon: '4️⃣', label: 'Carré' },
];

type FormStep = 'course' | 'questions';

interface QuizCreateContextValue {
  isOpen: boolean;
  currentStep: FormStep;
  formData: QuizCreateFormData;
  exerciseTypeOptions: ExerciseTypeOption[];
  answerCountOptions: AnswerCountOption[];
  openDialog: (courseId?: string) => void;
  closeDialog: () => void;
  setStep: (step: FormStep) => void;
  updateFormData: (data: Partial<QuizCreateFormData>) => void;
  submitQuiz: () => Promise<void>;
}

const QuizCreateContext = createContext<QuizCreateContextValue | undefined>(undefined);

export const QuizzCreateProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('course');
  const [formData, setFormData] = useState<QuizCreateFormData>(defaultFormData);

  const quizApi: QuizApi = useMemo(() => new HttpQuizApi(), []);

  const openDialog = (courseId?: string) => {
    setIsOpen(true);
    if (courseId) {
      setFormData((prev) => ({ ...prev, courseId }));
      setCurrentStep('questions');
    } else {
      setCurrentStep('course');
      setFormData(defaultFormData);
    }
  };
  const closeDialog = () => {
    setIsOpen(false);
    setCurrentStep('course');
    setFormData(defaultFormData);
  };
  const setStep = (step: FormStep) => setCurrentStep(step);
  const updateFormData = (data: Partial<QuizCreateFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const submitQuiz = async () => {
    console.log('Submitting quiz with data:', formData);
    const result = quizCreateSchema.safeParse(formData);

    if (!result.success) {
      throw new Error('Validation failed');
    }
    try {
      await quizApi.generate(result.data.courseId!, {
        count: result.data.answerCount === 'duo' ? 2 : result.data.answerCount === 'trio' ? 3 : 4,
        type: result.data.exerciseType === 'OPEN' ? 'OPEN' : 'MCQ',
      });
      closeDialog();
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    }
  };

  return (
    <QuizCreateContext.Provider
      value={{
        isOpen,
        currentStep,
        formData,
        exerciseTypeOptions,
        answerCountOptions,
        openDialog,
        closeDialog,
        setStep,
        updateFormData,
        submitQuiz,
      }}
    >
      {children}
    </QuizCreateContext.Provider>
  );
};

export const useQuizCreate = () => {
  const ctx = useContext(QuizCreateContext);
  if (!ctx) throw new Error('useQuizCreate must be used within QuizzCreateProvider');
  return ctx;
};
