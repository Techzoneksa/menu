"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { MenuCategory, MenuProduct, MenuBanner, MenuSettings } from '@/types/menu';
import { MenuProviders } from '@/components/menu/MenuProviders';
import { MobileMenuHeader } from '@/components/menu/MobileMenuHeader';
import { BannerSlider } from '@/components/menu/BannerSlider';
import { CafeIdentity } from '@/components/menu/CafeIdentity';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { ProductSection } from '@/components/menu/ProductSection';
import { ProductDetailsSheet } from '@/components/menu/ProductDetailsSheet';
import { MenuSearch } from '@/components/menu/MenuSearch';
import { useLanguage } from '@/components/menu/LanguageContext';
import { useThemeContext } from '@/components/menu/ThemeContext';
import { BackToTop } from '@/components/menu/BackToTop';
import { normalizeSearchText } from '@/lib/search';

function MenuInner({ initialSettings }: { initialSettings: MenuSettings | null }) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [banners, setBanners] = useState<MenuBanner[]>([]);
  const [settings, setSettings] = useState<MenuSettings | null>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { lang } = useLanguage();
  const { resolvedTheme } = useThemeContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        const [categoriesRes, productsRes, bannersRes, settingsRes] = await Promise.all([
          supabase.from('menu_categories').select('*').eq('is_visible', true).order('sort_order'),
          supabase.from('menu_products').select('*, category:menu_categories(*), variants:product_variants(*), addon_groups:product_addon_groups(*, addon_group:addon_groups(*, items:addon_items(*))), images:product_images(*)').eq('is_visible', true).order('sort_order'),
          supabase.from('menu_banners').select('*').order('sort_order'),
          supabase.from('menu_settings').select('*').limit(1).single(),
        ]);

        if (categoriesRes.error) throw new Error('Failed to load categories');
        if (productsRes.error) throw new Error('Failed to load products');
        if (bannersRes.error) throw new Error('Failed to load banners');

        setCategories(categoriesRes.data || []);

        const rawProducts = productsRes.data || [];
        const transformedProducts = rawProducts.map((p: any) => ({
          ...p,
          addon_groups: (p.addon_groups || [])
            .map((pag: any) => pag.addon_group)
            .filter(Boolean),
        }));
        setProducts(transformedProducts);

        setBanners(bannersRes.data || []);

        if (settingsRes.error) {
          setSettings(null);
        } else {
          setSettings(settingsRes.data);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const productSlug = params.get('product');
      if (productSlug) {
        const product = products.find(p => p.slug === productSlug && p.is_visible);
        if (product) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe URL param reading
          setSelectedProduct(product);
        }
      }
    }
  }, [loading, products]);

  useEffect(() => {
    if (settings && settings.english_enabled === false) {
      const stored = localStorage.getItem('maher-kaif-lang');
      if (stored === 'en') {
        localStorage.setItem('maher-kaif-lang', 'ar');
        document.cookie = 'maher-kaif-lang=ar;path=/;max-age=31536000';
      }
    }
  }, [settings]);

  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    const q = normalizeSearchText(debouncedSearchQuery);
    return products.filter(p => {
      const cat = categories.find(c => c.id === p.category_id);
      return (
        normalizeSearchText(p.name_ar).includes(q) ||
        normalizeSearchText(p.name_en).includes(q) ||
        normalizeSearchText(p.description_ar || '').includes(q) ||
        normalizeSearchText(p.description_en || '').includes(q) ||
        normalizeSearchText(cat?.name_ar || '').includes(q) ||
        normalizeSearchText(cat?.name_en || '').includes(q)
      );
    });
  }, [debouncedSearchQuery, products, categories]);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, MenuProduct[]>();
    for (const cat of categories) {
      map.set(cat.id, products.filter(p => p.category_id === cat.id));
    }
    return map;
  }, [categories, products]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-background)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm opacity-50">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: resolvedTheme === 'dark' ? 'var(--dark-background)' : 'var(--light-background)' }}>
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">{lang === 'ar' ? 'حدث خطأ' : 'An error occurred'}</p>
          <p className="text-sm opacity-50">{error}</p>
        </div>
      </div>
    );
  }

  const cafeName = settings
    ? (lang === 'ar' ? settings.cafe_name_ar : settings.cafe_name_en) || 'ماهر كيف'
    : 'ماهر كيف';

  return (
    <div className="min-h-screen max-w-[480px] mx-auto relative" style={{ backgroundColor: resolvedTheme === 'dark' ? 'var(--dark-background)' : 'var(--light-background)' }}>
      <MobileMenuHeader
        cafeName={cafeName}
        logoUrl={settings?.logo_url || null}
        whiteLogoUrl={settings?.white_logo_url || null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        settings={settings}
      />

      {searchQuery ? (
        <MenuSearch
          results={searchResults}
          onProductClick={setSelectedProduct}
          query={searchQuery}
        />
      ) : (
        <>
          <BannerSlider banners={banners} />

          {settings && <CafeIdentity settings={settings} />}

          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />

          <div className="flex flex-col gap-6 pb-8">
            {categories.map(cat => (
              <ProductSection
                key={cat.id}
                ref={(el) => {
                  if (el) categoryRefs.current.set(cat.id, el);
                }}
                category={cat}
                products={productsByCategory.get(cat.id) || []}
                onProductClick={setSelectedProduct}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-sm opacity-50">{lang === 'ar' ? 'لا توجد منتجات' : 'No products available'}</p>
            </div>
          )}
        </>
      )}

      <ProductDetailsSheet
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <BackToTop />

    </div>
  );
}

function MenuLoader() {
  const [settings, setSettings] = useState<MenuSettings | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('menu_settings').select('*').limit(1).single();
        setSettings(data);
      } catch {
        setSettings(null);
      }
      setLoaded(true);
    };
    fetchSettings();
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-background)' }}>
        <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <MenuProviders settings={settings}>
      <MenuInner initialSettings={settings} />
    </MenuProviders>
  );
}

export default function HomePage() {
  return <MenuLoader />;
}
