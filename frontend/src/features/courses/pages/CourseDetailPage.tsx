import { useParams } from 'react-router-dom';

export function CourseDetailPage() {
  const { courseId } = useParams();
  return <div className="p-4">Course Detail {courseId}</div>;
}

export default CourseDetailPage;
