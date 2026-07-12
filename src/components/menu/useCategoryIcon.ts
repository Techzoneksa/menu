import type { MenuCategory } from '@/types/menu';

const CATEGORY_ICONS: Record<string, string> = {
  'hot-drinks': '☕',
  'cold-drinks': '🧊',
  'coffee': '☕',
  'tea': '🍵',
  'desserts': '🍰',
  'pastries': '🥐',
  'additions': '➕',
  'extras': '➕',
  'specialty': '✨',
  'seasonal': '🍂',
  'signature': '⭐',
  'food': '🍽️',
  'juices': '🧃',
  'smoothies': '🥤',
  'milkshakes': '🥛',
  'water': '💧',
  'soda': '🥤',
};

const FALLBACK_ICONS = ['☕', '🍵', '🍰', '🥐', '✨', '🧃', '🥤', '🍽️'];

export function getCategoryIcon(cat: MenuCategory): string {
  if (cat.icon_emoji) return cat.icon_emoji;
  if (cat.icon) return cat.icon;
  const slug = cat.slug?.toLowerCase() || '';
  if (CATEGORY_ICONS[slug]) return CATEGORY_ICONS[slug];
  for (const [key, emoji] of Object.entries(CATEGORY_ICONS)) {
    if (slug.includes(key)) return emoji;
  }
  const idx = (cat.sort_order || 0) % FALLBACK_ICONS.length;
  return FALLBACK_ICONS[idx];
}
