import React from 'react';
import { Loader2, Database, Sparkles } from 'lucide-react';

interface DatabaseLoaderProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const DatabaseLoader: React.FC<DatabaseLoaderProps> = ({
  message = 'Fetching records from live database...',
  subMessage = 'Querying encrypted MongoDB Atlas cluster',
  fullHeight = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 transition-all duration-300 ${
        fullHeight ? 'min-h-[400px]' : 'py-12'
      }`}
    >
      <div className="relative mb-4">
        {/* Glowing aura */}
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-full blur-lg animate-pulse" />
        
        {/* Core spinning indicator */}
        <div className="relative h-14 w-14 rounded-2xl bg-card border border-border/80 shadow-md flex items-center justify-center text-primary">
          <Database className="h-6 w-6 text-primary animate-bounce" />
          <Loader2 className="h-10 w-10 absolute animate-spin text-primary/40 -inset-1" />
        </div>
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold tracking-tight text-foreground flex items-center justify-center gap-1.5">
          <span>{message}</span>
        </h4>
        {subMessage && (
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
            <span>{subMessage}</span>
          </p>
        )}
      </div>

      {/* Subtle pulsing dots */}
      <div className="flex items-center gap-1.5 mt-4">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-ping delay-150" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-ping delay-300" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <tbody className="divide-y divide-border/60">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={`skeleton-row-${rIdx}`} className="border-b border-border/60">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={`skeleton-cell-${cIdx}`} className="px-4 py-4 border-r border-border/60 last:border-r-0">
              <div
                className="h-4 bg-muted/80 rounded-md animate-pulse"
                style={{
                  width: `${35 + ((rIdx + cIdx * 17) % 55)}%`,
                  animationDelay: `${(rIdx * 75 + cIdx * 50) % 600}ms`,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded-lg" />
      </div>
      <div className="h-8 w-20 bg-muted rounded" />
      <div className="h-3 w-36 bg-muted rounded" />
    </div>
  );
};
