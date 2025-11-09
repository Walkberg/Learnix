import QuickActionsSection from '../components/QuickActionsSection';
import CoursesSection from '@/features/courses/components/CoursesSection';
import QuizzesSection from '@/features/quizzes/components/QuizzesSection';
import { useCourses } from '@/features/courses/providers/courses-provider';
import { useQuizzes } from '@/features/quizzes/providers/quizzes-provider';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const { courses, deleteCourse } = useCourses();
  const { quizzes, deleteQuiz } = useQuizzes();

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1>Hey walkberg! 👋</h1>

      <QuickActionsSection />
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Mes cours</h2>
        <Button>Créer un cours</Button>
      </div>
      <CoursesSection courses={courses} maxDisplay={3} onDelete={deleteCourse} />
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Mes quizz</h2>
        <Button>Créer un quizz</Button>
      </div>
      <QuizzesSection quizzes={quizzes} maxDisplay={3} onDelete={deleteQuiz} />
    </div>
  );
}
