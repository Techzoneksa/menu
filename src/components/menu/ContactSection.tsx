"use client";

import { useLanguage } from './LanguageContext';
import { useThemeContext } from './ThemeContext';
import type { MenuSettings } from '@/types/menu';
import {
  PhoneIcon,
  WhatsAppIcon,
  MessageSquareIcon,
  InstagramIcon,
  SnapchatIcon,
  TikTokIcon,
  XIcon,
  FacebookIcon,
} from './ContactIcons';

interface ContactSectionProps {
  settings: MenuSettings | null;
}

function digitsOnly(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

function buildWaUrl(whatsappNumber: string, message: string): string {
  const number = digitsOnly(whatsappNumber);
  const text = encodeURIComponent(message);
  if (!number) return '';
  return `https://wa.me/${number}?text=${text}`;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  if (!settings || settings.show_contact_section === false) return null;

  const phone = settings.contact_phone || '';
  const whatsapp = settings.contact_whatsapp || '';
  const username = settings.contact_social_username || '@MAHERKAIFSA';

  const instagram = settings.contact_instagram_url || '';
  const snapchat = settings.contact_snapchat_url || '';
  const tiktok = settings.contact_tiktok_url || '';
  const x = settings.contact_x_url || '';
  const facebook = settings.contact_facebook_url || '';

  const suggestionsMsg = lang === 'ar'
    ? (settings.contact_suggestions_msg_ar || 'السلام عليكم،\nلدي ملاحظة أو شكوى بخصوص منيو ماهر كيف.')
    : (settings.contact_suggestions_msg_en || 'Hello,\nI have a suggestion or complaint regarding Maher Kaif Menu.');

  const socials = [
    { key: 'instagram', url: instagram, Icon: InstagramIcon, label: 'Instagram' },
    { key: 'snapchat', url: snapchat, Icon: SnapchatIcon, label: 'Snapchat' },
    { key: 'tiktok', url: tiktok, Icon: TikTokIcon, label: 'TikTok' },
    { key: 'x', url: x, Icon: XIcon, label: 'X' },
    { key: 'facebook', url: facebook, Icon: FacebookIcon, label: 'Facebook' },
  ].filter(s => !!s.url);

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDark ? 'var(--dark-card)' : '#FFFFFF',
    borderColor: isDark ? 'var(--dark-border)' : 'var(--light-border)',
    borderWidth: 1,
  };

  const primaryTextStyle: React.CSSProperties = {
    color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
  };

  const secondaryTextStyle: React.CSSProperties = {
    color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
  };

  const telHref = phone ? `tel:${digitsOnly(phone)}` : undefined;
  const waHref = buildWaUrl(whatsapp, '');

  return (
    <section
      aria-label={lang === 'ar' ? 'تواصل معنا' : 'Contact & Support'}
      className="mx-auto"
      style={{
        maxWidth: '480px',
        padding: '0 16px 32px',
      }}
    >
      <div
        className="rounded-2xl"
        style={{
          ...cardStyle,
          padding: '20px 16px',
          borderRadius: 20,
        }}
      >
        <div className="text-center" style={{ paddingBottom: '16px' }}>
          <h2
            className="font-bold"
            style={{ fontSize: 16, ...primaryTextStyle }}
          >
            {lang === 'ar' ? 'تواصل معنا' : 'Contact & Support'}
          </h2>
          <p
            className="mt-1"
            style={{ fontSize: 12, ...secondaryTextStyle }}
          >
            {lang === 'ar' ? 'نحن هنا لخدمتك' : 'We are here to help'}
          </p>
        </div>

        <div style={{ height: 1, backgroundColor: isDark ? 'var(--dark-border)' : 'var(--light-border)', marginBottom: 16 }} />

        {phone && (
          <a
            href={telHref}
            className="flex items-center gap-3"
            style={{
              padding: '14px 12px',
              borderRadius: 14,
              backgroundColor: isDark ? 'var(--dark-elevated)' : 'var(--light-hover)',
              marginBottom: 12,
              minHeight: 52,
              textDecoration: 'none',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'var(--brand-primary)',
                color: '#fff',
              }}
            >
              <PhoneIcon size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 11, ...secondaryTextStyle }}>
                {lang === 'ar' ? 'اتصل بنا' : 'Call Us'}
              </p>
              <p
                className="font-semibold"
                style={{ fontSize: 15, ...primaryTextStyle, direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left' }}
              >
                {phone}
              </p>
            </div>
          </a>
        )}

        {whatsapp && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
            style={{
              padding: '14px 12px',
              borderRadius: 14,
              backgroundColor: isDark ? 'var(--dark-elevated)' : 'var(--light-hover)',
              marginBottom: 16,
              minHeight: 52,
              textDecoration: 'none',
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#25D366',
                color: '#fff',
              }}
            >
              <WhatsAppIcon size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 11, ...secondaryTextStyle }}>
                {lang === 'ar' ? 'تواصل عبر' : 'Chat on'}
              </p>
              <p
                className="font-semibold"
                style={{ fontSize: 15, ...primaryTextStyle }}
              >
                WhatsApp
              </p>
            </div>
          </a>
        )}

        {socials.length > 0 && (
          <>
            <div className="flex items-center justify-center" style={{ gap: 12, padding: '4px 0 12px' }}>
              {socials.map(({ key, url, Icon, label }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'var(--dark-elevated)' : 'var(--light-hover)',
                    color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                    border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                    textDecoration: 'none',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            {username && (
              <div className="text-center" style={{ paddingBottom: 8 }}>
                <a
                  href={instagram || x || tiktok || facebook || snapchat || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-semibold"
                  style={{
                    fontSize: 14,
                    color: 'var(--brand-primary)',
                    textDecoration: 'none',
                    direction: 'ltr',
                  }}
                >
                  {username}
                </a>
              </div>
            )}
          </>
        )}

        {whatsapp && (
          <a
            href={buildWaUrl(whatsapp, suggestionsMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full"
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              backgroundColor: 'transparent',
              color: 'var(--brand-primary)',
              border: '1.5px solid var(--brand-primary)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              minHeight: 52,
              marginTop: 8,
            }}
          >
            <MessageSquareIcon size={20} />
            <span>{lang === 'ar' ? 'الملاحظات والشكاوى' : 'Suggestions & Complaints'}</span>
          </a>
        )}
      </div>
    </section>
  );
}
