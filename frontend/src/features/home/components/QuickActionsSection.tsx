import { useNavigate } from 'react-router-dom';
import QuickActionCard from './QuickActionCard';
import { useCourseCreate } from '../../courses/providers/course-create-provider';
import { useQuizCreate } from '../../quizzes/providers/quiz-create-provider';

const QuickActionsSection = () => {
  const navigate = useNavigate();
  const { openDialog: openCourseDialog } = useCourseCreate();
  const { openDialog: openQuizDialog } = useQuizCreate();

  const actions = [
    {
      title: 'Générer une fiche',
      description:
        'Crée automatiquement des fiches de révision synthétiques à partir de ton cours.',
      icon: '📝',
      onClick: () => openCourseDialog(),
    },
    {
      title: 'Créer un quizz',
      description: 'Conçois des quizz interactifs pour tester et renforcer tes connaissances.',
      icon: '❓',
      onClick: () => openQuizDialog(),
    },
    {
      title: 'Réviser avec Learnix',
      description:
        'Discute avec ton coach IA pour clarifier tes notions et consolider tes apprentissages.',
      icon: '💬',
      onClick: () => navigate('/chat'),
    },
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;
