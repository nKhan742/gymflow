import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  timeframe = 'vs last month',
  icon,
  chart,
  className,
}) => {
  return (
    <Card className={cn('relative overflow-hidden border border-border/80 hover:border-border hover:shadow-md transition-all', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          {icon && <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{value}</h2>
            {change && (
              <div className="flex items-center gap-1.5 mt-1">
                <Badge
                  variant={trend === 'up' ? 'success' : trend === 'down' ? 'destructive' : 'secondary'}
                  className="px-1.5 py-0 text-[11px] font-medium gap-0.5"
                >
                  {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  {trend === 'neutral' && <Minus className="h-3 w-3" />}
                  {change}
                </Badge>
                <span className="text-xs text-muted-foreground">{timeframe}</span>
              </div>
            )}
          </div>
          {chart && <div className="w-24 h-10">{chart}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
