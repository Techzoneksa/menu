"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '@/types/menu';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  cycleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'light',
  cycleTheme: () => {},
  setTheme: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children, defaultTheme }: { children: ReactNode; defaultTheme?: string }) {
  const [theme, setThemeState] = useState<Theme>((defaultTheme as Theme) || 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('maher-kaif-theme') as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage initialization
      setThemeState(stored);
    } else if (defaultTheme && (defaultTheme === 'light' || defaultTheme === 'dark' || defaultTheme === 'system')) {
      setThemeState(defaultTheme as Theme);
    }
  }, [defaultTheme]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => {
      let resolved: 'light' | 'dark';
      if (theme === 'system') {
        resolved = mql.matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }
      setResolvedTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };
    resolve();
    mql.addEventListener('change', resolve);
    return () => mql.removeEventListener('change', resolve);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('maher-kaif-theme', newTheme);
  };

  const cycleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
