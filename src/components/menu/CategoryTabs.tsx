"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { useCategoryIcon } from "./useCategoryIcon";
import type { MenuCategory } from "@/types/menu";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategorySlug: string;
  onCategorySelect: (slug: string) => void;
}

export function CategoryTabs({ categories, activeCategorySlug, onCategorySelect }: CategoryTabsProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const iconMap = useCategoryIcon(categories);

  const isDark = resolvedTheme === 'dark';
  const activeBg = 'var(--brand-primary)';
  const inactiveBg = isDark ? 'var(--dark-card)' : 'var(--light-card)';
  const inactiveBorder = isDark ? 'var(--dark-border)' : 'var(--light-border)';
  const textColor = isDark ? 'var(--dark-text)' : 'var(--light-text)';

  return (
    <div
      className="sticky top-[56px] z-30 px-3 py-2.5"
      style={{
        backgroundColor: isDark ? 'var(--dark-background)' : 'var(--light-background)',
      }}
    >
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = cat.slug === activeCategorySlug;
          const icon = iconMap.get(cat.id) || '🍽️';
          const label = lang === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar);

          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.slug)}
              className="flex flex-col items-center shrink-0 transition-all duration-200"
              style={{
                width: '74px',
                gap: '5px',
              }}
            >
              <div
                className="flex items-center justify-center rounded-full transition-all duration-200"
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: isActive ? activeBg : inactiveBg,
                  border: `1.5px solid ${isActive ? activeBg : inactiveBorder}`,
                  fontSize: '22px',
                  lineHeight: 1,
                  color: isActive ? '#fff' : textColor,
                }}
              >
                {icon}
              </div>
              <span
                className="text-center leading-tight truncate w-full"
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? activeBg : (isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'),
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
