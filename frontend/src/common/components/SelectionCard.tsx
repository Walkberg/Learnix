import { Badge } from '@/components/ui/badge';

interface SelectionCardProps {
  icon: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const SelectionCard = ({ icon, label, selected, disabled, onClick }: SelectionCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-4 p-4 rounded-lg border-2 transition-all
        ${selected ? 'border-emerald-400 bg-white-50' : 'border-gray-300 bg-white'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
      `}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 text-left">
        <div className="font-medium text-gray-900">{label}</div>
      </div>
      {disabled ? (
        <Badge variant="secondary">Bientôt disponible</Badge>
      ) : (
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${selected ? 'border-emerald-400' : 'border-gray-400'}
          `}
        >
          {selected && <div className="w-3 h-3 rounded-full bg-emerald-400" />}
        </div>
      )}
    </button>
  );
};
