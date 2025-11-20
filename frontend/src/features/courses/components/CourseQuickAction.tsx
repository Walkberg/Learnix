import QuickActionCard from '@/features/home/components/QuickActionCard';

import { useCourseCreate } from '../providers/course-create-provider';

export function CourseQuickAction() {
  const { openDialog: openCourseDialog } = useCourseCreate();

  return (
    <QuickActionCard
      title="Générer une fiche"
      description="Crée automatiquement des fiches de révision synthétiques à partir de ton cours."
      icon="📝"
      onClick={() => openCourseDialog()}
    />
  );
}
