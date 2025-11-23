import { ProgressCircle } from '@/features/quizzes/components/ScoreBadge';

interface Props {
  value: number;
  showEmpty?: boolean;
}

export function CircularProgress({ value, showEmpty = false }: Props) {
  const display = showEmpty ? '-' : `${Math.round(value)}%`;
  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
      <div className="relative">
        <ProgressCircle value={value} color="#3b82f6" size={40} stroke={4} />
        {display}
      </div>
    </div>
  );
}

export default CircularProgress;
