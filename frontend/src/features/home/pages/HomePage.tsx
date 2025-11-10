import QuickActionsSection from '../components/QuickActionsSection';
import QuizzesSection from '@/features/quizzes/components/QuizzesSection';
import { useCourses } from '@/features/courses/providers/courses-provider';
import { useQuizzes } from '@/features/quizzes/providers/quizzes-provider';
import { Button } from '@/components/ui/button';
import { useQuizCreate } from '@/features/quizzes/providers/quiz-create-provider';
import { useCourseCreate } from '@/features/courses/providers/course-create-provider';
import { PageSectionTitle } from '@/components/PageSectionTitle';
import CourseGrid from '@/features/courses/components/CourseGrid';

export function HomePage() {
  const { courses, deleteCourse } = useCourses();
  const { quizzes, deleteQuiz } = useQuizzes();
  const { openDialog: openQuizDialog } = useQuizCreate();
  const { openDialog: openCourseDialog } = useCourseCreate();

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="mb-7 text-3xl font-bold">Hey walkberg! 👋</h1>
      <QuickActionsSection />
      <div className="flex flex-row items-center justify-between">
        <PageSectionTitle>Mes cours</PageSectionTitle>
        <Button onClick={openCourseDialog}>Créer un cours</Button>
      </div>
      <CourseGrid courses={courses} onDeleteCourse={deleteCourse} />
      <div className="flex flex-row items-center justify-between">
        <PageSectionTitle>Mes quizz</PageSectionTitle>
        <Button onClick={() => openQuizDialog()}>Créer un quizz</Button>
      </div>
      <QuizzesSection quizzes={quizzes} maxDisplay={3} onDelete={deleteQuiz} />
    </div>
  );
}
