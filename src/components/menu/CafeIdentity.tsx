"use client";

/* eslint-disable @next/next/no-img-element */

import { Share2, MapPin } from 'lucide-react';
import type { MenuSettings } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';

interface CafeIdentityProps {
  settings: MenuSettings;
}

export function CafeIdentity({ settings }: CafeIdentityProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();

  const cafeName = lang === 'ar' ? settings.cafe_name_ar : settings.cafe_name_en;
  const secondaryName = lang === 'ar' ? (settings.cafe_name_en || 'Maher Kaif') : (settings.cafe_name_ar || 'ماهر كيف');
  const description = lang === 'ar' ? settings.description_ar : settings.description_en;

  const handleShare = async () => {
    try {
      await navigator.share({ title: cafeName || undefined, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div
      className="mx-4 mt-3 mb-1 p-5 text-center relative"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#1B1B1B' : '#FFFFFF',
        borderRadius: 20,
        border: `1px solid ${resolvedTheme === 'dark' ? '#303030' : '#F0F0F0'}`,
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden"
        style={{ backgroundColor: resolvedTheme === 'dark' ? '#252525' : '#FFF8F0' }}
      >
        {settings.logo_url ? (
          <img src={settings.logo_url} alt={cafeName || ''} className="w-12 h-12 object-contain" />
        ) : (
          <img src="/logo.svg" alt={cafeName || ''} className="w-12 h-12 object-contain" />
        )}
      </div>

      <h2 className="text-xl font-bold" style={{ color: '#F56A1A' }}>
        {cafeName || 'ماهر كيف'}
      </h2>
      <p className="text-xs mt-0.5" style={{ color: '#737373' }}>{secondaryName}</p>

      {description && (
        <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: '#737373' }}>{description}</p>
      )}

      <div className="flex items-center justify-center gap-3 mt-4">
        {settings.show_branch_status && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E6F7E9', color: '#22C55E' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {lang === 'ar' ? settings.branch_status_ar : settings.branch_status_en}
          </div>
        )}

        {settings.location_url && (
          <a
            href={settings.location_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: '#008CA3' }}
          >
            <MapPin size={13} />
            {lang === 'ar' ? 'الموقع' : 'Location'}
          </a>
        )}

        <button
          onClick={handleShare}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: resolvedTheme === 'dark' ? '#252525' : '#F5F5F5' }}
          aria-label="Share"
        >
          <Share2 size={14} style={{ color: '#737373' }} />
        </button>
      </div>
    </div>
  );
}
