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
  const nameEn = lang === 'ar' ? product.name_en : null;
  const desc = lang === 'ar' ? (product.description_ar || product.description_en) : (product.description_en || product.description_ar);
  const imageUrl = getImageUrl(product.image_url, resolvedTheme);

  const variants = (product.variants || []).filter(v => v.is_visible !== false);
  const addonGroups = (product.addon_groups || []).filter(g => g.is_visible !== false);

  const hasPrice = product.price != null;
  const hasCalories = product.calories != null;

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

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 20px)', padding: '0 20px 32px' }}>
          {/* Image */}
          {imageUrl && (
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: '200px',
                borderRadius: '14px',
                marginBottom: '14px',
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
              fontSize: '18px',
              lineHeight: '24px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            }}
          >
            {name}
          </h2>

          {/* English name if different */}
          {nameEn && (
            <p
              style={{
                fontSize: '13px',
                lineHeight: '18px',
                marginTop: '2px',
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              }}
            >
              {nameEn}
            </p>
          )}

          {/* Price & Calories */}
          <div className="flex items-center flex-wrap" style={{ gap: '12px', marginTop: '8px' }}>
            {hasPrice && (
              <span
                className="font-bold"
                style={{
                  fontSize: '16px',
                  color: 'var(--brand-secondary)',
                }}
              >
                {product.price} {lang === 'ar' ? 'ر.س' : 'SAR'}
              </span>
            )}
            {hasCalories && (
              <span
                style={{
                  fontSize: '12px',
                  color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
                }}
              >
                {product.calories} {lang === 'ar' ? 'سعرة' : 'cal'}
              </span>
            )}
          </div>

          {/* Badges */}
          {(product.is_hot || product.is_cold) && (
            <div className="flex items-center" style={{ gap: '6px', marginTop: '8px' }}>
              {product.is_hot && (
                <span
                  className="inline-flex items-center rounded-full"
                  style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#FEE2E2', color: '#DC2626' }}
                >
                  🔥 {lang === 'ar' ? 'ساخن' : 'Hot'}
                </span>
              )}
              {product.is_cold && (
                <span
                  className="inline-flex items-center rounded-full"
                  style={{ padding: '2px 8px', fontSize: '11px', backgroundColor: '#DBEAFE', color: '#2563EB' }}
                >
                  ❄️ {lang === 'ar' ? 'بارد' : 'Cold'}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {desc && (
            <p
              style={{
                fontSize: '13px',
                lineHeight: '20px',
                marginTop: '12px',
                color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
              }}
            >
              {desc}
            </p>
          )}

          {/* Variants / Sizes */}
          {variants.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h3
                className="font-bold"
                style={{
                  fontSize: '14px',
                  color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                  marginBottom: '8px',
                }}
              >
                {lang === 'ar' ? 'الأحجام' : 'Sizes'}
              </h3>
              <div className="flex flex-col" style={{ gap: '6px' }}>
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
                      border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                    }}
                  >
                    <div className="flex flex-col">
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                        }}
                      >
                        {lang === 'ar' ? variant.name_ar : variant.name_en}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ gap: '10px' }}>
                      {variant.calories != null && (
                        <span
                          style={{
                            fontSize: '11px',
                            color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
                          }}
                        >
                          {variant.calories} {lang === 'ar' ? 'سعرة' : 'cal'}
                        </span>
                      )}
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: '13px',
                          color: 'var(--brand-secondary)',
                        }}
                      >
                        {variant.price} {lang === 'ar' ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addon Groups */}
          {addonGroups.length > 0 && addonGroups.some(g => (g.items || []).length > 0) && (
            <div style={{ marginTop: '16px' }}>
              <h3
                className="font-bold"
                style={{
                  fontSize: '14px',
                  color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                  marginBottom: '8px',
                }}
              >
                {lang === 'ar' ? 'الإضافات المتوفرة' : 'Available Add-ons'}
              </h3>
              {addonGroups
                .filter(group => (group.items || []).length > 0)
                .map((group) => (
                <div key={group.id} style={{ marginBottom: '10px' }}>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    {lang === 'ar' ? group.name_ar : group.name_en}
                  </p>
                  <div className="flex flex-col" style={{ gap: '4px' }}>
                    {(group.items || [])
                      .filter(item => item.is_visible !== false)
                      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                      .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '13px',
                            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                          }}
                        >
                          {lang === 'ar' ? item.name_ar : item.name_en}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: 'var(--brand-secondary)',
                          }}
                        >
                          +{item.price} {lang === 'ar' ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
