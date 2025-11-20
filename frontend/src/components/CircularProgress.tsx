interface Props {
  value: number;
  showEmpty?: boolean;
}

export function CircularProgress({ value, showEmpty = false }: Props) {
  const display = showEmpty ? '-' : `${Math.round(value)}%`;
  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
      {display}
    </div>
  );
}

export default CircularProgress;
