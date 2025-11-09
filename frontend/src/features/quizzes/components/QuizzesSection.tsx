import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import QuizCard from './QuizCard';

interface Quiz {
  id: string;
  courseTitle: string;
  lastAttemptSummary?: {
    score: number;
    totalQuestions: number;
    attemptedAt: string;
  };
}

interface QuizzesSectionProps {
  quizzes: Quiz[];
  maxDisplay?: number;
  onDelete: (id: string) => void;
}

const QuizzesSection = ({ quizzes, maxDisplay = 6, onDelete }: QuizzesSectionProps) => {
  const navigate = useNavigate();
  const displayedQuizzes = quizzes.slice(0, maxDisplay);

  const handleAddQuiz = () => {
    // TODO: Open quiz creation modal
    console.log('Open quiz creation modal');
  };

  return (
    <section className="mb-8">
      {displayedQuizzes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4">Vous n'avez pas encore de quiz</p>
          <button onClick={handleAddQuiz} className="text-primary hover:underline font-medium">
            Créer votre premier quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
};

export default QuizzesSection;
