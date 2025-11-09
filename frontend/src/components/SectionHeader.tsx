import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, count, actionLabel, onAction }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {count !== undefined && (
          <Badge variant="secondary" className="text-sm">
            {count}
          </Badge>
        )}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
