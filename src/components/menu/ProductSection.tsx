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
    <div style={{ padding: '0 16px' }}>
      {/* Category section header */}
      <div
        className="flex items-center"
        style={{
          gap: '8px',
          marginBottom: '10px',
          marginTop: '4px',
        }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: '28px',
            height: '28px',
            fontSize: '15px',
            backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
            border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
            borderRadius: '8px',
          }}
        >
          {icon}
        </div>
        <h2
          className="font-bold truncate min-w-0"
          style={{
            fontSize: '14px',
            lineHeight: '20px',
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
          }}
        >
          {catName}
        </h2>
        <span
          className="shrink-0 rounded-full"
          style={{
            padding: '1px 8px',
            fontSize: '10px',
            lineHeight: '18px',
            fontWeight: 500,
            backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
            color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
          }}
        >
          {products.length}
        </span>
      </div>

      {/* Product cards */}
      <div className="flex flex-col" style={{ gap: '8px' }}>
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
