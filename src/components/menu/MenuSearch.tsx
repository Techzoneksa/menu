"use client";

import { Search, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';

interface MenuSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
}

export function MenuSearch({ query, onQueryChange, resultCount }: MenuSearchProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();

  return (
    <div className="px-4 pt-3">
      <div className="relative">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2" style={{ color: '#737373' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
          className="w-full ps-9 pe-10 py-2.5 rounded-xl text-sm outline-none border transition-colors"
          style={{
            backgroundColor: resolvedTheme === 'dark' ? '#1B1B1B' : '#F5F5F5',
            borderColor: resolvedTheme === 'dark' ? '#303030' : '#F0F0F0',
            color: resolvedTheme === 'dark' ? '#F5F5F5' : '#151515',
          }}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        />
        {query && (
          <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span className="text-xs" style={{ color: '#737373' }}>
              {resultCount}
            </span>
            <button onClick={() => onQueryChange('')}>
              <X size={14} style={{ color: '#737373' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
