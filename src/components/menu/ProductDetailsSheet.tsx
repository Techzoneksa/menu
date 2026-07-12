"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useCallback, useState } from 'react';
import { X, Share2 } from 'lucide-react';
import type { MenuProduct } from '@/types/menu';
import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';
import { formatPrice, formatCalories, getLocalizedName, getLocalizedDescription } from '@/lib/formatters';

interface ProductDetailsSheetProps {
  product: MenuProduct | null;
  onClose: () => void;
}

export function ProductDetailsSheet({ product, onClose }: ProductDetailsSheetProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (product) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }
  }, [product, handleKeyDown]);

  if (!product) return null;

  const name = getLocalizedName(product, lang);
  const secondaryName = getLocalizedName(product, lang === 'ar' ? 'en' : 'ar');
  const description = getLocalizedDescription(product, lang);
  const badge = lang === 'ar' ? product.badge_ar : product.badge_en;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const hasVariants = product.variants && product.variants.length > 0;
  const visibleVariants = (product.variants || []).filter(v => v.is_visible);
  const addonGroups = product.addon_groups || [];
  const visibleAddonGroups = addonGroups.filter(ag => ag.is_visible);
  const additionalImages = (product.images || []).filter(img => img.is_visible).sort((a, b) => a.sort_order - b.sort_order);

  const handleShare = async () => {
    const url = `${window.location.origin}/menu?product=${product.slug}`;
    try {
      await navigator.share({ title: name, url });
    } catch {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        ref={sheetRef}
        className="absolute bottom-0 start-0 end-0 max-h-[85vh] rounded-t-3xl overflow-y-auto animate-slide-up"
        role="dialog"
        aria-label={name}
        dir={dir}
        style={{ backgroundColor: resolvedTheme === 'dark' ? 'var(--dark-card)' : 'var(--light-card)' }}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center px-4 py-3 border-b border-[var(--light-border)] dark:border-[var(--dark-border)]" style={{ backgroundColor: resolvedTheme === 'dark' ? 'var(--dark-card)' : 'var(--light-card)' }}>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
            <X size={20} />
          </button>
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="Share">
            <Share2 size={20} />
          </button>
        </div>

        {product.image_url && (
          <div className="px-4 pt-4">
            <img
              src={product.image_url}
              alt={name}
              className="w-full h-56 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              onClick={() => setLightboxImage({ src: product.image_url!, alt: name })}
            />
          </div>
        )}

        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{name}</h2>
            {badge && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--brand-primary)] text-white shrink-0">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm opacity-50 mt-0.5">{secondaryName}</p>

          <div className="flex items-center gap-4 mt-3">
            {product.price !== null && (
              <span className="text-lg font-bold" style={{ color: 'var(--brand-primary)' }}>
                {formatPrice(product.price, lang)}
              </span>
            )}
            {product.calories !== null && (
              <span className="text-sm opacity-50">{formatCalories(product.calories, lang)}</span>
            )}
          </div>

          {description && (
            <div className="mt-4">
              <p className="text-sm opacity-70 leading-relaxed">{description}</p>
            </div>
          )}

          {additionalImages.length > 0 && (
            <div className="mt-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {additionalImages.map(img => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt={(lang === 'ar' ? img.alt_ar : img.alt_en) || name}
                    className="h-24 w-24 object-cover rounded-xl shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    loading="lazy"
                    onClick={() => setLightboxImage({ src: img.image_url, alt: (lang === 'ar' ? img.alt_ar : img.alt_en) || name })}
                  />
                ))}
              </div>
            </div>
          )}

          {hasVariants && visibleVariants.length > 0 && (
            <div className="mt-5">
              <h3 className="font-bold text-sm mb-3">{lang === 'ar' ? 'الأحجام المتوفرة' : 'Available Sizes'}</h3>
              <div className="flex flex-col gap-3">
                {visibleVariants.map(variant => (
                  <div key={variant.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--light-background)] dark:bg-[var(--dark-background)]">
                    <div>
                      <p className="font-medium text-sm">{lang === 'ar' ? variant.name_ar : variant.name_en}</p>
                      {variant.calories && (
                        <p className="text-xs opacity-50 mt-0.5">{formatCalories(variant.calories, lang)}</p>
                      )}
                    </div>
                    <span className="font-bold text-sm" style={{ color: 'var(--brand-primary)' }}>
                      {formatPrice(variant.price, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleAddonGroups.length > 0 && (
            <div className="mt-5">
              <h3 className="font-bold text-sm mb-3">{lang === 'ar' ? 'الإضافات المتوفرة' : 'Available Add-ons'}</h3>
              {visibleAddonGroups.map(group => (
                <div key={group.id} className="mb-3">
                  {(group.items || []).filter(i => i.is_visible).map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm">{lang === 'ar' ? item.name_ar : item.name_en}</p>
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
                        {lang === 'ar' ? `+${item.price} ر.س` : `+SAR ${item.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {!product.is_available && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
              <span className="text-red-500 text-sm font-medium">
                {lang === 'ar' ? 'غير متوفر' : 'Unavailable'}
              </span>
            </div>
          )}

          <div className="h-8 safe-bottom" />
        </div>
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90" onClick={() => setLightboxImage(null)}>
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 end-4 text-white p-2"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
