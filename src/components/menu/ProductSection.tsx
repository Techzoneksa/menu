"use client";

import type { MenuCategory, ProductWithCategory } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  category: MenuCategory;
  products: ProductWithCategory[];
  onProductClick: (product: ProductWithCategory) => void;
}

export function ProductSection({ category, products, onProductClick }: ProductSectionProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const name = lang === 'ar' ? category.name_ar : category.name_en;

  return (
    <section className="mb-4">
      <div className="flex items-center gap-3 px-4 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#008CA3' }} />
        <h2
          className="text-base font-bold"
          style={{ color: resolvedTheme === 'dark' ? '#F5F5F5' : '#151515' }}
        >
          {name}
        </h2>
        <span className="text-xs" style={{ color: '#737373' }}>
          {products.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </section>
  );
}
