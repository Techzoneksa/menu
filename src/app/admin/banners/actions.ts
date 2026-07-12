'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { bannerSchema } from '@/lib/validation';

export async function fetchBanners() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('menu_banners').select('*').order('sort_order');
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data: data || [] };
}

export async function saveBanner(formData: {
  id?: string;
  image_url: string;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  internal_link?: string | null;
  sort_order?: number;
  is_visible?: boolean;
}) {
  const { supabase } = await requireAdmin();
  const parsed = bannerSchema.safeParse(formData);
  if (!parsed.success) return { success: false as const, error: 'Validation failed' };
  if (formData.id) {
    const { error } = await supabase.from('menu_banners').update(parsed.data).eq('id', formData.id);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { error } = await supabase.from('menu_banners').insert(parsed.data);
    if (error) return { success: false as const, error: error.message };
  }
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}

export async function deleteBanner(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('menu_banners').delete().eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}

export async function toggleBannerVisibility(id: string, isVisible: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('menu_banners').update({ is_visible: isVisible }).eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}
