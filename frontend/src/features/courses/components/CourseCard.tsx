import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2 } from 'lucide-react';
import './CourseCard.css';
import { CourseIcon } from './CourseIcon';

interface Course {
  id: string;
  title: string;
  emoji?: string;
  createdAt: string;
}

interface CourseCardProps {
  course: Course;
  onDelete: (id: string) => void;
}

const CourseCard = ({ course, onDelete }: CourseCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Voulez-vous vraiment supprimer "${course.title}" ?`)) {
      onDelete(course.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={handleCardClick}>
      <CourseIcon className="absolute" emoji={course.emoji} />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Créé {formatDate(course.createdAt)}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
