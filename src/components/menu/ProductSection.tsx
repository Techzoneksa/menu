"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { useCategoryIcon } from "./useCategoryIcon";
import { ProductCard } from "./ProductCard";
import type { ProductWithCategory, MenuCategory } from "@/types/menu";

interface ProductSectionProps {
  category: MenuCategory;
  products: ProductWithCategory[];
  onProductClick?: (product: ProductWithCategory) => void;
}

export function ProductSection({ category, products, onProductClick }: ProductSectionProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';
  const iconMap = useCategoryIcon([category]);
  const icon = iconMap.get(category.id) || '🍽️';

  const catName = lang === 'ar' ? (category.name_ar || category.name_en) : (category.name_en || category.name_ar);

  if (products.length === 0) return null;

  return (
    <div className="px-4">
      {/* Category header */}
      <div className="flex items-center gap-2.5 mb-3 mt-1">
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: '36px',
            height: '36px',
            fontSize: '18px',
            backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
            border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
            borderRadius: '10px',
          }}
        >
          {icon}
        </div>
        <h2
          className="font-bold truncate"
          style={{
            fontSize: '16px',
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
          }}
        >
          {catName}
        </h2>
        <span
          className="shrink-0 rounded-full px-2 py-0.5"
          style={{
            fontSize: '11px',
            fontWeight: 500,
            backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
            color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
          }}
        >
          {products.length}
        </span>
      </div>

      {/* Product list */}
      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>
    </div>
  );
}
