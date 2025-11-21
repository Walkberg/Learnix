import { useQuizAttempt, type AnswerState } from '../providers/quiz-attempt-provider';

export type ProgressVariant = 'compact' | 'full';

export function ProgressSquares({ variant = 'full' }: { variant?: ProgressVariant }) {
  const { questions, answers } = useQuizAttempt();

  if (variant === 'full') {
    return (
      <div className="flex gap-2 w-full">
        {questions.map((_, i) => {
          const color = getQuestionVariant(answers[i]);
          return (
            <Square key={i} color={color} sizeClass="flex-1 h-2" title={`Question ${i + 1}`} />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {questions.map((_, i) => {
        const color = getQuestionVariant(answers[i]);
        return <Square key={i} color={color} sizeClass="w-4 h-2" title={`Question ${i + 1}`} />;
      })}
    </div>
  );
}

function getQuestionVariant(answerState: AnswerState): Color {
  return answerState == null || answerState.selected == null
    ? 'gray'
    : answerState.correct
    ? 'green'
    : 'red';
}

type Color = 'gray' | 'green' | 'red';

const colorVariants: Record<Color, { variant: string }> = {
  gray: {
    variant: 'bg-gray-200',
  },
  green: {
    variant: 'bg-emerald-400',
  },
  red: {
    variant: 'bg-rose-400',
  },
};

function Square({ color, sizeClass, title }: { color: Color; sizeClass: string; title?: string }) {
  const colorCls = colorVariants[color].variant;
  return <div className={`${sizeClass} rounded-sm ${colorCls}`} title={title} />;
}
