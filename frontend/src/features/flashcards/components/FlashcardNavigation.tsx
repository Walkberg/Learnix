import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashcardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onAdd: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function FlashcardNavigation({
  onPrevious,
  onNext,
  onAdd,
  canGoPrevious,
  canGoNext,
}: FlashcardNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        title="Previous card"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button variant="default" onClick={onAdd} title="Add flashcard">
        <Plus className="h-4 w-4 mr-2" />
        Add Card
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!canGoNext}
        title="Next card"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
