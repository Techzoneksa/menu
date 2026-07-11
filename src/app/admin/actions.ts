'use server';

import { requireAdmin } from '@/lib/auth/admin';

export async function fetchDashboardStats() {
  try {
    const { supabase } = await requireAdmin();

    const [catRes, prodRes, bannerRes] = await Promise.all([
      supabase.from('menu_categories').select('id', { count: 'exact', head: true }),
      supabase.from('menu_products').select('is_visible, is_available'),
      supabase.from('menu_banners').select('id', { count: 'exact', head: true }),
    ]);

    const allProducts = prodRes.data || [];

    return {
      success: true as const,
      data: {
        categories: catRes.count || 0,
        products: allProducts.length,
        visibleProducts: allProducts.filter((p: { is_visible: boolean }) => p.is_visible).length,
        hiddenProducts: allProducts.filter((p: { is_visible: boolean }) => !p.is_visible).length,
        unavailableProducts: allProducts.filter((p: { is_available: boolean }) => !p.is_available).length,
        banners: bannerRes.count || 0,
      },
    };
  } catch (e) {
    return {
      success: false as const,
      error: e instanceof Error ? e.message : 'Failed to fetch dashboard stats',
    };
  }
}
