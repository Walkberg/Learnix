import { Sparkles } from 'lucide-react';

export function QuizGenerationLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="relative">
        {/* Background pulsing circles */}
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
        <div className="absolute inset-[-12px] bg-primary/10 rounded-full animate-pulse" />
        
        {/* Central Icon Container */}
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-border/50 z-10">
          <div className="relative">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100" />
            <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-500" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-xs mx-auto">
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Création de ton quizz en cours...
        </h3>
        <p className="text-sm text-muted-foreground animate-pulse">
          Nos petits robots analysent ton cours pour préparer les meilleures questions ! 🤖
        </p>
      </div>

      {/* Progress bar simulation */}
      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] w-1/3 rounded-full" />
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
