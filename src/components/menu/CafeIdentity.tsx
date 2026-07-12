"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { getImageUrl } from "./getImageUrl";
import type { MenuSettings } from "@/types/menu";

interface CafeIdentityProps {
  settings: MenuSettings;
}

export function CafeIdentity({ settings }: CafeIdentityProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  const cafeName = lang === 'ar' ? (settings.cafe_name_ar || 'ماهر كيف') : (settings.cafe_name_en || ' Maher Kaif');
  const logoUrl = isDark && settings.white_logo_url
    ? settings.white_logo_url
    : settings.logo_url;
  const displayUrl = getImageUrl(logoUrl, resolvedTheme);

  return (
    <div
      className="mx-4 my-2.5 p-4 flex items-center gap-4"
      style={{
        backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
        borderRadius: '14px',
        border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
      }}
    >
      {displayUrl && (
        <div
          className="relative shrink-0"
          style={{ width: '64px', height: '64px' }}
        >
          <Image
            src={displayUrl}
            alt={cafeName}
            fill
            sizes="64px"
            className="object-contain"
            unoptimized
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2
          className="font-bold truncate"
          style={{
            fontSize: '17px',
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
          }}
        >
          {cafeName}
        </h2>
        {settings.description_ar && (
          <p
            className="truncate mt-0.5"
            style={{
              fontSize: '12px',
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
            }}
          >
            {lang === 'ar' ? (settings.description_ar || settings.description_en) : (settings.description_en || settings.description_ar)}
          </p>
        )}
      </div>
    </div>
  );
}
