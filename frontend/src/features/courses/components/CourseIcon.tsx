export const CourseIcon = ({ emoji, className }: { emoji?: string; className?: string }) => {
  return (
    <div className={`${className} flex items-center gap-2 course-icon`}>
      <span className="text-4xl">{emoji || '📚'}</span>
    </div>
  );
};
