"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { getImageUrl } from "./getImageUrl";
import type { ProductWithCategory } from "@/types/menu";

interface ProductDetailsSheetProps {
  product: ProductWithCategory | null;
  onClose: () => void;
}

export function ProductDetailsSheet({ product, onClose }: ProductDetailsSheetProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  if (!product) return null;

  const name = lang === 'ar' ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar);
  const desc = lang === 'ar' ? (product.description_ar || product.description_en) : (product.description_en || product.description_ar);
  const imageUrl = getImageUrl(product.image_url, resolvedTheme);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 animate-fade-in"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        style={{
          maxHeight: '85vh',
          backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
          borderRadius: '20px 20px 0 0',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="rounded-full"
            style={{
              width: '36px',
              height: '4px',
              backgroundColor: isDark ? 'var(--dark-border)' : 'var(--light-border)',
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center rounded-full"
          style={{
            width: '28px',
            height: '28px',
            fontSize: '12px',
            backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
            color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
          }}
          dir="ltr"
        >
          ✕
        </button>

        <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: 'calc(85vh - 20px)' }}>
          {/* Image */}
          {imageUrl && (
            <div
              className="relative w-full overflow-hidden mb-4"
              style={{
                height: '220px',
                borderRadius: '14px',
                backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
              }}
            >
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Name */}
          <h2
            className="font-bold"
            style={{
              fontSize: '20px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            }}
          >
            {name}
          </h2>

          {/* Badges */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.is_hot && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5"
                style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#DC2626' }}
              >
                🔥 {lang === 'ar' ? 'ساخن' : 'Hot'}
              </span>
            )}
            {product.is_cold && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5"
                style={{ fontSize: '11px', backgroundColor: '#DBEAFE', color: '#2563EB' }}
              >
                ❄️ {lang === 'ar' ? 'بارد' : 'Cold'}
              </span>
            )}
          </div>

          {/* Description */}
          {desc && (
            <p
              className="mt-3 leading-relaxed"
              style={{
                fontSize: '14px',
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              }}
            >
              {desc}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
