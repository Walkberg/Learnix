import { useNavigate } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import CourseCard from './CourseCard';

interface Course {
  id: string;
  title: string;
  emoji?: string;
  createdAt: string;
}

interface CoursesSectionProps {
  courses: Course[];
  maxDisplay?: number;
  onDelete: (id: string) => void;
}

const CoursesSection = ({ courses, maxDisplay = 6, onDelete }: CoursesSectionProps) => {
  const navigate = useNavigate();
  const displayedCourses = courses.slice(0, maxDisplay);

  const handleAddCourse = () => {
    navigate('/courses/new');
  };

  const handleViewAll = () => {
    navigate('/courses');
  };

  return (
    <section className="mb-8">
      <SectionHeader
        title="Mes cours"
        count={courses.length}
        actionLabel={courses.length > maxDisplay ? 'Voir tout' : 'Ajouter'}
        onAction={courses.length > maxDisplay ? handleViewAll : handleAddCourse}
      />
      {displayedCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4">Vous n'avez pas encore de cours</p>
          <button onClick={handleAddCourse} className="text-primary hover:underline font-medium">
            Créer votre premier cours
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCourses.map((course) => (
            <CourseCard key={course.id} course={course} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CoursesSection;
