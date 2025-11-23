import { useParams, Outlet } from 'react-router-dom';
import { CourseDetailHeader } from '../components/CourseDetailHeader';
import { CourseTabNavigation } from '../components/CourseTabNavigation';
import { useCourseDetail } from '../providers/courses-provider';
import QuizStatisticsPanel from '../../quizzes/components/QuizStatisticsPanel';
import { CourseQuizzesProvider } from '../../quizzes/providers/course-quizzes-provider';
import CourseQuizList from '../../quizzes/components/CourseQuizList';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChatQuickAction } from '@/features/chat/components/ChatQuickAction';
import { QuizzQuickAction } from '@/features/quizzes/components/QuizzQuickAction';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { courseDetail, isLoading, error, refresh } = useCourseDetail(courseId!);

  if (!courseId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">ID du cours manquant</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-[360px] w-full" />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-destructive mb-2">
            {error?.message || 'Cours introuvable'}
          </div>
          <div className="space-x-2">
            <Button onClick={() => void refresh()}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CourseQuizzesProvider courseId={courseId}>
      <div className="container mx-auto py-6 space-y-6">
        <CourseDetailHeader course={courseDetail} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Tab navigation and content (Summary or Flashcards) */}
          <div className="lg:col-span-2 space-y-4">
            <CourseTabNavigation courseId={courseId!} />
            <Outlet />
          </div>
          {/* Right panel - Quiz stats and list */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <QuizStatisticsPanel />
              <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuizzQuickAction courseId={courseId} />
                  <ChatQuickAction />
                </div>
              </section>
              <CourseQuizList />
            </div>
          </div>
        </div>
      </div>
    </CourseQuizzesProvider>
  );
}

export default CourseDetailPage;
