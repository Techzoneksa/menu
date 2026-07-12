"use client";

import { useRef, useEffect } from 'react';
import type { MenuCategory } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';
import { getCategoryIcon } from './useCategoryIcon';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategorySlug: string;
  onCategorySelect: (slug: string) => void;
}

export function CategoryTabs({ categories, activeCategorySlug, onCategorySelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset = elRect.left - containerRect.left - containerRect.width / 2 + elRect.width / 2;
      container.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, [activeCategorySlug]);

  return (
    <section id="categories" className="mt-3">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar gap-2.5 px-4 pb-3"
        >
          {categories.map(cat => {
            const name = lang === 'ar' ? cat.name_ar : cat.name_en;
            const isActive = cat.slug === activeCategorySlug;
            const icon = getCategoryIcon(cat);
            return (
              <button
                key={cat.id}
                ref={isActive ? activeRef : null}
                onClick={() => onCategorySelect(cat.slug)}
                className="flex flex-col items-center gap-1.5 shrink-0 min-w-[64px] transition-all duration-200"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-200 border-2"
                  style={{
                    backgroundColor: isActive ? '#008CA3' : resolvedTheme === 'dark' ? '#252525' : '#F5F5F5',
                    borderColor: isActive ? '#008CA3' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#737373',
                  }}
                >
                  {icon}
                </div>
                <span
                  className="text-xs font-medium text-center leading-tight whitespace-nowrap"
                  style={{ color: isActive ? '#008CA3' : resolvedTheme === 'dark' ? '#999999' : '#737373' }}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
