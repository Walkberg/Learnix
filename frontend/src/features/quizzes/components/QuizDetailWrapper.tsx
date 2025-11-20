import { useEffect } from 'react';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import QuizDetailProvider, { useQuizDetail } from '../providers/quiz-detail-provider';
//import { Spinner } from '@/components/ui/spinner';

export function InnerWrapper() {
  const { quiz, lastAttempt, isLoading, error } = useQuizDetail();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || error) return;
    // if quiz absent, do nothing (error view handled below)
    if (quiz) {
      if (lastAttempt) {
        navigate('results', { replace: true });
      } else {
        navigate('play', { replace: true });
      }
    }
  }, [quiz, lastAttempt, isLoading, error, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        {/* <Spinner /> */}
        ... loading quiz ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive font-medium">Error loading quiz</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  // When not loading and quiz is loaded, Outlet children will render (play/results)
  return <Outlet />;
}

export function QuizDetailWrapperRoute() {
  const params = useParams();
  const quizId = params.quizId || '';

  return (
    <QuizDetailProvider quizId={quizId}>
      <InnerWrapper />
    </QuizDetailProvider>
  );
}
