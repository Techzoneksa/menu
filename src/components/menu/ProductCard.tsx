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
      className="w-full flex items-center gap-3 p-2.5 text-start transition-colors rounded-xl"
      style={{
        backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
        border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
      }}
    >
      {/* Image */}
      <div
        className="relative shrink-0 overflow-hidden rounded-lg"
        style={{
          width: '72px',
          height: '72px',
          backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="72px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
            🍽️
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3
          className="font-semibold truncate"
          style={{
            fontSize: '14px',
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
          }}
        >
          {name}
        </h3>
        {desc && (
          <p
            className="mt-0.5 line-clamp-2"
            style={{
              fontSize: '12px',
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

        {/* Hot / Cold badges */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {product.is_hot && (
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5"
              style={{
                fontSize: '10px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
              }}
            >
              🔥 {lang === 'ar' ? 'ساخن' : 'Hot'}
            </span>
          )}
          {product.is_cold && (
            <span
              className="inline-flex items-center rounded-full px-1.5 py-0.5"
              style={{
                fontSize: '10px',
                backgroundColor: '#DBEAFE',
                color: '#2563EB',
              }}
            >
              ❄️ {lang === 'ar' ? 'بارد' : 'Cold'}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <span
        className="shrink-0 text-xs"
        style={{
          color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
          transform: lang === 'ar' ? 'scaleX(-1)' : undefined,
        }}
      >
        ›
      </span>
    </button>
  );
}
