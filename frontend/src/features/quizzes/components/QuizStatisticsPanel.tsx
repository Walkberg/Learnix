// hooks not required directly; component uses course-scoped provider hook
import { StatCard } from '@/components/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourseQuizzes } from '../providers/course-quizzes-provider';

export function QuizStatisticsPanel() {
  const { stats, isLoading } = useCourseQuizzes();

  if (isLoading && !stats) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-muted-foreground">Aucune statistique de quizz disponible</div>;
  }

  return (
    <div className="flex flex-row space-y-3 items-center justify-between">
      <StatCard
        title="Score moyen au quizz"
        value={`${(Math.round(stats.averageScore) / 100) * 20}/20`}
      />
      <StatCard title="Total de quizz" value={stats.totalQuizzes} />
    </div>
  );
}

export default QuizStatisticsPanel;
