import QuickActionCard from '@/features/home/components/QuickActionCard';

import { useQuizCreate } from '../providers/quiz-create-provider';

export function QuizzQuickAction({ courseId }: { courseId?: string }) {
  const { openDialog: openQuizDialog } = useQuizCreate();

  return (
    <QuickActionCard
      title="Créer un quizz"
      description="Conçois des quizz interactifs pour tester et renforcer tes connaissances."
      icon="❓"
      onClick={() => openQuizDialog(courseId)}
    />
  );
}
