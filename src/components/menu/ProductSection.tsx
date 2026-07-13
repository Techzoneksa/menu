"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { useCategoryVisual } from "./useCategoryIcon";
import { CategoryImage } from "./CategoryImage";
import { getImageUrl } from "./getImageUrl";
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
  const visualMap = useCategoryVisual([category]);
  const visual = visualMap.get(category.id);
  const imgUrl = visual?.imageUrl ? getImageUrl(visual.imageUrl, resolvedTheme) : null;

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
        <CategoryImage imageUrl={imgUrl} label={catName} size="sm" rounded />
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
