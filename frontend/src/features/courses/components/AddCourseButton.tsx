import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddCourseButtonProps {
  onClick: () => void;
}

export const AddCourseButton = ({ onClick }: AddCourseButtonProps) => {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      Ajouter un cours
    </Button>
  );
};

export default AddCourseButton;
