import { ProgressCircle } from '@/features/quizzes/components/ScoreBadge';

interface Props {
  value: number;
  showEmpty?: boolean;
}

export function CircularProgress({ value, showEmpty = false }: Props) {
  const color = value >= 80 ? GREEN : value >= 50 ? YELLOW : value > 0 ? RED : WHITE;
  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
      <div className="relative">
        <ProgressCircle value={value} color={color} size={40} stroke={4}></ProgressCircle>
      </div>
    </div>
  );
}

export default CircularProgress;

const GREEN = '#00bc7d';
const YELLOW = '#fdc700';
const RED = '#fb2c36';
const WHITE = 'white';
