import { useCourseCreate } from '@/features/courses/providers/course-create-provider';
import { useCourses } from '../providers/courses-provider';
import { Button } from '@/components/ui/button';
import { CourseTile } from './CourseTile';

export const CoursePicker = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { courses } = useCourses();
  const { openDialog } = useCourseCreate();

  if (!courses.length) {
    return (
      <Button
        onClick={() => {
          openDialog();
        }}
      >
        Créer un cours
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
      {courses.map((course) => (
        <CourseTile course={course} key={course.id} onClick={() => onSelect(course.id)} />
      ))}
    </div>
  );
};
