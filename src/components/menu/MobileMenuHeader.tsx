"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { getImageUrl } from "./getImageUrl";
import type { MenuSettings } from "@/types/menu";

interface MobileMenuHeaderProps {
  cafeName: string;
  logoUrl: string | null;
  whiteLogoUrl: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  settings: MenuSettings | null;
}

export function MobileMenuHeader({
  cafeName,
  logoUrl,
  whiteLogoUrl,
  searchQuery,
  onSearchChange,
  settings,
}: MobileMenuHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const { resolvedTheme, cycleTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  const isArabic = lang === 'ar';
  const effectiveLogo = isDark && whiteLogoUrl ? whiteLogoUrl : logoUrl;
  const displayUrl = getImageUrl(effectiveLogo, resolvedTheme);
  const englishEnabled = settings?.english_enabled !== false;

  return (
    <div
      className="sticky top-0 z-40 px-4 py-2.5"
      style={{
        backgroundColor: isDark ? 'var(--dark-background)' : 'var(--light-background)',
        borderBottom: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
      }}
    >
      {/* Top row: logo, name, actions */}
      <div className="flex items-center gap-3" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Logo + name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {displayUrl && (
            <div className="relative shrink-0" style={{ width: '36px', height: '36px' }}>
              <Image
                src={displayUrl}
                alt={cafeName}
                fill
                sizes="36px"
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <h1
            className="font-bold truncate"
            style={{
              fontSize: '16px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            }}
          >
            {cafeName}
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {englishEnabled && (
            <button
              onClick={toggleLang}
              className="flex items-center justify-center rounded-full transition-colors"
              style={{
                width: '32px',
                height: '32px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
                border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              }}
              aria-label="Toggle language"
            >
              {isArabic ? 'EN' : 'عر'}
            </button>
          )}

          <button
            onClick={cycleTheme}
            className="flex items-center justify-center rounded-full transition-colors"
            style={{
              width: '32px',
              height: '32px',
              fontSize: '14px',
              backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
              border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-2.5" dir={isArabic ? 'rtl' : 'ltr'}>
        <div
          className="flex items-center gap-2 px-3 rounded-xl transition-colors"
          style={{
            height: '38px',
            backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
            border: `1px solid ${searchFocused ? 'var(--brand-primary)' : (isDark ? 'var(--dark-border)' : 'var(--light-border)')}`,
          }}
        >
          <span style={{ fontSize: '14px', opacity: 0.4, direction: 'ltr' }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={isArabic ? 'ابحث عن منتج...' : 'Search products...'}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
              direction: isArabic ? 'rtl' : 'ltr',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="shrink-0"
              style={{ fontSize: '14px', opacity: 0.4, color: isDark ? 'var(--dark-text)' : 'var(--light-text)' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
