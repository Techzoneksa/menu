"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Search, Sun, Moon, Monitor, Globe, Menu, X, MapPin, Phone, MessageCircle, Mail, AtSign } from 'lucide-react';
import { useThemeContext } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import type { MenuSettings } from '@/types/menu';

interface MobileMenuHeaderProps {
  cafeName: string;
  logoUrl: string | null;
  whiteLogoUrl?: string | null;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  settings?: MenuSettings | null;
}

export function MobileMenuHeader({ cafeName, logoUrl, whiteLogoUrl, onSearchChange, searchQuery, settings }: MobileMenuHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { theme, resolvedTheme, setTheme } = useThemeContext();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const activeLogo = resolvedTheme === 'dark' && whiteLogoUrl ? whiteLogoUrl : logoUrl;

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--light-card)] dark:bg-[var(--dark-card)] border-b border-[var(--light-border)] dark:border-[var(--dark-border)]" style={{ backgroundColor: resolvedTheme === 'dark' ? 'var(--dark-card)' : 'var(--light-card)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <img src={activeLogo || '/logo.svg'} alt={cafeName} className="h-8 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={t.search}
            >
              <Search size={20} />
            </button>

            <button
              onClick={cycleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={t.appearance}
            >
              <ThemeIcon size={20} />
            </button>

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={t.language}
            >
              <Globe size={20} />
            </button>

            <button
              onClick={() => setShowDrawer(true)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={t.menu}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ps-9 pe-4 py-2.5 rounded-xl text-sm bg-[var(--light-background)] dark:bg-[var(--dark-background)] border border-[var(--light-border)] dark:border-[var(--dark-border)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {showDrawer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDrawer(false)} />
          <div
            className="absolute top-0 end-0 h-full w-72 bg-[var(--light-card)] dark:bg-[var(--dark-card)] shadow-xl p-6 flex flex-col gap-1 animate-slide-in-right"
            style={{ backgroundColor: resolvedTheme === 'dark' ? 'var(--dark-card)' : 'var(--light-card)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">{t.menu}</h2>
              <button onClick={() => setShowDrawer(false)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <a href="#top" onClick={() => setShowDrawer(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium">
              {t.home}
            </a>
            <a href="#categories" onClick={() => setShowDrawer(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium">
              {t.categories}
            </a>
            <button
              onClick={() => {
                navigator.share?.({ title: cafeName, url: window.location.href }).catch(() => {
                  navigator.clipboard.writeText(window.location.href);
                });
                setShowDrawer(false);
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
            >
              {t.shareMenu}
            </button>

            {settings?.location_url && (
              <a
                href={settings.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <MapPin size={18} />
                {t.location}
              </a>
            )}

            {(settings?.phone || settings?.whatsapp || settings?.email || settings?.instagram) && (
              <div className="border-t border-[var(--light-border)] dark:border-[var(--dark-border)] my-2 pt-2">
                <p className="px-3 text-xs opacity-40 mb-1 font-medium">{t.contact}</p>
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
                  >
                    <Phone size={16} className="opacity-60" />
                    {settings.phone}
                  </a>
                )}
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
                  >
                    <MessageCircle size={16} className="opacity-60" />
                    WhatsApp
                  </a>
                )}
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
                  >
                    <Mail size={16} className="opacity-60" />
                    {settings.email}
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm"
                  >
                    <AtSign size={16} className="opacity-60" />
                    {settings.instagram}
                  </a>
                )}
              </div>
            )}

            <div className="border-t border-[var(--light-border)] dark:border-[var(--dark-border)] my-2 pt-2">
              <button
                onClick={() => {
                  setLang(lang === 'ar' ? 'en' : 'ar');
                  setShowDrawer(false);
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <Globe size={18} />
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
              <button
                onClick={() => {
                  cycleTheme();
                  setShowDrawer(false);
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <ThemeIcon size={18} />
                {theme === 'light' ? t.lightMode : theme === 'dark' ? t.darkMode : t.systemMode}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
