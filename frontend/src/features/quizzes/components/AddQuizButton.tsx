import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddQuizButtonProps {
  onClick: () => void;
}

export const AddQuizButton = ({ onClick }: AddQuizButtonProps) => {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      Ajouter un quiz
    </Button>
  );
};

export default AddQuizButton;
