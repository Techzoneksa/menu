'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { settingsSchema } from '@/lib/validation';

export async function fetchSettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('menu_settings').select('*').limit(1).single();
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data };
}

export async function saveSettings(formData: Record<string, unknown>) {
  const { supabase } = await requireAdmin();
  const settingsId = formData.id as string;
  const parsed = settingsSchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false as const, error: 'Validation failed', fieldErrors };
  }
  const payload = parsed.data;
  const { error } = await supabase.from('menu_settings').update(payload).eq('id', settingsId);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}
