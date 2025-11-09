import { useParams } from 'react-router-dom';

export function QuizResultsPage() {
  const { quizId } = useParams();
  return <div className="p-4">Results for quiz {quizId}</div>;
}

export default QuizResultsPage;
