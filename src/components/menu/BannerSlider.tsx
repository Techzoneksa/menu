"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MenuBanner } from '@/types/menu';
import { useLanguage } from './LanguageContext';

interface BannerSliderProps {
  banners: MenuBanner[];
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const { lang } = useLanguage();

  const visibleBanners = banners;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(0);
  }, [visibleBanners.length]);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % visibleBanners.length);
  }, [visibleBanners.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + visibleBanners.length) % visibleBanners.length);
  }, [visibleBanners.length]);

  useEffect(() => {
    if (visibleBanners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, visibleBanners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  const handleBannerClick = (banner: MenuBanner) => {
    if (!banner.internal_link) return;
    if (!banner.internal_link.startsWith('/')) return;
    if (banner.internal_link.includes('javascript:') || banner.internal_link.includes('data:')) return;
    window.location.href = banner.internal_link;
  };

  if (visibleBanners.length === 0) return null;

  const banner = visibleBanners[current];
  const title = lang === 'ar' ? banner.title_ar : banner.title_en;
  const description = lang === 'ar' ? banner.description_ar : banner.description_en;

  const bannerContent = (
    <div
      className="relative mx-4 mt-4 rounded-2xl overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[16/7]">
        <img
          src={banner.image_url}
          alt={title || ''}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {(title || description) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            {title && <h3 className="text-white font-bold text-lg">{title}</h3>}
            {description && <p className="text-white/80 text-sm mt-1">{description}</p>}
          </div>
        )}
      </div>

      {visibleBanners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {visibleBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'bg-white/50'}`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (banner.internal_link) {
    return (
      <button onClick={() => handleBannerClick(banner)} className="block w-full text-start">
        {bannerContent}
      </button>
    );
  }

  return bannerContent;
}
