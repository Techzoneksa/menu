'use server';

import { requireAdmin } from '@/lib/auth/admin';

export async function fetchQRSettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('menu_settings').select('menu_domain').limit(1).single();
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data };
}
