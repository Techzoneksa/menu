"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { useCategoryVisual } from "./useCategoryIcon";
import { CategoryImage } from "./CategoryImage";
import { getImageUrl } from "./getImageUrl";
import type { MenuCategory } from "@/types/menu";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategorySlug: string;
  onCategorySelect: (slug: string) => void;
}

export function CategoryTabs({ categories, activeCategorySlug, onCategorySelect }: CategoryTabsProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const visualMap = useCategoryVisual(categories);

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="sticky top-[56px] z-30"
      style={{
        backgroundColor: isDark ? 'var(--dark-header)' : 'var(--light-background)',
      }}
    >
      <div
        className="flex overflow-x-auto no-scrollbar"
        style={{
          padding: '10px 12px 8px',
          gap: '6px',
        }}
      >
        {categories.map((cat) => {
          const isActive = cat.slug === activeCategorySlug;
          const visual = visualMap.get(cat.id);
          const imgUrl = visual?.imageUrl ? getImageUrl(visual.imageUrl, resolvedTheme) : null;
          const label = lang === 'ar' ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar);

          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.slug)}
              className="flex flex-col items-center shrink-0"
              style={{
                width: '84px',
                gap: '6px',
              }}
            >
              {/* Image circle (only if image_url exists) */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '9999px',
                  backgroundColor: isActive
                    ? 'var(--brand-primary)'
                    : (isDark ? 'var(--dark-card)' : 'var(--light-card)'),
                  border: `2px solid ${isActive ? 'var(--brand-primary)' : (isDark ? 'var(--dark-border)' : 'var(--light-border)')}`,
                  overflow: 'hidden',
                }}
              >
                <CategoryImage imageUrl={imgUrl} label={label} size="md" />
              </div>

              {/* Label */}
              <span
                className="w-full text-center"
                style={{
                  fontSize: '11px',
                  lineHeight: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? 'var(--brand-primary)'
                    : (isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)'),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
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
