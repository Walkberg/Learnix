import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import CourseListToolbar from '../components/CourseListToolbar';
import CourseGrid from '../components/CourseGrid';
import { useCourses } from '../providers/courses-provider';
import { useCourseCreate } from '../providers/course-create-provider';

export function CoursesListPage() {
  const { courses, deleteCourse } = useCourses();
  const { openDialog } = useCourseCreate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : courses;

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Mes cours" count={courses.length} />
      <CourseListToolbar
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onAddCourse={openDialog}
      />
      <CourseGrid courses={filteredCourses} onDeleteCourse={deleteCourse} />
    </div>
  );
}

export default CoursesListPage;
