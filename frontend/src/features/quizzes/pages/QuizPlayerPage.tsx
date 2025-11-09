import { useParams } from 'react-router-dom';

export function QuizPlayerPage() {
  const { quizId } = useParams();
  return <div className="p-4">Playing quiz {quizId}</div>;
}

export default QuizPlayerPage;
