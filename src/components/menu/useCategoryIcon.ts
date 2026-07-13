import { useMemo } from 'react';
import type { MenuCategory } from '@/types/menu';

export interface CategoryVisual {
  imageUrl: string | null;
}

function resolveVisual(cat: MenuCategory): CategoryVisual {
  const imageUrl = (cat.image_url && cat.image_url.trim()) ? cat.image_url.trim() : null;
  return { imageUrl };
}

export function useCategoryVisual(categories: MenuCategory[]): Map<string, CategoryVisual> {
  return useMemo(() => {
    const map = new Map<string, CategoryVisual>();
    for (const cat of categories) {
      map.set(cat.id, resolveVisual(cat));
    }
    return map;
  }, [categories]);
}

export function useCategoryIcon(): Map<string, null> {
  return useMemo(() => new Map(), []);
}
