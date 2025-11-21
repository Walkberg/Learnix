import type { QuizQuestion } from '../types';
import OptionSquare from './OptionSquare';
import { ArrowRight } from 'lucide-react';
import { CorrectionIcon } from './Verdict';

export default function QuestionReview({
  question,
  userAnswer,
}: {
  question: QuizQuestion;
  userAnswer?: string | number | null;
}) {
  if (question.type === 'MCQ') {
    const userIdx = typeof userAnswer === 'number' ? userAnswer : null;
    return (
      <div className="p-4 border rounded-md">
        <div className="flex flew-row items-center gap-2">
          <CorrectionIcon variant={userIdx === question.correctAnswer ? 'correct' : 'incorrect'} />
          <div className="font-medium">{question.question}</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {question.options.map((options, i) => {
            const isCorrect = i === question.correctAnswer;
            const isUser = i === userIdx;
            return (
              <OptionSquare
                key={i}
                text={`${getQuestionLetter(i)}${options}`}
                isAnswered={true}
                isSelected={isUser}
                isCorrect={isCorrect}
                onClick={() => {}}
                disabled
              />
            );
          })}
        </div>

        {question.explanation && <Explanation question={question} />}
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md">
      <div className="font-medium">{question.question}</div>
      <div className="mt-2">
        <div className="text-sm">Your answer: {userAnswer ?? '—'}</div>
        <div className="text-sm text-muted-foreground mt-1">
          Correct answer: {question.correctAnswer}
        </div>
      </div>
      {question.explanation && <Explanation question={question} />}
    </div>
  );
}

const getQuestionLetter = (index: number) => {
  return `${String.fromCharCode(65 + index).toUpperCase()}. `;
};

export const Explanation = ({ question }: { question: QuizQuestion }) => {
  return (
    <div className="mt-3 border-2 border-dashed rounded-md p-3 flex items-center gap-3 bg-white">
      <div className="flex-shrink-0 flex items-center mt-1">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/5 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{question.explanation}</div>
    </div>
  );
};
