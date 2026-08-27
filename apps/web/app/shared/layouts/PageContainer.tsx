import React from 'react';
import { cn } from '../utils/cn';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 animate-in fade-in-50 duration-200', className)} {...props}>
      {children}
    </div>
  );
};
