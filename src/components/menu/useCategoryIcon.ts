import { useMemo } from 'react';
import type { MenuCategory } from '@/types/menu';

// Maps Lucide icon names (stored in DB `icon` column) to emojis
const lucideToEmoji: Record<string, string> = {
  Coffee: '☕',
  CupSoda: '🧋',
  Cake: '🍰',
  CakeSlice: '🍰',
  UtensilsCrossed: '🍽️',
  Utensils: '🍽️',
  IceCream: '🍦',
  IceCreamCone: '🍦',
  Cookie: '🍪',
  Croissant: '🥐',
  Sandwich: '🥪',
  Egg: '🍳',
  Pizza: '🍕',
  Soup: '🍲',
  Salad: '🥗',
  Beef: '🥩',
  Drumstick: '🍗',
  Fish: '🐟',
  Shrimp: '🦐',
  Wine: '🍷',
  Beer: '🍺',
  GlassWater: '💧',
  Glass: '🥛',
  Milk: '🥛',
  Cherry: '🍒',
  Apple: '🍎',
  Banana: '🍌',
  Grape: '🍇',
  Citrus: '🍊',
  Orange: '🍊',
  Lemon: '🍋',
  Carrot: '🥕',
  Flame: '🔥',
  Snowflake: '❄️',
  Star: '⭐',
  Sparkles: '✨',
  Heart: '❤️',
  Crown: '👑',
  Award: '🏆',
  Zap: '⚡',
  Sun: '☀️',
  Moon: '🌙',
  Droplets: '💧',
  Wheat: '🌾',
  Bean: '🫘',
  Popcorn: '🍿',
  CakePop: '🧁',
  Cupcake: '🧁',
  Pastry: '🥐',
  Donut: '🍩',
  Pretzel: '🥨',
  Tacos: '🌮',
  Burger: '🍔',
  Fries: '🍟',
  HotDog: '🌭',
  Bento: '🍱',
  Noodles: '🍜',
  Dumpling: '🥟',
  Sushi: '🍣',
  CookieIcon: '🍪',
  Candy: '🍬',
  Lollipop: '🍭',
  Juice: '🧃',
  CoffeeMaker: '☕',
  Martini: '🍸',
  Cocktail: '🍹',
  Cup: '☕',
  UtensilsCrossedIcon: '🍽️',
  Store: '🏪',
  MapPin: '📍',
  Phone: '📞',
  Share: '📤',
  Globe: '🌐',
};

// Maps category slugs to emojis (primary lookup)
const slugToEmoji: Record<string, string> = {
  'hot-drinks': '☕',
  'cold-drinks': '🧊',
  'hot-and-cold-drinks': '☕',
  'ice-blended': '🧊',
  'juices': '🧃',
  'specialty-drinks': '⭐',
  'specialty': '⭐',
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
  'milkshake': '🧋',
  'smoothie': '🥤',
  'water': '💧',
  'soda': '🥤',
  'extras': '✨',
  'addons': '✨',
  'add-ons': '✨',
  'non-coffee': '🧋',
  'saudi-coffee': '🫖',
  'saudi-coffee-pot': '🫖',
};

const fallbackEmojis = ['🍽️', '⭐', '🔥', '❄️', '🧁', '🥐', '🧋', '🍰', '🥪', '☕'];

function resolveEmoji(cat: MenuCategory): string {
  const slug = (cat.slug || '').toLowerCase().trim();
  const nameEn = (cat.name_en || '').toLowerCase().trim();

  // 1. Try slug mapping
  if (slugToEmoji[slug]) return slugToEmoji[slug];

  // 2. Try name_en mapping
  if (slugToEmoji[nameEn]) return slugToEmoji[nameEn];

  // 3. Try icon_emoji field (explicit emoji set in DB)
  if (cat.icon_emoji && cat.icon_emoji.trim() && /\p{Emoji}/u.test(cat.icon_emoji.trim())) {
    return cat.icon_emoji.trim();
  }

  // 4. Try Lucide icon name mapping
  if (cat.icon) {
    const mapped = lucideToEmoji[cat.icon];
    if (mapped) return mapped;

    // If the icon field contains an emoji directly, use it
    if (/\p{Emoji}/u.test(cat.icon)) return cat.icon;
  }

  // 5. Fallback
  return '🍽️';
}

export function useCategoryIcon(categories: MenuCategory[]): Map<string, string> {
  return useMemo(() => {
    const iconMap = new Map<string, string>();
    let fallbackIdx = 0;

    for (const cat of categories) {
      const emoji = resolveEmoji(cat);
      if (emoji === '🍽️') {
        iconMap.set(cat.id, fallbackEmojis[fallbackIdx % fallbackEmojis.length]);
        fallbackIdx++;
      } else {
        iconMap.set(cat.id, emoji);
      }
    }

    return iconMap;
  }, [categories]);
}
