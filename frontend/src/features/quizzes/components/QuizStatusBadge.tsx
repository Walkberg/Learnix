import { Badge } from '@/components/ui/badge';

interface Props {
  score: number | null | undefined;
  total: number;
}

const variant = {
  notAttempted: {
    color: 'bg-gray-200 text-gray-800',
    label: 'Non tenté',
  },
  mastered: {
    color: 'bg-green-100 text-green-800',
    label: 'Acquis',
  },
  needsReview: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'À revoir',
  },
  notMastered: {
    color: 'bg-red-100 text-red-800',
    label: 'Non acquis',
  },
};

const scoreToVariant = (score: number | null | undefined, total: number) => {
  if (score === null || score === undefined) return variant.notAttempted;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  if (percent >= 80) return variant.mastered;
  if (percent >= 50) return variant.needsReview;
  return variant.notMastered;
};

export function QuizStatusBadge({ score, total }: Props) {
  const variant = scoreToVariant(score, total);
  return <Badge className={`${variant.color}`}>{variant.label}</Badge>;
}

export default QuizStatusBadge;
