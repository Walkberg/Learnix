import { useNavigate } from 'react-router-dom';
import QuickActionCard from './QuickActionCard';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Générer une fiche',
      description: 'Créer une nouvelle fiche de révision',
      icon: '📝',
      onClick: () => navigate('/courses/new'),
    },
    {
      title: 'Créer un quizz',
      description: "Générer un quizz d'entraînement",
      icon: '❓',
      onClick: () => {
        // TODO: Open quiz creation modal
        console.log('Open quiz creation modal');
      },
    },
    {
      title: 'Réviser avec Learnix',
      description: "Discuter avec l'IA pour réviser",
      icon: '💬',
      onClick: () => navigate('/chat'),
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;
