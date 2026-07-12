'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';

export async function fetchQRSettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('menu_settings').select('menu_domain').limit(1).single();
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data };
}

export async function saveQRDisplaySettings(data: {
  qr_color?: string;
  qr_bg?: string;
  qr_text_ar?: string;
  qr_text_en?: string;
}) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('menu_settings')
    .update({
      qr_color: data.qr_color,
      qr_bg: data.qr_bg,
      qr_text_ar: data.qr_text_ar,
      qr_text_en: data.qr_text_en,
    })
    .neq('id', '');
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/qr');
  return { success: true as const, data: undefined };
}

export async function fetchQRDisplaySettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('menu_settings').select('menu_domain, qr_color, qr_bg, qr_text_ar, qr_text_en').limit(1).single();
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data };
}
