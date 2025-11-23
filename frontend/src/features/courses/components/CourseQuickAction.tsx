import QuickActionCard from '@/features/home/components/QuickActionCard';

import { useCourseCreate } from '../providers/course-create-provider';

export function CourseQuickAction() {
  const { openDialog: openCourseDialog } = useCourseCreate();

  const Illustration = (
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative">
        <div className="relative bg-white rounded-xl shadow-sm border border-border/50 p-4 w-24 h-32 rotate-[-6deg] flex flex-col gap-3">
          <div className="h-2 w-12 bg-slate-200 rounded-full" />
          <div className="h-2 w-16 bg-slate-100 rounded-full" />
          <div className="h-2 w-14 bg-slate-100 rounded-full" />
          <div className="h-2 w-16 bg-slate-100 rounded-full" />
          <div className="mt-auto h-2 w-8 bg-slate-100 rounded-full" />
        </div>
        <div className="absolute -top-3 -left-3 bg-emerald-400 rounded-full p-1.5 shadow-lg ring-4 ring-white">
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
      title="Générer une fiche"
      description="Crée automatiquement des fiches de révision synthétiques à partir de ton cours."
      header={Illustration}
      onClick={() => openCourseDialog()}
    />
  );
}
