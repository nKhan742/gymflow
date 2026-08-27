import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface IThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<IThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      resolvedTheme: 'dark',
      setTheme: (mode) => {
        const resolved = mode === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : mode;
        
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
        set({ mode, resolvedTheme: resolved as 'light' | 'dark' });
      },
      toggleTheme: () => {
        const next = get().resolvedTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
    }),
    { name: 'gymflow_theme_pref' }
  )
);
