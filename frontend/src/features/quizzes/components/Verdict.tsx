// no default React import required with new JSX runtime
import { useQuizAttempt } from '../providers/quiz-attempt-provider';
import { Check, X } from 'lucide-react';

const VARIANTS = {
  correct: {
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    label: 'Bonne réponse !',
    Icon: Check,
  },
  incorrect: {
    bg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    label: 'Mauvaise réponse !',
    Icon: X,
  },
};

export default function Verdict() {
  const { questions, current, answers } = useQuizAttempt();

  const currentQuestion = questions[current];
  const currentAnswer = answers[current];

  if (!currentAnswer || currentAnswer.selected == null) return null;

  const variantKey = currentAnswer.correct ? 'correct' : 'incorrect';

  const variant = VARIANTS[variantKey];

  return (
    <div className="pt-2">
      <div className="flex items-center gap-3">
        <CorrectionIcon variant={variantKey} />
        <div className="font-medium">{variant.label}</div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{currentQuestion?.explanation}</div>
    </div>
  );
}

export const CorrectionIcon = ({ variant }: { variant: 'correct' | 'incorrect' }) => {
  const variantStyle = VARIANTS[variant];
  const Icon = variantStyle.Icon;

  return (
    <div className={`p-2 rounded-full ${variantStyle.bg}`}>
      <Icon size={24} className={`${variantStyle.iconColor} w-5 h-5`} />
    </div>
  );
};
