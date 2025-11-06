import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface StudySheetViewProps {
  courseId: string;
}

interface StudySheet {
  id: string;
  summaryTitle: string;
  keyPoints: string[];
  generatedAt: string;
}

export function StudySheetView({ courseId }: StudySheetViewProps) {
  const [studySheet, setStudySheet] = useState<StudySheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudySheet = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/study-sheet`);
        if (!response.ok) {
          throw new Error('Failed to load study sheet');
        }
        const data = await response.json();
        setStudySheet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudySheet();
  }, [courseId]);

  if (isLoading) {
    return <div className="animate-pulse">Loading study sheet...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!studySheet) {
    return <div>No study sheet available</div>;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <h1>{studySheet.summaryTitle}</h1>
      <div className="my-4">
        <h2>Key Points</h2>
        <ReactMarkdown>{studySheet.keyPoints.join('\n')}</ReactMarkdown>
      </div>
      <div className="text-sm text-gray-500">
        Generated on: {new Date(studySheet.generatedAt).toLocaleString()}
      </div>
    </div>
  );
}
