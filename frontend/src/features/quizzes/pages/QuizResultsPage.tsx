import { useQuizDetail } from '../providers/quiz-detail-provider';
import ResultsHeader from '../components/ResultsHeader';
import QuestionReview from '../components/QuestionReview';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function QuizResultsPage() {
  const { quiz, lastAttempt } = useQuizDetail();
  const navigate = useNavigate();

  if (!quiz) return <div className="p-8">Quiz not found.</div>;

  if (!lastAttempt)
    return (
      <div className="p-8">
        <p>No attempt found for this quiz.</p>
      </div>
    );

  return (
    <div className="p-6">
      <ResultsHeader quiz={quiz} score={lastAttempt.score} />
      <div className="flex flex-row justify-center items-center gap-4 m-8">
        <Button onClick={() => navigate('/')} variant={'secondary'}>
          Retour à l'accueil
        </Button>
        <Button onClick={() => navigate(`/quizzes/${quiz.id}/play`)}>Rejouer le quizz</Button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Correction</div>
        </div>
        <div className="space-y-3">
          {(quiz.questions ?? []).map((q) => (
            <QuestionReview
              key={q.id}
              question={q}
              userAnswer={lastAttempt.answers.find((a) => a.questionId === q.id)?.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
