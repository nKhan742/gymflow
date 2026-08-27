import React from 'react';
import { cn } from '../utils/cn';

export interface ActionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-sm', className)} {...props}>
      {children}
    </div>
  );
};
