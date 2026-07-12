'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/admin';
import { z } from 'zod';

const imageSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  image_url: z.string().url(),
  alt_ar: z.string().nullable().optional(),
  alt_en: z.string().nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
  is_visible: z.boolean().optional(),
});

export async function fetchProductImages(productId: string) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  if (error) return { success: false as const, error: error.message };
  return { success: true as const, data };
}

export async function saveProductImage(formData: {
  id?: string;
  product_id: string;
  image_url: string;
  alt_ar?: string;
  alt_en?: string;
  sort_order?: number;
  is_visible?: boolean;
}) {
  const { supabase } = await requireAdmin();
  const parsed = imageSchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false as const, error: 'Validation failed', fieldErrors };
  }

  const payload = {
    product_id: parsed.data.product_id,
    image_url: parsed.data.image_url,
    alt_ar: parsed.data.alt_ar ?? null,
    alt_en: parsed.data.alt_en ?? null,
    sort_order: parsed.data.sort_order ?? 0,
    is_visible: parsed.data.is_visible ?? true,
  };

  if (parsed.data.id) {
    const { data, error } = await supabase
      .from('product_images')
      .update(payload)
      .eq('id', parsed.data.id)
      .select()
      .single();
    if (error) return { success: false as const, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return { success: true as const, data };
  } else {
    const { data, error } = await supabase
      .from('product_images')
      .insert(payload)
      .select()
      .single();
    if (error) return { success: false as const, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return { success: true as const, data };
  }
}

export async function deleteProductImage(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('product_images').delete().eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function toggleProductImageVisibility(id: string, is_visible: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('product_images')
    .update({ is_visible })
    .eq('id', id);
  if (error) return { success: false as const, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}

export async function reorderProductImages(imageIds: string[]) {
  const { supabase } = await requireAdmin();

  const updates = imageIds.map((id, index) =>
    supabase.from('product_images').update({ sort_order: index }).eq('id', id)
  );

  const results = await Promise.all(updates);
  const errorResult = results.find((r) => r.error);
  if (errorResult?.error) return { success: false as const, error: errorResult.error.message };

  revalidatePath('/admin/products');
  revalidatePath('/menu');
  return { success: true as const, data: undefined };
}
