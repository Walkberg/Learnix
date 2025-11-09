import { SearchBar } from '@/components/SearchBar';
import { AddCourseButton } from './AddCourseButton';

interface CourseListToolbarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onAddCourse: () => void;
}

export const CourseListToolbar = ({
  searchValue,
  onSearch,
  onAddCourse,
}: CourseListToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <SearchBar placeholder="Rechercher un cours..." value={searchValue} onChange={onSearch} />
      <AddCourseButton onClick={onAddCourse} />
    </div>
  );
};

export default CourseListToolbar;
