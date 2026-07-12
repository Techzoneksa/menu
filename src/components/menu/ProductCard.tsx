"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { getImageUrl } from "./getImageUrl";
import type { ProductWithCategory } from "@/types/menu";

interface ProductCardProps {
  product: ProductWithCategory;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  const name = lang === 'ar' ? (product.name_ar || product.name_en) : (product.name_en || product.name_ar);
  const desc = lang === 'ar' ? (product.description_ar || product.description_en) : (product.description_en || product.description_ar);
  const imageUrl = getImageUrl(product.image_url, resolvedTheme);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center text-start rounded-xl transition-colors"
      style={{
        padding: '10px',
        gap: '12px',
        backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
        border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
      }}
    >
      {/* Image */}
      <div
        className="relative shrink-0 overflow-hidden rounded-lg"
        style={{
          width: '68px',
          height: '68px',
          backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="68px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl opacity-20">
            🍽️
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3
          className="font-semibold truncate"
          style={{
            fontSize: '13px',
            lineHeight: '18px',
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
          }}
        >
          {name}
        </h3>
        {desc && (
          <p
            style={{
              fontSize: '11px',
              lineHeight: '15px',
              marginTop: '2px',
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {desc}
          </p>
        )}

        {/* Badges */}
        {(product.is_hot || product.is_cold) && (
          <div className="flex items-center" style={{ gap: '6px', marginTop: '4px' }}>
            {product.is_hot && (
              <span
                className="inline-flex items-center rounded-full"
                style={{
                  padding: '1px 6px',
                  fontSize: '9px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                }}
              >
                🔥 {lang === 'ar' ? 'ساخن' : 'Hot'}
              </span>
            )}
            {product.is_cold && (
              <span
                className="inline-flex items-center rounded-full"
                style={{
                  padding: '1px 6px',
                  fontSize: '9px',
                  lineHeight: '16px',
                  fontWeight: 500,
                  backgroundColor: '#DBEAFE',
                  color: '#2563EB',
                }}
              >
                ❄️ {lang === 'ar' ? 'بارد' : 'Cold'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Arrow */}
      <span
        className="shrink-0"
        style={{
          fontSize: '16px',
          color: isDark ? 'var(--dark-border)' : '#D4D4D4',
        }}
      >
        {isArabic(lang) ? '‹' : '›'}
      </span>
    </button>
  );
}

function isArabic(lang: string) {
  return lang === 'ar';
}
