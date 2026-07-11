"use client";

import { type ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import type { MenuSettings } from '@/types/menu';

export function MenuProviders({ children, settings }: { children: ReactNode; settings?: MenuSettings | null }) {
  return (
    <ThemeProvider defaultTheme={settings?.default_theme}>
      <LanguageProvider initialLang={settings?.english_enabled === false ? 'ar' : undefined}>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
