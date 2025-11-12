import type { Flashcard } from '../types';

interface StackedCardProps {
  flashcard: Flashcard;
  stackOffset: number;
}

export function StackedCard({ flashcard, stackOffset }: StackedCardProps) {
  // Nouvelle logique : la 2e carte est la plus grande, la 3e la plus petite
  let scale = 0.95;
  let translateY = -8;
  let opacity = 0.7;
  if (stackOffset === 1) {
    scale = 0.90;
    translateY = -16;
    opacity = 0.5;
  } else if (stackOffset === 2) {
    scale = 1.0;
    translateY = 0;
    opacity = 0.9;
  }

  return (
    <div
      className="absolute w-full max-w-2xl pointer-events-none"
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        zIndex: 1 + stackOffset,
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
