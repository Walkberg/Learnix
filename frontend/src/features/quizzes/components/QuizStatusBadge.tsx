import { Badge } from '@/components/ui/badge';

interface Props {
  score: number | null | undefined;
}

export function QuizStatusBadge({ score }: Props) {
  if (score === null || score === undefined) {
    return <Badge className="bg-gray-200 text-gray-800">Non tenté</Badge>;
  }
  if (score >= 80) return <Badge className="bg-green-100 text-green-800">Acquis</Badge>;
  if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-800">À revoir</Badge>;
  return <Badge className="bg-red-100 text-red-800">Non acquis</Badge>;
}

export default QuizStatusBadge;
