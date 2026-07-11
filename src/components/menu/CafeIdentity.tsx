"use client";

/* eslint-disable @next/next/no-img-element */

import { MapPin, Phone, MessageCircle, Mail, AtSign } from 'lucide-react';
import type { MenuSettings } from '@/types/menu';
import { useLanguage } from './LanguageContext';

interface CafeIdentityProps {
  settings: MenuSettings;
}

export function CafeIdentity({ settings }: CafeIdentityProps) {
  const { lang } = useLanguage();

  const cafeName = lang === 'ar' ? settings.cafe_name_ar : settings.cafe_name_en;
  const description = lang === 'ar' ? settings.description_ar : settings.description_en;

  return (
    <div className="px-4 py-6 text-center">
      {settings.logo_url && (
        <img src={settings.logo_url} alt={cafeName || ''} className="h-16 w-auto mx-auto mb-3 object-contain" />
      )}

      <h2 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>
        {cafeName || 'ماهر كيف'}
      </h2>

      {description && (
        <p className="text-sm mt-2 opacity-70 max-w-xs mx-auto">{description}</p>
      )}

      {settings.show_branch_status && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {lang === 'ar' ? settings.branch_status_ar : settings.branch_status_en}
        </div>
      )}

      {settings.location_url && (
        <a
          href={settings.location_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          <MapPin size={14} />
          {lang === 'ar' ? 'الموقع على الخريطة' : 'View on Map'}
        </a>
      )}

      {(settings.phone || settings.whatsapp || settings.instagram || settings.email) && (
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="p-2.5 rounded-full bg-[var(--light-background)] dark:bg-[var(--dark-background)] opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Phone"
            >
              <Phone size={18} />
            </a>
          )}
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[var(--light-background)] dark:bg-[var(--dark-background)] opacity-60 hover:opacity-100 transition-opacity"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          )}
          {settings.instagram && (
            <a
              href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[var(--light-background)] dark:bg-[var(--dark-background)] opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Instagram"
            >
              <AtSign size={18} />
            </a>
          )}
          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
              className="p-2.5 rounded-full bg-[var(--light-background)] dark:bg-[var(--dark-background)] opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
