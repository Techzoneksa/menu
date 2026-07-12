import { useMemo } from 'react';
import type { MenuCategory } from '@/types/menu';

const slugIconMap: Record<string, string> = {
  'hot-drinks': '☕',
  'cold-drinks': '🧊',
  'ice-blended': '🧊',
  'juices': '🥤',
  'specialty-drinks': '⭐',
  'desserts': '🍰',
  'pastries': '🥐',
  'bakery': '🥐',
  'sandwiches': '🥪',
  'breakfast': '🍳',
  'lunch': '🍽️',
  'dinner': '🍽️',
  'snacks': '🍿',
  'coffee': '☕',
  'tea': '🍵',
  'milkshake': '🥤',
  'smoothie': '🥤',
  'water': '💧',
  'soda': '🥤',
  'extras': '✨',
  'addons': '✨',
  'add-ons': '✨',
};

const fallbackIcons = ['🍽️', '⭐', '🔥', '❄️', '🧁', '🥐', '🥤', '🍰'];

export function useCategoryIcon(categories: MenuCategory[]): Map<string, string> {
  return useMemo(() => {
    const iconMap = new Map<string, string>();
    let fallbackIdx = 0;

    for (const cat of categories) {
      const slug = (cat.slug || '').toLowerCase().trim();
      const nameEn = (cat.name_en || '').toLowerCase().trim();

      if (slugIconMap[slug]) {
        iconMap.set(cat.id, slugIconMap[slug]);
      } else if (slugIconMap[nameEn]) {
        iconMap.set(cat.id, slugIconMap[nameEn]);
      } else if (cat.icon_emoji && cat.icon_emoji.trim()) {
        iconMap.set(cat.id, cat.icon_emoji.trim());
      } else {
        iconMap.set(cat.id, fallbackIcons[fallbackIdx % fallbackIcons.length]);
        fallbackIdx++;
      }
    }

    return iconMap;
  }, [categories]);
}
