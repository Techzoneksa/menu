'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { addonGroupSchema, addonItemSchema } from '@/lib/validation';

export async function fetchAddons() {
  const { supabase } = await requireAdmin();
  const [gRes, pRes] = await Promise.all([
    supabase.from('addon_groups').select('*, items:addon_items(*)').order('sort_order'),
    supabase.from('menu_products').select('id, name_ar, name_en').order('name_ar'),
  ]);
  const groupsData = (gRes.data || []).map((g: any) => ({
    ...g,
    items: ((g.items || []) as any[]).sort((a: any, b: any) => a.sort_order - b.sort_order),
  }));
  return { success: true as const, data: { groups: groupsData as unknown[], products: (pRes.data || []) as unknown[] } };
}

export async function saveAddonGroup(formData: { id?: string; name_ar: string; name_en: string; sort_order?: number; is_visible?: boolean }) {
  const { supabase } = await requireAdmin();
  const parsed = addonGroupSchema.safeParse(formData);
  if (!parsed.success) return { success: false as const, error: 'Validation failed' };
  if (formData.id) {
    const { error } = await supabase.from('addon_groups').update(parsed.data).eq('id', formData.id);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { error } = await supabase.from('addon_groups').insert(parsed.data);
    if (error) return { success: false as const, error: error.message };
  }
  revalidatePath('/admin/addons');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function deleteAddonGroup(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('addon_groups').delete().eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/addons');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function saveAddonItem(formData: { id?: string; addon_group_id: string; name_ar: string; name_en: string; price: number; sort_order?: number; is_visible?: boolean }) {
  const { supabase } = await requireAdmin();
  const parsed = addonItemSchema.safeParse(formData);
  if (!parsed.success) return { success: false as const, error: 'Validation failed' };
  if (formData.id) {
    const { error } = await supabase.from('addon_items').update(parsed.data).eq('id', formData.id);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { error } = await supabase.from('addon_items').insert(parsed.data);
    if (error) return { success: false as const, error: error.message };
  }
  revalidatePath('/admin/addons');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function deleteAddonItem(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('addon_items').delete().eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/addons');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function saveAddonLinks(groupId: string, productIds: string[]) {
  const { supabase } = await requireAdmin();
  await supabase.from('product_addon_groups').delete().eq('addon_group_id', groupId);
  if (productIds.length > 0) {
    const payload = productIds.map(pid => ({ product_id: pid, addon_group_id: groupId }));
    const { error } = await supabase.from('product_addon_groups').insert(payload);
    if (error) return { success: false as const, error: error.message };
  }
  revalidatePath('/admin/addons');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}
