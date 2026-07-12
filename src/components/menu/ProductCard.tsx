"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Tag } from 'lucide-react';
import type { ProductWithCategory } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';
import { getImageUrl } from './getImageUrl';

interface ProductCardProps {
  product: ProductWithCategory;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const description = lang === 'ar' ? product.description_ar : product.description_en;
  const hasDiscount = product.discount_price != null && product.discount_price < (product.price ?? 0);
  const displayPrice = hasDiscount ? product.discount_price : product.price;

  const imgSrc = getImageUrl(product.image_url, resolvedTheme);

  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 p-3 rounded-2xl text-start transition-all duration-200 border"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#1B1B1B' : '#FFFFFF',
        borderColor: resolvedTheme === 'dark' ? '#303030' : '#F0F0F0',
      }}
    >
      <div
        className="w-[72px] h-[72px] rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: resolvedTheme === 'dark' ? '#252525' : '#F5F5F5' }}
      >
        {!imgError && product.image_url ? (
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl">☕</span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3
          className="text-sm font-bold truncate"
          style={{ color: resolvedTheme === 'dark' ? '#F5F5F5' : '#151515' }}
        >
          {name}
        </h3>
        {description && (
          <p
            className="text-xs mt-0.5 line-clamp-2 leading-relaxed"
            style={{ color: '#737373' }}
          >
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-xs line-through opacity-50" style={{ color: '#737373' }}>
                {product.price?.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-bold" style={{ color: '#F56A1A' }}>
              {displayPrice?.toFixed(2)} {lang === 'ar' ? 'ر.س' : 'SAR'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {product.is_hot && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                🔥 {lang === 'ar' ? 'حار' : 'Hot'}
              </span>
            )}
            {product.is_cold && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                ❄️ {lang === 'ar' ? 'بارد' : 'Cold'}
              </span>
            )}
            {hasDiscount && product.price != null && product.discount_price != null && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: '#E6F7E9', color: '#22C55E' }}
              >
                <Tag size={10} />
                {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
