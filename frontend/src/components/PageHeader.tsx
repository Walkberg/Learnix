import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  title: string;
  count?: number;
}

export const PageHeader = ({ title, count }: PageHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {count !== undefined && (
        <Badge variant="secondary" className="text-sm">
          {count}
        </Badge>
      )}
    </div>
  );
};
