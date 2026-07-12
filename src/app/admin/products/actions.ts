'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { productSchema } from '@/lib/validation';

export async function fetchProducts() {
  const { supabase } = await requireAdmin();
  const [prodRes, catRes, agRes] = await Promise.all([
    supabase.from('menu_products').select('*, category:menu_categories(*), variants:product_variants(*), addon_groups:product_addon_groups(*, addon_group:addon_groups(*))').order('sort_order'),
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('addon_groups').select('*').order('sort_order'),
  ]);
  if (prodRes.error) return { success: false as const, error: prodRes.error.message };
  const prods = (prodRes.data || []).map((p: Record<string, unknown>) => ({
    ...p,
    addon_groups: ((p.addon_groups as Array<Record<string, unknown>> || [])).map((pag: Record<string, unknown>) => pag.addon_group).filter(Boolean),
  }));
  return { success: true as const, data: { products: prods, categories: catRes.data || [], addonGroups: agRes.data || [] } };
}

export async function saveProduct(payload: {
  id?: string;
  name_ar: string;
  name_en: string;
  slug: string;
  category_id: string;
  description_ar?: string | null;
  description_en?: string | null;
  price?: number | null;
  calories?: number | null;
  image_url?: string | null;
  badge_ar?: string | null;
  badge_en?: string | null;
  is_available?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  variants?: Array<{ name_ar: string; name_en: string; price: number; calories?: number | null; sort_order: number; is_visible: boolean }>;
  addonGroupIds?: string[];
}) {
  const { supabase } = await requireAdmin();
  const parsed = productSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false as const, error: 'Validation failed', fieldErrors };
  }

  let productId = payload.id;
  if (productId) {
    const { error } = await supabase.from('menu_products').update(parsed.data).eq('id', productId);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { data, error } = await supabase.from('menu_products').insert(parsed.data).select('id').single();
    if (error) return { success: false as const, error: error.message };
    productId = data?.id;
  }

  if (productId) {
    await supabase.from('product_variants').delete().eq('product_id', productId);
    if (payload.variants && payload.variants.length > 0) {
      const variantPayload = payload.variants.map(v => ({ product_id: productId, ...v }));
      await supabase.from('product_variants').insert(variantPayload);
    }

    await supabase.from('product_addon_groups').delete().eq('product_id', productId);
    if (payload.addonGroupIds && payload.addonGroupIds.length > 0) {
      const agPayload = payload.addonGroupIds.map(agId => ({ product_id: productId, addon_group_id: agId }));
      await supabase.from('product_addon_groups').insert(agPayload);
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('menu_products').delete().eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}

export async function toggleProductField(id: string, field: 'is_visible' | 'is_available', value: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('menu_products').update({ [field]: value }).eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: true as const, data: undefined };
}

export async function duplicateProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc('duplicate_product', { source_product_id: id });
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true as const, data };
}
