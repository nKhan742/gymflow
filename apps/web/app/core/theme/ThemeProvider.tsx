import React, { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { Toaster } from 'sonner';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode, setTheme, resolvedTheme } = useThemeStore();

  useEffect(() => {
    setTheme(mode);
  }, []);

  return (
    <>
      {children}
      <Toaster 
        theme={resolvedTheme} 
        richColors 
        position="top-right" 
        toastOptions={{
          className: 'rounded-xl border border-border shadow-lg font-sans',
        }}
      />
    </>
  );
};
