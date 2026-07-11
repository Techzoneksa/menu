"use client";

import type { MenuProduct } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { ProductCard } from './ProductCard';

interface MenuSearchProps {
  results: MenuProduct[];
  onProductClick: (product: MenuProduct) => void;
  query: string;
}

export function MenuSearch({ results, onProductClick, query }: MenuSearchProps) {
  const { lang } = useLanguage();

  if (!query) return null;

  return (
    <div className="px-4 pb-4">
      <p className="text-sm opacity-50 mb-3">
        {lang === 'ar' ? `${results.length} نتيجة` : `${results.length} results`}
      </p>
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm opacity-50">{lang === 'ar' ? 'لم نجد منتجات مطابقة لبحثك' : 'No products match your search'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
