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
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);
  const { lang } = useLanguage();

  const visibleBanners = banners;

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % visibleBanners.length);
  }, [visibleBanners.length]);

  useEffect(() => {
    if (visibleBanners.length <= 1 || paused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next, visibleBanners.length, paused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDelta.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current < 0) {
        setCurrent(prev => (prev + 1) % visibleBanners.length);
      } else {
        setCurrent(prev => (prev - 1 + visibleBanners.length) % visibleBanners.length);
      }
    }
    touchDelta.current = 0;
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
      className="relative mx-4 mt-3 overflow-hidden"
      style={{ borderRadius: 20, aspectRatio: '16/7' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        src={banner.image_url}
        alt={title || ''}
        className="w-full h-full object-cover"
        loading="eager"
      />
      {(title || description) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5">
          {title && <h3 className="text-white font-bold text-lg drop-shadow">{title}</h3>}
          {description && <p className="text-white/80 text-sm mt-0.5 drop-shadow">{description}</p>}
        </div>
      )}
      {visibleBanners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {visibleBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              }}
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
