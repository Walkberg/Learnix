import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useSummaries } from '../providers/summaries-provider';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function SummaryTabContent() {
  const { summaries, isLoading, error } = useSummaries();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Chargement du résumé...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Erreur lors du chargement du résumé.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaries || summaries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>Aucun résumé disponible pour ce cours.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display the first summary (most recent)
  const summary = summaries[0];

  return (
    <Card>
      <CardContent className="p-6">
        <MarkdownRenderer content={summary.content} />
      </CardContent>
    </Card>
  );
}
