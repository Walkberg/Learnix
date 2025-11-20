import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Quiz } from '../types';
import { QuizStatusBadge } from './QuizStatusBadge';
import { CircularProgress } from '@/components/CircularProgress';

interface Props {
  quiz: Quiz;
  onClick: (quizId: string) => Promise<void>;
}

export function CourseQuizItem({ quiz, onClick }: Props) {
  const score = quiz.lastAttemptSummary?.score ?? null;
  return (
    <Card onClick={() => void onClick(quiz.id)}>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="font-medium">{quiz.courseTitle || 'Quizz'}</div>
            <div className="text-sm text-muted-foreground">
              Créé le {new Date(quiz.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <QuizStatusBadge score={score} />
          <div className="min-w-[48px]">
            <CircularProgress value={score ?? 0} showEmpty={!score && score !== 0} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CourseQuizItem;
