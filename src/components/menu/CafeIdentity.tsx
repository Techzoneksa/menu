"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";

export function MenuTitleCard() {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  const title = lang === 'ar' ? 'المنيو' : 'Menu';

  return (
    <div
      className="mx-4 flex items-center"
      style={{
        marginTop: '10px',
        marginBottom: '6px',
        padding: '10px 14px',
        backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
        borderRadius: '14px',
        border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '32px',
          height: '32px',
          fontSize: '16px',
          backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
          borderRadius: '8px',
        }}
      >
        📋
      </div>
      <h2
        className="font-bold"
        style={{
          fontSize: '15px',
          lineHeight: '20px',
          marginInlineStart: '10px',
          color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
        }}
      >
        {title}
      </h2>
    </div>
  );
}
