import { useState } from 'react';
import { FlashcardCardHeader } from './FlashcardCardHeader';
import type { Flashcard } from '../types';

interface FlashcardCardProps {
  flashcard: Flashcard;
  currentIndex: number;
  totalCards: number;
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (flashcard: Flashcard) => void;
  stackOffset?: number;
  isStackCard?: boolean;
}

export function FlashcardCard({
  flashcard,
  currentIndex,
  totalCards,
  onEdit,
  onDelete,
  stackOffset = 0,
  isStackCard = false,
}: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!isStackCard) {
      setIsFlipped(!isFlipped);
    }
  };

  const scale = 1 - stackOffset * 0.05;
  const translateY = stackOffset * 12;
  const opacity = isStackCard ? 0.4 + (1 - stackOffset * 0.2) : 1;

  return (
    <div
      className="absolute w-full max-w-2xl"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        zIndex: isStackCard ? 1 : 10,
        opacity,
        pointerEvents: isStackCard ? 'none' : 'auto',
      }}
    >
      {/* Perspective container for 3D flip */}
      <div className="perspective-1000">
        <div
          className={`relative preserve-3d transition-transform duration-600 cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card (Question) */}
          <div className="backface-hidden w-full" style={{ backfaceVisibility: 'hidden' }}>
            <div className="relative rounded-xl border bg-card overflow-hidden shadow-lg">
              {/* Glossy glass effect overlay - plus visible */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.0) 100%)',
                  boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
                  mixBlendMode: 'screen',
                  opacity: 0.7,
                }}
              />
              <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at top left, rgba(255,255,255,0.25) 0%, transparent 70%)',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
              <div className="relative p-6">
                {!isStackCard && (
                  <FlashcardCardHeader
                    currentIndex={currentIndex}
                    totalCards={totalCards}
                    onEdit={() => onEdit(flashcard)}
                    onDelete={() => onDelete(flashcard)}
                  />
                )}
                <div className="min-h-[300px] flex items-center justify-center select-none">
                  <p className="text-2xl leading-relaxed text-center px-8">{flashcard.question}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Back of card (Answer) */}
          <div
            className="backface-hidden w-full absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative rounded-xl border bg-card overflow-hidden shadow-lg">
              {/* Glossy glass effect overlay - plus visible */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.0) 100%)',
                  boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
                  mixBlendMode: 'screen',
                  opacity: 0.7,
                }}
              />
              <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at top left, rgba(255,255,255,0.25) 0%, transparent 70%)',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
              <div className="relative p-6">
                {!isStackCard && (
                  <FlashcardCardHeader
                    currentIndex={currentIndex}
                    totalCards={totalCards}
                    onEdit={() => onEdit(flashcard)}
                    onDelete={() => onDelete(flashcard)}
                  />
                )}
                <div className="min-h-[300px] flex items-center justify-center select-none">
                  <p className="text-2xl leading-relaxed text-center px-8">{flashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
