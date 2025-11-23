import type { Flashcard } from '../types';

interface StackedCardProps {
  flashcard: Flashcard;
  stackOffset: number;
}

export function StackedCard({ flashcard, stackOffset }: StackedCardProps) {
  // Logic: cards get smaller and move down as they go back in the stack
  const scale = 1 - stackOffset * 0.02; // Less aggressive scaling
  const translateY = stackOffset * 10 +45 ; // More aggressive translation to overcome scaling shrinkage
  const opacity = Math.max(0, 1 - stackOffset * 0.2);

  return (
    <div
      className="absolute top-0 left-0 w-full max-w-2xl pointer-events-none"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        zIndex: 5 - stackOffset,
        opacity,
      }}
    >
      <div className="relative rounded-xl border bg-card overflow-hidden shadow-lg">
        {/* Glossy glass effect overlay */}
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
          <div className="min-h-[300px] flex items-center justify-center select-none">
            <p className="text-2xl leading-relaxed text-center px-8">{flashcard.question}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
