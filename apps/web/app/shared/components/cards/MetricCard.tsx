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
      <CardContent className="p-3.5 sm:p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate flex-1 min-w-0">
            {title}
          </span>
          {icon && (
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary shrink-0 flex items-center justify-center">
              {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: cn('w-3.5 h-3.5 sm:w-4 sm:h-4', (icon.props as { className?: string })?.className)
              }) : icon}
            </div>
          )}
        </div>

        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground truncate font-mono">
              {value}
            </h2>
            {change && (
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 min-w-0">
                <Badge
                  variant={trend === 'up' ? 'success' : trend === 'down' ? 'destructive' : 'secondary'}
                  className="px-1.5 py-0 text-[10px] sm:text-[11px] font-medium gap-0.5 shrink-0"
                >
                  {trend === 'up' && <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                  {trend === 'down' && <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                  {trend === 'neutral' && <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                  <span className="truncate">{change}</span>
                </Badge>
                {timeframe && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                    {timeframe}
                  </span>
                )}
              </div>
            )}
          </div>
          {chart && <div className="w-20 sm:w-24 h-8 sm:h-10 shrink-0 mt-1 sm:mt-0">{chart}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
