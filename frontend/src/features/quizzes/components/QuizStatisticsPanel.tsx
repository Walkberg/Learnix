// hooks not required directly; component uses course-scoped provider hook
import { useParams } from 'react-router-dom';
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
    <div className="space-y-3">
      <StatCard
        title="Score moyen au quizz"
        value={`${Math.round(stats.averageScore)}%`}
        subtitle={`${stats.quizzesCompleted} quizz réalisés`}
      />
      <StatCard title="Total de quizz" value={stats.totalQuizzes} />
    </div>
  );
}

export default QuizStatisticsPanel;
