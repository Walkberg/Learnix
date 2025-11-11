import QuizCard from './QuizCard';
import type { Quiz } from '../types';

interface QuizGridProps {
  quizzes: Quiz[];
  onDeleteQuiz: (id: string) => void;
}

export const QuizGrid = ({ quizzes, onDeleteQuiz }: QuizGridProps) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Aucun quiz trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} onDelete={onDeleteQuiz} />
      ))}
    </div>
  );
};

export default QuizGrid;
