import React from 'react';
import { useQuizDetail } from '../providers/quiz-detail-provider';

export function QuizPlayerPage() {
  const { quiz } = useQuizDetail();

  if (!quiz) return <div className="p-8">Quiz not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{quiz.courseTitle} — Quiz</h1>
      <p className="text-sm text-muted-foreground">
        Created at {new Date(quiz.createdAt).toLocaleString()}
      </p>
      <div className="mt-6">
        <p className="text-lg">Questions: {quiz.questions?.length ?? 'N/A'}</p>
        <div className="mt-4">Player UI goes here (question card, timer, navigation)</div>
      </div>
    </div>
  );
}
