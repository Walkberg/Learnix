import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardCardHeaderProps {
  currentIndex: number;
  totalCards: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function FlashcardCardHeader({
  currentIndex,
  totalCards,
  onEdit,
  onDelete,
}: FlashcardCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm font-medium text-muted-foreground">
        {currentIndex + 1} / {totalCards}
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit} title="Edit flashcard">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} title="Delete flashcard">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
