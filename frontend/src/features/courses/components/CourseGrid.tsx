import CourseCard from './CourseCard';

interface Course {
  id: string;
  title: string;
  emoji?: string;
  createdAt: string;
}

interface CourseGridProps {
  courses: Course[];
  onDeleteCourse: (id: string) => void;
}

export const CourseGrid = ({ courses, onDeleteCourse }: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Aucun cours trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onDelete={onDeleteCourse} />
      ))}
    </div>
  );
};

export default CourseGrid;
