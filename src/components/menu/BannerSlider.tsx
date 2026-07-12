"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import { getImageUrl } from "./getImageUrl";
import type { MenuBanner } from "@/types/menu";

interface BannerSliderProps {
  banners: MenuBanner[];
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  const visibleBanners = banners.filter((b) => b.is_visible !== false);

  const next = useCallback(() => {
    if (visibleBanners.length <= 1) return;
    setCurrent((prev) => (prev + 1) % visibleBanners.length);
  }, [visibleBanners.length]);

  useEffect(() => {
    if (visibleBanners.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, visibleBanners.length]);

  if (visibleBanners.length === 0) return null;

  return (
    <div className="px-4 mt-2.5">
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: '180px',
          borderRadius: '14px',
        }}
      >
        {visibleBanners.map((banner, idx) => {
          const imgUrl = getImageUrl(banner.image_url, resolvedTheme);
          if (!imgUrl) return null;

          return (
            <div
              key={banner.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
            >
              <Image
                src={imgUrl}
                alt={lang === 'ar' ? (banner.title_ar || '') : (banner.title_en || '')}
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                className="object-cover"
                priority={idx === 0}
                unoptimized
              />
            </div>
          );
        })}
      </div>

      {visibleBanners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2.5">
          {visibleBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === current ? '20px' : '6px',
                height: '6px',
                backgroundColor: idx === current ? 'var(--brand-primary)' : (isDark ? 'var(--dark-border)' : '#D4D4D4'),
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
