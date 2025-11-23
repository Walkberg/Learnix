import QuickActionCard from '@/features/home/components/QuickActionCard';

import { useNavigate } from 'react-router-dom';

export function ChatQuickAction() {
  const navigate = useNavigate();

  const Illustration = (
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative w-full max-w-[140px] flex flex-col gap-3">
        <div className="self-end bg-white rounded-2xl rounded-tr-sm shadow-sm border border-border/50 p-3 w-3/4">
          <div className="h-2 w-full bg-slate-200 rounded-full mb-2" />
          <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
        </div>
        <div className="self-start bg-emerald-400 rounded-2xl rounded-tl-sm shadow-md p-3 w-3/4 relative">
          <div className="h-2 w-full bg-white/90 rounded-full mb-2" />
          <div className="h-2 w-3/4 bg-white/70 rounded-full" />
          <div className="absolute -top-3 -left-3 text-emerald-400 bg-white rounded-full p-1 shadow-sm border border-emerald-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <QuickActionCard
      title="Réviser avec Learnix"
      description="Discute avec ton coach IA pour clarifier tes notions et consolider tes apprentissages."
      header={Illustration}
      badge="NEW"
      onClick={() => navigate('/chat')}
    />
  );
}
