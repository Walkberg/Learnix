import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useQuizCreate } from '../providers/quiz-create-provider';
import { StepIndicator } from '@/common/components/StepIndicator';
import { CoursePicker } from '../../courses/components/CoursePicker';
import { ExerciseTypeCards } from './ExerciseTypeCards';
import { AnswerCountCards } from './AnswerCountCards';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

export const QuizzCreationDialog = () => {
  const { isOpen, closeDialog, currentStep, setStep, formData, updateFormData, submitQuiz } =
    useQuizCreate();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogHeader>Créer un quizz</DialogHeader>
      <DialogContent>
        <StepIndicator currentStep={currentStep === 'course' ? 1 : 2} totalSteps={2} />
        {currentStep === 'course' ? (
          <>
            <DialogTitle>Sur quel cours veux-tu générer un quizz ?</DialogTitle>
            <CoursePicker
              onSelect={(id) => {
                updateFormData({ courseId: id });
                setStep('questions');
              }}
            />
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setStep('course')}>
              ← Retour
            </Button>
            <DialogTitle>Personnalise ton quizz</DialogTitle>
            <ExerciseTypeCards
              value={formData.exerciseType}
              onChange={(v) => updateFormData({ exerciseType: v })}
            />
            <AnswerCountCards
              value={formData.answerCount}
              onChange={(v) => updateFormData({ answerCount: v })}
            />
            <Button onClick={submitQuiz} disabled={!formData.exerciseType || !formData.answerCount}>
              Créer le quizz
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
