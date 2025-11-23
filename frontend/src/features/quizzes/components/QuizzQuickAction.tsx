import QuickActionCard from '@/features/home/components/QuickActionCard';

import { useQuizCreate } from '../providers/quiz-create-provider';

export function QuizzQuickAction({ courseId }: { courseId?: string }) {
  const { openDialog: openQuizDialog } = useQuizCreate();

  const Illustration = (
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative flex flex-col gap-2 w-32">
        <div className="bg-white rounded-lg shadow-sm border border-border/50 p-2 w-full mb-1">
          <div className="h-2 w-3/4 bg-slate-200 rounded-full mb-1.5" />
          <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-400 rounded-md p-2 flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="bg-white rounded-md p-2 flex items-center justify-center shadow-sm border border-border/50">
            <span className="text-xs font-bold text-muted-foreground">B</span>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 bg-emerald-400 rounded-full p-1.5 shadow-lg ring-4 ring-white z-10">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <QuickActionCard
      title="Créer un quizz"
      description="Conçois des quizz interactifs pour tester et renforcer tes connaissances."
      header={Illustration}
      onClick={() => openQuizDialog(courseId)}
    />
  );
}
