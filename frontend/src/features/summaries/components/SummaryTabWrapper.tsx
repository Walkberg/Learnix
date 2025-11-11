import { useParams } from 'react-router-dom';
import { SummariesProvider } from '../providers/summaries-provider';
import { SummaryTabContent } from './SummaryTabContent';

export function SummaryTabWrapper() {
  const { courseId } = useParams<{ courseId: string }>();

  if (!courseId) {
    return <div>Error: Course ID not found</div>;
  }

  return (
    <SummariesProvider courseId={courseId}>
      <SummaryTabContent />
    </SummariesProvider>
  );
}
