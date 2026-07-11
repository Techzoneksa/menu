"use client";

import { useEffect, useRef, useState } from 'react';
import { Coffee, CupSoda, UtensilsCrossed, Cake, type LucideIcon } from 'lucide-react';
import type { MenuCategory } from '@/types/menu';
import { useLanguage } from './LanguageContext';

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  CupSoda,
  UtensilsCrossed,
  Cake,
};

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryClick }: CategoryTabsProps) {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: '-1px 0px 0px 0px' }
    );

    const sentinel = document.getElementById('category-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const visibleCategories = categories.filter(c => c.is_visible);

  return (
    <>
      <div id="category-sentinel" />
      <div
        ref={scrollRef}
        className={`sticky top-14 z-30 bg-[var(--light-background)] dark:bg-[var(--dark-background)] transition-shadow ${
          isSticky ? 'shadow-sm' : ''
        }`}
        style={{ backgroundColor: undefined }}
      >
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {visibleCategories.map((cat) => {
            const Icon = cat.icon ? iconMap[cat.icon] : Coffee;
            const name = lang === 'ar' ? cat.name_ar : cat.name_en;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'bg-[var(--light-card)] dark:bg-[var(--dark-card)] hover:shadow-sm'
                }`}
                style={isActive ? { backgroundColor: 'var(--brand-primary)' } : {}}
              >
                {Icon && <Icon size={16} />}
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
