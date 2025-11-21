import type { Quiz } from '../types';
import { ScoreBadge } from './ScoreBadge';

export default function ResultsHeader({ quiz, score }: { quiz: Quiz; score?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex  items-center gap-2">
        <h1 className="text-2xl font-semibold">
          {quiz.courseEmoji} {quiz.courseTitle} — Results
        </h1>
      </div>
      <div>
        <ScoreBadge score={score ?? 0} total={quiz.questions?.length ?? 0} />
      </div>
    </div>
  );
}
