import { useQuizDetail } from '../providers/quiz-detail-provider';
import { QuizAttemptProvider, useQuizAttempt } from '../providers/quiz-attempt-provider';
import { ProgressSquares } from '../components/ProgressSquares';
import AnswerGrid from '../components/AnswerGrid';
import Verdict from '../components/Verdict';
import { Button } from '@/components/ui/button';

function PlayerInner() {
  const { questions, current, goNext, answers } = useQuizAttempt();
  const q = questions[current];
  const total = questions.length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <ProgressSquares />
      </div>

      <div>
        <div className="mb-2 text-sm text-muted-foreground">
          Question {current + 1} / {total}
        </div>
        <div className="rounded-lg bg-card">
          <p className="text-xl font-bold">{q?.question ?? 'Question not available'}</p>
        </div>
      </div>
      <Verdict />
      <AnswerGrid />
      <div className="flex items-center justify-center pt-4">
        <Button
          className="btn btn-primary"
          onClick={goNext}
          disabled={
            answers[current]?.selected == null &&
            !(answers[current]?.openText && answers[current]?.openText.length > 0)
          }
        >
          {current + 1 >= total ? 'Terminer' : 'Question suivante'}
        </Button>
      </div>
    </div>
  );
}

export function QuizPlayerPage() {
  const { quiz } = useQuizDetail();

  if (!quiz) return <div className="p-4">Loading quiz…</div>;

  return (
    <QuizAttemptProvider>
      <PlayerInner />
    </QuizAttemptProvider>
  );
}
