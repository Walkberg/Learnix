import { SelectionCard } from '@/common/components/SelectionCard';
import { useQuizCreate, type MCQType } from '../providers/quiz-create-provider';
import { Label } from '@/components/ui/label';

export const AnswerCountCards = ({
  value,
  onChange,
}: {
  value?: MCQType;
  onChange: (v: MCQType) => void;
}) => {
  const { answerCountOptions } = useQuizCreate();

  return (
    <>
      <div className="flex flex-col gap-3">
        <Label>Nombres de réponses possibles</Label>
        {answerCountOptions.map((option) => (
          <SelectionCard
            key={option.key}
            icon={option.icon}
            label={option.label}
            selected={value === option.key}
            disabled={false}
            onClick={() => onChange(option.key)}
          />
        ))}
      </div>
    </>
  );
};
