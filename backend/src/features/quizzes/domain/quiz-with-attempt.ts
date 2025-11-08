import type { Quiz } from './quiz.entity';
import type { LastAttemptSummary } from './quiz-attempt.entity';

export interface QuizWithAttempt {
  quiz: Quiz;
  lastAttemptSummary: LastAttemptSummary | null;
}
