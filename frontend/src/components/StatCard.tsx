import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
            {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
