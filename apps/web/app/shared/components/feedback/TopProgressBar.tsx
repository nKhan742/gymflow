import React from 'react';
import { useLoadingStore } from '../../../core/store/loadingStore';

export const TopProgressBar: React.FC = () => {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent overflow-hidden pointer-events-none">
      <div className="h-full w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse" />
    </div>
  );
};
