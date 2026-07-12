"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Tag } from 'lucide-react';
import type { ProductWithCategory } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';
import { getImageUrl } from './getImageUrl';

interface ProductDetailsSheetProps {
  product: ProductWithCategory | null;
  onClose: () => void;
}

function ProductSheetContent({ product, onClose }: { product: ProductWithCategory; onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();

  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const description = lang === 'ar' ? product.description_ar : product.description_en;
  const hasDiscount = product.discount_price != null && product.discount_price < (product.price ?? 0);
  const displayPrice = hasDiscount ? product.discount_price : product.price;
  const imgSrc = getImageUrl(product.image_url, resolvedTheme);

  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (e.target === sheetRef.current) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      ref={sheetRef}
      className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
      onClick={handleClickOutside}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-lg mx-auto rounded-t-3xl overflow-hidden animate-slide-up"
        style={{
          maxHeight: '92vh',
          backgroundColor: resolvedTheme === 'dark' ? '#1B1B1B' : '#FFFFFF',
        }}
      >
        <div className="relative overflow-y-auto" style={{ maxHeight: '92vh' }}>
          <div className="relative" style={{ aspectRatio: '16/10' }}>
            {!imgError && product.image_url ? (
              <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: resolvedTheme === 'dark' ? '#252525' : '#F5F5F5' }}
              >
                <span className="text-6xl">☕</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 start-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-lg font-bold" style={{ color: resolvedTheme === 'dark' ? '#F5F5F5' : '#151515' }}>
                  {name}
                </h2>
                {description && (
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: '#737373' }}>
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {hasDiscount && (
                <span className="text-sm line-through opacity-50" style={{ color: '#737373' }}>
                  {product.price?.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-bold" style={{ color: '#F56A1A' }}>
                {displayPrice?.toFixed(2)} {lang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
              {hasDiscount && product.price != null && product.discount_price != null && (
                <span
                  className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#E6F7E9', color: '#22C55E' }}
                >
                  <Tag size={12} />
                  {Math.round(((product.price - product.discount_price) / product.price) * 100)}% {lang === 'ar' ? 'خصم' : 'OFF'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsSheet({ product, onClose }: ProductDetailsSheetProps) {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  return <ProductSheetContent key={product.id} product={product} onClose={onClose} />;
}
