export const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="flex gap-2 justify-center mb-4">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={
          i < currentStep
            ? 'flex-1 bg-emerald-400 h-2 rounded-full'
            : 'flex-1 bg-gray-100 h-2 rounded-full'
        }
      ></div>
    ))}
  </div>
);
