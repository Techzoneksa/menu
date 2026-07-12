const SUPABASE_STORAGE_URL = 'https://wuzuccfibpockriiwlva.supabase.co/storage/v1/object/public';

export function getImageUrl(imageUrl: string | null, theme: string): string {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('uploads/')) {
    return `${SUPABASE_STORAGE_URL}/menu/${imageUrl}`;
  }

  if (theme === 'dark') {
    if (imageUrl.startsWith('uploads/white/')) {
      return `${SUPABASE_STORAGE_URL}/menu/${imageUrl}`;
    }
  }

  return `${SUPABASE_STORAGE_URL}/menu/${imageUrl}`;
}
