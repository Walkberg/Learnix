import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { CourseDetailHeader } from '../components/CourseDetailHeader';
import { CourseTabNavigation } from '../components/CourseTabNavigation';
import { useCourseDetail } from '../providers/courses-provider';
import QuizStatisticsPanel from '../../quizzes/components/QuizStatisticsPanel';
import { CourseQuizzesProvider } from '../../quizzes/providers/course-quizzes-provider';
import CourseQuizList from '../../quizzes/components/CourseQuizList';
import { useQuizCreate } from '@/features/quizzes/providers/quiz-create-provider';
import QuickActionsSection from '@/features/home/components/QuickActionsSection';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { courseDetail, isLoading, error } = useCourseDetail(courseId!);

  const { openDialog: openQuizDialog } = useQuizCreate();
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Créer un quizz',
      description: 'Conçois des quizz interactifs pour tester et renforcer tes connaissances.',
      icon: '❓',
      onClick: () => openQuizDialog(courseId),
    },
    {
      title: 'Réviser avec Learnix',
      description:
        'Discute avec ton coach IA pour clarifier tes notions et consolider tes apprentissages.',
      icon: '💬',
      onClick: () => navigate('/chat'),
    },
  ];

  if (!courseId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">ID du cours manquant</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error || !courseDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">{error?.message || 'Cours introuvable'}</div>
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
              <QuickActionsSection actions={actions} />
              <CourseQuizList />
            </div>
          </div>
        </div>
      </div>
    </CourseQuizzesProvider>
  );
}

export default CourseDetailPage;
