import React from 'react';

const VARIANTS = {
  good: { color: '#16a34a', emoji: '🥳', phrase: 'Tu gères, continue comme ça !' },
  average: {
    color: '#f59e0b',
    emoji: '🙂',
    phrase: 'Tu flirtes avec la moyenne, mais elle veut pas de toi.',
  },
  poor: { color: '#ef4444', emoji: '😅', phrase: 'Courage, pratique encore un peu.' },
} as const;

export function ScoreBadge({ score, total }: { score: number; total: number }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const variantKey = percent >= 80 ? 'good' : percent >= 50 ? 'average' : 'poor';
  const variant = VARIANTS[variantKey];

  const size = 150;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percent / 100) * circumference;

  const shadowColor = variant.color + '33';

  return (
    <div className="flex flex-col items-center">
      <div
        style={{ boxShadow: `0 8px 24px ${shadowColor}` }}
        className="relative rounded-full bg-white"
      >
        <div className="p-4">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#eef2ff"
              strokeWidth={stroke}
              fill="none"
            />
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={variant.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${progress} ${circumference}`}
                fill="none"
              />
            </g>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="text-4xl">{variant.emoji}</div>
          <div className="text-2xl font-bold">
            {score}/{total}
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-2xl font-medium">{variant.phrase}</div>
      </div>
    </div>
  );
}
