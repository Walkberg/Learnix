import React from 'react';
import { useQuizDetail } from '../providers/quiz-detail-provider';

export function QuizResultsPage() {
  const { quiz, lastAttempt } = useQuizDetail();

  if (!quiz) return <div className="p-8">Quiz not found.</div>;

  if (!lastAttempt)
    return (
      <div className="p-8">
        <p>No attempt found for this quiz.</p>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{quiz.courseTitle} — Results</h1>
      <p className="text-sm text-muted-foreground">
        Attempted at {new Date(lastAttempt.attemptedAt).toLocaleString()}
      </p>
      <div className="mt-6">
        <p className="text-lg">
          Score: {lastAttempt.score}/{lastAttempt.totalQuestions}
        </p>
        <div className="mt-4">Per-question review UI goes here</div>
      </div>
    </div>
  );
}
