import type { Language } from '@/types/menu';

export function formatPrice(price: number | null, lang: Language): string {
  if (price === null || price === undefined) return '';
  return lang === 'ar' ? `${price} ر.س` : `SAR ${price}`;
}

export function formatCalories(calories: number | null, lang: Language): string {
  if (calories === null || calories === undefined) return '';
  return lang === 'ar' ? `${calories} سعرة حرارية` : `${calories} Calories`;
}

export function getLocalizedName(item: { name_ar: string; name_en: string }, lang: Language): string {
  return lang === 'ar' ? item.name_ar : item.name_en;
}

export function getLocalizedDescription(item: { description_ar?: string | null; description_en?: string | null }, lang: Language): string | null {
  return lang === 'ar' ? (item.description_ar ?? null) : (item.description_en ?? null);
}

export function getLocalizedBadge(item: { badge_ar?: string | null; badge_en?: string | null }, lang: Language): string | null {
  return lang === 'ar' ? (item.badge_ar ?? null) : (item.badge_en ?? null);
}

export function formatStartingPrice(price: number | null, lang: Language): string {
  if (price === null || price === undefined) return '';
  return lang === 'ar' ? `يبدأ من ${price} ر.س` : `Starting from SAR ${price}`;
}