import { SelectionCard } from '@/common/components/SelectionCard';
import { useQuizCreate, type QuizzType } from '../providers/quiz-create-provider';
import { Label } from '@/components/ui/label';

export const ExerciseTypeCards = ({
  value,
  onChange,
}: {
  value?: QuizzType;
  onChange: (v: QuizzType) => void;
}) => {
  const { exerciseTypeOptions } = useQuizCreate();

  return (
    <div className="flex flex-col gap-3">
      <Label>Type d'exercice</Label>
      {exerciseTypeOptions.map((option) => (
        <SelectionCard
          key={option.key}
          icon={option.icon}
          label={option.label}
          selected={value === option.key}
          disabled={option.disabled}
          onClick={() => !option.disabled && onChange(option.key)}
        />
      ))}
    </div>
  );
};
