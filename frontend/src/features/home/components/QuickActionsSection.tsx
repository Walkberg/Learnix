import { useNavigate } from 'react-router-dom';
import QuickActionCard from './QuickActionCard';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Générer une fiche',
      description:
        'Crée automatiquement des fiches de révision synthétiques à partir de ton cours.',
      icon: '📝',
      onClick: () => navigate('/courses/new'),
    },
    {
      title: 'Créer un quizz',
      description: 'Conçois des quizz interactifs pour tester et renforcer tes connaissances.',
      icon: '❓',
      onClick: () => {
        // TODO: Open quiz creation modal
        console.log('Open quiz creation modal');
      },
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
