import React from 'react';
import type { Course } from '../types';
import { ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseTileProps {
  course: Course;
  onClick?: (course: Course) => void;
  className?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const CourseTile: React.FC<CourseTileProps> = ({ course, onClick, className }) => {
  return (
    <button
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(course)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(course);
        }
      }}
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-transparent bg-white px-4 py-3 text-left shadow-sm transition-colors',
        'hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200',
        'cursor-pointer',
        className
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="text-2xl drop-shadow-[2px_2px_2px_rgba(16,185,129,0.8)]" aria-hidden="true">
          {course.emoji || '📚'}
        </div>
        <div className="flex flex-col">
          <span className="font-medium leading-snug line-clamp-1">{course.title}</span>
          <span className="text-xs text-muted-foreground">
            Créé le {formatDate(course.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-4 text-muted-foreground">
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </div>
    </button>
  );
};
