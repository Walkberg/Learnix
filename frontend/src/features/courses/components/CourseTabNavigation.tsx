import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CourseTabNavigationProps {
  courseId: string;
}

export function CourseTabNavigation({ courseId }: CourseTabNavigationProps) {
  const location = useLocation();

  const tabs = [
    { label: 'Fiche', path: `/courses/${courseId}/summary` },
    { label: 'Flashcards', path: `/courses/${courseId}/flashcards` },
  ];

  return (
    <div className="border-b">
      <nav className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'px-4 py-2 border-b-2 transition-colors',
                isActive
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
