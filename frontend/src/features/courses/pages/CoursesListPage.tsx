import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import CourseListToolbar from '../components/CourseListToolbar';
import CourseGrid from '../components/CourseGrid';
import { useCourses } from '../providers/courses-provider';

export function CoursesListPage() {
  const { courses, deleteCourse } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : courses;

  const handleAddCourse = () => {
    // TODO: Open course creation dialog/navigate to creation form
    console.log('Open course creation');
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Mes cours" count={courses.length} />

      <CourseListToolbar
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onAddCourse={handleAddCourse}
      />

      <CourseGrid courses={filteredCourses} onDeleteCourse={deleteCourse} />
    </div>
  );
}

export default CoursesListPage;
