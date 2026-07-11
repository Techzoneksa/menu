"use client";

/* eslint-disable @next/next/no-img-element */

import type { MenuProduct } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { formatPrice, getLocalizedBadge } from '@/lib/formatters';

interface ProductCardProps {
  product: MenuProduct;
  onClick: (product: MenuProduct) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { lang } = useLanguage();
  const badge = getLocalizedBadge(product, lang);
  const hasImage = !!product.image_url;
  const minPrice = product.variants && product.variants.length > 0
    ? Math.min(...product.variants.filter(v => v.is_visible).map(v => v.price))
    : product.price;

  return (
    <button
      onClick={() => onClick(product)}
      className={`w-full text-start bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${!product.is_available ? 'opacity-60' : ''}`}
    >
      <div className={`flex ${hasImage ? 'gap-3 p-3' : 'p-4'}`}>
        {hasImage && (
          <img
            src={product.image_url!}
            alt={lang === 'ar' ? product.name_ar : product.name_en}
            className="w-20 h-20 object-cover rounded-lg shrink-0"
            loading="lazy"
          />
        )}
        <div className={`flex-1 min-w-0 ${!hasImage ? 'flex flex-col justify-center' : ''}`}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm leading-tight">{lang === 'ar' ? product.name_ar : product.name_en}</p>
            {badge && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>
                {badge}
              </span>
            )}
          </div>
          {lang === 'en' && product.name_ar !== product.name_en && (
            <p className="text-xs text-gray-400 mt-0.5">{product.name_ar}</p>
          )}
          {lang === 'ar' && product.name_ar !== product.name_en && (
            <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{product.name_en}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            {minPrice !== null && minPrice !== undefined && (
              <span className="text-sm font-bold" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(minPrice, lang)}
              </span>
            )}
            {product.calories !== null && product.calories !== undefined && (
              <span className="text-xs text-gray-400">{product.calories} {lang === 'ar' ? 'سعرة' : 'cal'}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
