"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";

interface MenuSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
}

export function MenuSearch({ query, onQueryChange, resultCount }: MenuSearchProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="px-4 pt-3 pb-1">
      <p
        className="text-center"
        style={{
          fontSize: '12px',
          color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
        }}
      >
        {resultCount} {lang === 'ar' ? 'نتيجة' : 'results'}
      </p>
    </div>
  );
}
