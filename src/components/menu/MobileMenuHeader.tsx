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
      className="sticky top-0 z-40"
      style={{
        backgroundColor: isDark ? 'var(--dark-header)' : 'var(--light-background)',
      }}
    >
      {/* Main header row */}
      <div
        className="flex items-center justify-between"
        style={{
          height: '52px',
          padding: '0 12px',
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Logo + Name */}
        <div
          className="flex items-center min-w-0"
          style={{ gap: '8px', flex: '1 1 0' }}
        >
          {displayUrl && (
            <div className="relative shrink-0" style={{ width: '32px', height: '32px' }}>
              <Image
                src={displayUrl}
                alt={cafeName}
                fill
                sizes="32px"
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <h1
            className="font-bold truncate"
            style={{
              fontSize: '15px',
              lineHeight: '20px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            }}
          >
            {cafeName}
          </h1>
        </div>

        {/* Action buttons */}
        <div
          className="flex items-center shrink-0"
          style={{ gap: '6px' }}
        >
          {/* Search toggle */}
          <button
            className="flex items-center justify-center rounded-full"
            style={{
              width: '34px',
              height: '34px',
              fontSize: '15px',
              backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
              border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
            }}
            aria-label="Search"
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('.menu-search-input');
              input?.focus();
            }}
          >
            🔍
          </button>

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="flex items-center justify-center rounded-full"
            style={{
              width: '34px',
              height: '34px',
              fontSize: '15px',
              backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
              border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Language toggle */}
          {englishEnabled && (
            <button
              onClick={toggleLang}
              className="flex items-center justify-center rounded-full"
              style={{
                width: '34px',
                height: '34px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
                border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              }}
              aria-label="Toggle language"
            >
              {isArabic ? 'EN' : 'عر'}
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div
        style={{
          padding: '0 12px 10px',
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div
          className="flex items-center rounded-xl"
          style={{
            height: '36px',
            padding: '0 12px',
            gap: '8px',
            backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
            border: `1px solid ${searchFocused ? 'var(--brand-primary)' : (isDark ? 'var(--dark-border)' : 'var(--light-border)')}`,
          }}
        >
          <span style={{ fontSize: '13px', opacity: 0.4 }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={isArabic ? 'ابحث عن منتج...' : 'Search products...'}
            className="menu-search-input flex-1 bg-transparent outline-none"
            style={{
              fontSize: '13px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
              direction: isArabic ? 'rtl' : 'ltr',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="shrink-0 flex items-center justify-center"
              style={{
                width: '18px',
                height: '18px',
                fontSize: '11px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
