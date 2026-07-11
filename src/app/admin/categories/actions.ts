'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { categorySchema } from '@/lib/validation';

export async function fetchCategories() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order');
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data: data || [] };
}

export async function saveCategory(formData: {
  id?: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon?: string | null;
  image_url?: string | null;
  sort_order?: number;
  is_visible?: boolean;
}) {
  const { supabase } = await requireAdmin();
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false as const, error: 'Validation failed', fieldErrors };
  }

  if (formData.id) {
    const { error } = await supabase.from('menu_categories').update(parsed.data).eq('id', formData.id);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { error } = await supabase.from('menu_categories').insert(parsed.data);
    if (error) return { success: false as const, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();
  const { count } = await supabase
    .from('menu_products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);
  if (count && count > 0) {
    return { success: false as const, error: 'لا يمكن حذف الفئة لأنها تحتوي على منتجات' };
  }
  const { error } = await supabase.from('menu_categories').delete().eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function toggleCategoryVisibility(id: string, isVisible: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('menu_categories').update({ is_visible: isVisible }).eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function swapCategorySortOrder(catIdA: string, catIdB: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc('swap_category_sort_order', { cat_id_a: catIdA, cat_id_b: catIdB });
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}
