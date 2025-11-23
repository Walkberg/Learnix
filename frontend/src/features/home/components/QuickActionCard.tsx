import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';

interface QuickActionCardProps {
  title: string;
  description: string;
  header: ReactNode;
  badge?: string;
  onClick: () => void;
}

const QuickActionCard = ({ title, description, header, badge, onClick }: QuickActionCardProps) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/20"
      onClick={onClick}
    >
      <div className="relative h-40 w-full bg-muted/30 p-6 flex items-center justify-center overflow-hidden">
        {header}
        {badge && (
          <Badge variant="secondary" className="absolute bottom-3 right-3 bg-white shadow-sm hover:bg-white">
            {badge}
          </Badge>
        )}
      </div>
      <CardHeader className="p-6 pt-5">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default QuickActionCard;
