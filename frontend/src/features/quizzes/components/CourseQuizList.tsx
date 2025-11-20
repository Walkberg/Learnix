import { useNavigate } from 'react-router-dom';
import { useCourseQuizzes } from '../providers/course-quizzes-provider';
import { Skeleton } from '@/components/ui/skeleton';
import CourseQuizItem from './CourseQuizItem';
import { PageHeader } from '@/components/PageHeader';

export function CourseQuizList() {
  const { quizzes, isLoading, error } = useCourseQuizzes();
  const navigate = useNavigate();

  if (isLoading && quizzes.length === 0) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Erreur: {error.message}</div>;
  }

  if (!quizzes || quizzes.length === 0) {
    return <div className="text-muted-foreground">Aucun quizz pour ce cours</div>;
  }

  return (
    <div className="space-y-3">
      <PageHeader title="Mes cours" count={quizzes.length} />
      {quizzes.map((q) => (
        <CourseQuizItem
          key={q.id}
          quiz={q}
          onClick={async (id) => {
            try {
              navigate(`/quizzes/${id}`);
            } catch (e) {
              console.error(e);
            }
          }}
        />
      ))}
    </div>
  );
}

export default CourseQuizList;
