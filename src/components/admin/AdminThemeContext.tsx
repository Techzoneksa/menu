"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface AdminThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  cycleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'light',
  resolvedTheme: 'light',
  cycleTheme: () => {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin-theme') as Theme | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage initialization
    if (stored) setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let resolved: 'light' | 'dark' = 'light';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync resolved theme
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.classList.toggle('light', resolved === 'light');
  }, [theme, mounted]);

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    localStorage.setItem('admin-theme', next);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, resolvedTheme, cycleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}
