"use client";

import { useLanguage } from "./LanguageContext";
import { useThemeContext } from "./ThemeContext";
import type { MenuSettings } from "@/types/menu";

interface MenuNoticeProps {
  settings: MenuSettings | null;
}

interface Allergen {
  ar: string;
  en: string;
}

const ALLERGENS: Allergen[] = [
  { ar: 'حبوب', en: 'Grain' },
  { ar: 'ترمس', en: 'Lupini' },
  { ar: 'البيض', en: 'Egg' },
  { ar: 'الكبريتيت', en: 'Sulfite' },
  { ar: 'الفول السوداني', en: 'Peanut' },
  { ar: 'الصويا', en: 'Soy' },
  { ar: 'الخردل', en: 'Mustard' },
  { ar: 'المكسرات', en: 'Nuts' },
  { ar: 'الحليب', en: 'Milk' },
  { ar: 'السمك', en: 'Fish' },
];

export function MenuNotice({ settings }: MenuNoticeProps) {
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';
  const isArabic = lang === 'ar';

  if (!settings) return null;

  const showSection = settings.show_menu_notice !== false;
  if (!showSection) return null;

  const showAllergens = settings.show_allergen_legend !== false;

  const vatText = isArabic
    ? (settings.vat_notice_ar || 'جميع الأسعار شاملة ضريبة القيمة المضافة 15٪')
    : (settings.vat_notice_en || 'All prices include 15% VAT');

  const caloriesText = isArabic
    ? (settings.calories_notice_ar ||
        'يحتاج الرجال تقريبًا إلى 2500 سعرة حرارية يوميًا\nتحتاج النساء تقريبًا إلى 2000 سعرة حرارية يوميًا\nيحتاج الأطفال تقريبًا إلى 1800 سعرة حرارية يوميًا')
    : (settings.calories_notice_en ||
        'Men need approximately 2,500 calories per day\nWomen need approximately 2,000 calories per day\nChildren need approximately 1,800 calories per day');

  const caloriesLines = caloriesText.split('\n').filter(Boolean);

  return (
    <section
      aria-label={isArabic ? 'معلومات ضريبة وسعرات حرارية' : 'VAT and calorie information'}
      style={{
        padding: '14px 16px',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: isDark ? 'var(--dark-card)' : 'var(--light-card)',
          border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
        }}
      >
        {/* VAT notice */}
        <div>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '6px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            }}
          >
            {isArabic ? 'الضريبة' : 'VAT'}
          </h3>
          <p
            style={{
              fontSize: '12px',
              lineHeight: '18px',
              color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
            }}
          >
            {vatText}
          </p>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            backgroundColor: isDark ? 'var(--dark-border)' : 'var(--light-border)',
            marginTop: '14px',
            marginBottom: '14px',
          }}
        />

        {/* Calorie guidance */}
        <div>
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '6px',
              color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            }}
          >
            {isArabic ? 'الإرشاد اليومي للسعرات' : 'Daily Calorie Guidance'}
          </h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >
            {caloriesLines.map((line, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '12px',
                  lineHeight: '20px',
                  color: isDark ? 'var(--dark-text-secondary)' : 'var(--light-text-secondary)',
                }}
              >
                <span aria-hidden="true" style={{ marginInlineEnd: '6px' }}>•</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Allergen legend */}
        {showAllergens && (
          <>
            <div
              aria-hidden="true"
              style={{
                height: '1px',
                backgroundColor: isDark ? 'var(--dark-border)' : 'var(--light-border)',
                marginTop: '14px',
                marginBottom: '14px',
              }}
            />

            <div>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                }}
              >
                {isArabic ? 'مسببات الحساسية' : 'Allergens'}
              </h3>
              <div
                className="overflow-x-auto no-scrollbar"
                style={{
                  display: 'flex',
                  gap: '6px',
                  paddingBottom: '2px',
                }}
                role="list"
                aria-label={isArabic ? 'قائمة مسببات الحساسية' : 'Allergen legend'}
              >
                {ALLERGENS.map((item, idx) => (
                  <span
                    key={idx}
                    role="listitem"
                    style={{
                      flexShrink: 0,
                      padding: '5px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      lineHeight: '14px',
                      fontWeight: 500,
                      backgroundColor: isDark ? 'var(--dark-hover)' : 'var(--light-hover)',
                      color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
                      border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isArabic ? item.ar : item.en}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
