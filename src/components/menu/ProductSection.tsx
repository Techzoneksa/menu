"use client";

import { forwardRef } from 'react';
import type { MenuCategory, MenuProduct } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  category: MenuCategory;
  products: MenuProduct[];
  onProductClick: (product: MenuProduct) => void;
}

export const ProductSection = forwardRef<HTMLDivElement, ProductSectionProps>(
  ({ category, products, onProductClick }, ref) => {
    const { lang } = useLanguage();
    const name = lang === 'ar' ? category.name_ar : category.name_en;
    const visibleProducts = products.filter(p => p.is_visible);

    if (visibleProducts.length === 0) return null;

    return (
      <div ref={ref} id={`category-${category.id}`} className="scroll-mt-28">
        <h2 className="text-lg font-bold px-4 mb-3">{name}</h2>
        <div className="flex flex-col gap-2 px-4">
          {visibleProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      </div>
    );
  }
);

ProductSection.displayName = 'ProductSection';
