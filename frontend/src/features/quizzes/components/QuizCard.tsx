import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2 } from 'lucide-react';

interface Quiz {
  id: string;
  courseTitle: string;
  lastAttemptSummary?: {
    score: number;
    totalQuestions: number;
    attemptedAt: string;
  };
}

interface QuizCardProps {
  quiz: Quiz;
  onDelete: (id: string) => void;
}

const QuizCard = ({ quiz, onDelete }: QuizCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/quizzes/${quiz.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer ce quiz ?')) {
      onDelete(quiz.id);
    }
  };

  const getProgressPercentage = () => {
    if (!quiz.lastAttemptSummary) return 0;
    return (quiz.lastAttemptSummary.score / quiz.lastAttemptSummary.totalQuestions) * 100;
  };

  const getStatusBadge = () => {
    const percentage = getProgressPercentage();
    if (percentage === 0) {
      return { label: 'Non appris', variant: 'destructive' as const };
    }
    if (percentage < 70) {
      return { label: 'À revoir', variant: 'secondary' as const };
    }
    return { label: 'Acquis', variant: 'default' as const };
  };

  const status = getStatusBadge();

  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={handleCardClick}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
        </div>
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
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{quiz.courseTitle}</h3>
        {quiz.lastAttemptSummary && (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">
                  {quiz.lastAttemptSummary.score}/{quiz.lastAttemptSummary.totalQuestions}
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </>
        )}
        {!quiz.lastAttemptSummary && <Badge variant="secondary">Pas encore essayé</Badge>}
      </CardContent>
    </Card>
  );
};

export default QuizCard;
