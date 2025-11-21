interface OptionSquareProps {
  text: string;
  isAnswered: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function OptionSquare({
  text,
  isAnswered,
  isSelected,
  isCorrect,
  onClick,
  disabled,
}: OptionSquareProps) {
  let classes =
    'p-4 rounded-lg border flex items-center justify-start text-left cursor-pointer select-none';
  if (!isAnswered) {
    classes += ' bg-card hover:bg-accent';
  } else {
    if (isSelected) {
      classes += isCorrect
        ? ' bg-emerald-500 text-white border-emerald-600'
        : ' bg-rose-500 text-white border-rose-600';
    } else if (isCorrect) {
      classes += ' bg-emerald-500 text-white border-emerald-600';
    } else {
      classes += ' bg-card opacity-80';
    }
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled} aria-pressed={isSelected}>
      <div className="text-sm">{text}</div>
    </button>
  );
}
