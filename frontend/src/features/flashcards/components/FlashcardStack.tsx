import { useEffect } from 'react';
import { useFlashcards } from '../providers/flashcards-provider';
import { FlashcardCard } from './FlashcardCard';
import { StackedCard } from './StackedCard';
import { FlashcardNavigation } from './FlashcardNavigation';
import { Skeleton } from '@/components/ui/skeleton';
// Nouveau composant pour la pile
function StackedCardsList({ cards }: { cards: Array<{ flashcard: any; stackOffset: number }> }) {
  return (
    <div className="mb-10">
      {cards.map(({ flashcard, stackOffset }) => (
        <StackedCard key={flashcard.id} flashcard={flashcard} stackOffset={stackOffset} />
      ))}
    </div>
  );
}

interface FlashcardStackProps {
  onEdit: (flashcard: any) => void;
  onDelete: (flashcard: any) => void;
}

export function FlashcardStack({ onEdit, onDelete }: FlashcardStackProps) {
  const { flashcards, isLoading, error, currentIndex, next, previous } = useFlashcards();

  const handleAdd = () => {
    console.log('Add flashcard clicked');
  };

  // Keyboard navigation: left/right arrows navigate between cards

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <Skeleton className="h-[400px] w-full max-w-2xl" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">Error loading flashcards</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No flashcards yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first flashcard to start studying
          </p>
        </div>
        <FlashcardNavigation
          onPrevious={previous}
          onNext={next}
          onAdd={handleAdd}
          canGoPrevious={false}
          canGoNext={false}
        />
      </div>
    );
  }

  // Stack effect: show up to 3 cards above the current card
  const stackCardsData = Array.from({ length: 3 }, (_, i) => {
    const stackOffset = 3 - i;
    const idx = currentIndex + stackOffset;
    if (idx < flashcards.length) {
      return { flashcard: flashcards[idx], stackOffset };
    }
    return null;
  }).filter((item): item is { flashcard: any; stackOffset: number } => item !== null);

  return (
    <div
      className="flex flex-col items-center justify-center h-full p-8 space-y-6 relative"
      style={{ minHeight: 420 }}
    >
      <div className="relative w-full max-w-2xl h-[380px] mx-auto" style={{ minHeight: 380 }}>
        <div className="relative top-30">
          <StackedCardsList cards={stackCardsData} />
        </div>
        <FlashcardCard
          key={flashcards[currentIndex].id}
          flashcard={flashcards[currentIndex]}
          currentIndex={currentIndex}
          totalCards={flashcards.length}
          onEdit={onEdit}
          onDelete={onDelete}
          stackOffset={0}
          isStackCard={false}
        />
      </div>
      <FlashcardNavigation
        onPrevious={previous}
        onNext={next}
        onAdd={handleAdd}
        canGoPrevious={currentIndex > 0}
        canGoNext={currentIndex < flashcards.length - 1}
      />
    </div>
  );
}
