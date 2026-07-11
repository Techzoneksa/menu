-- ============================================================
-- 003_admin_rbac.sql
-- Admin role-based access control for Maher Kaif menu
-- ============================================================

-- ── admin_users table ────────────────────────────────────────
CREATE TABLE public.admin_users (
  user_id   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- No one can read admin_users via RLS (only via security definer function)
CREATE POLICY "No public read on admin_users"
  ON public.admin_users FOR SELECT
  USING (false);

-- ── is_admin() function ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Grant execute to authenticated and anon
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- ============================================================
-- DROP old overly-permissive policies
-- ============================================================

-- menu_categories
DROP POLICY IF EXISTS "Authenticated full access on categories" ON public.menu_categories;
CREATE POLICY "Admin full access on categories"
  ON public.menu_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- menu_products
DROP POLICY IF EXISTS "Authenticated full access on products" ON public.menu_products;
CREATE POLICY "Admin full access on products"
  ON public.menu_products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- product_images
DROP POLICY IF EXISTS "Authenticated full access on product images" ON public.product_images;
CREATE POLICY "Admin full access on product images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- product_variants
DROP POLICY IF EXISTS "Authenticated full access on variants" ON public.product_variants;
CREATE POLICY "Admin full access on variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- addon_groups
DROP POLICY IF EXISTS "Authenticated full access on addon groups" ON public.addon_groups;
CREATE POLICY "Admin full access on addon groups"
  ON public.addon_groups FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- addon_items
DROP POLICY IF EXISTS "Authenticated full access on addon items" ON public.addon_items;
CREATE POLICY "Admin full access on addon items"
  ON public.addon_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- product_addon_groups
DROP POLICY IF EXISTS "Authenticated full access on product_addon_groups" ON public.product_addon_groups;
CREATE POLICY "Admin full access on product_addon_groups"
  ON public.product_addon_groups FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- menu_banners
DROP POLICY IF EXISTS "Authenticated full access on banners" ON public.menu_banners;
CREATE POLICY "Admin full access on banners"
  ON public.menu_banners FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- menu_settings
DROP POLICY IF EXISTS "Authenticated full access on settings" ON public.menu_settings;
CREATE POLICY "Admin full access on settings"
  ON public.menu_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- STORAGE POLICIES: replace auth.role() with public.is_admin()
-- ============================================================

-- menu-logos
DROP POLICY IF EXISTS "Authenticated upload on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on menu-logos" ON storage.objects;

CREATE POLICY "Admin upload on menu-logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-logos' AND public.is_admin());

CREATE POLICY "Admin update on menu-logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-logos' AND public.is_admin());

CREATE POLICY "Admin delete on menu-logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-logos' AND public.is_admin());

-- menu-products
DROP POLICY IF EXISTS "Authenticated upload on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on menu-products" ON storage.objects;

CREATE POLICY "Admin upload on menu-products"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-products' AND public.is_admin());

CREATE POLICY "Admin update on menu-products"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-products' AND public.is_admin());

CREATE POLICY "Admin delete on menu-products"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-products' AND public.is_admin());

-- menu-banners
DROP POLICY IF EXISTS "Authenticated upload on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on menu-banners" ON storage.objects;

CREATE POLICY "Admin upload on menu-banners"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-banners' AND public.is_admin());

CREATE POLICY "Admin update on menu-banners"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-banners' AND public.is_admin());

CREATE POLICY "Admin delete on menu-banners"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-banners' AND public.is_admin());

-- ============================================================
-- RPC for safe category reorder
-- ============================================================
CREATE OR REPLACE FUNCTION public.swap_category_sort_order(
  cat_id_a uuid,
  cat_id_b uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_a int;
  order_b int;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT sort_order INTO order_a FROM public.menu_categories WHERE id = cat_id_a;
  SELECT sort_order INTO order_b FROM public.menu_categories WHERE id = cat_id_b;

  UPDATE public.menu_categories SET sort_order = order_b WHERE id = cat_id_a;
  UPDATE public.menu_categories SET sort_order = order_a WHERE id = cat_id_b;
END;
$$;

GRANT EXECUTE ON FUNCTION public.swap_category_sort_order(uuid, uuid) TO authenticated;

-- ============================================================
-- RPC for safe product duplication
-- ============================================================
CREATE OR REPLACE FUNCTION public.duplicate_product(
  source_product_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_product_id uuid;
  new_slug text;
  source_rec record;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO source_rec FROM public.menu_products WHERE id = source_product_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  new_slug := source_rec.slug || '-copy-' || extract(epoch from now())::int;

  INSERT INTO public.menu_products (
    category_id, slug, name_ar, name_en,
    description_ar, description_en,
    price, calories, image_url,
    badge_ar, badge_en,
    is_available, is_visible, sort_order
  ) VALUES (
    source_rec.category_id, new_slug,
    source_rec.name_ar || ' (نسخة)', source_rec.name_en || ' (copy)',
    source_rec.description_ar, source_rec.description_en,
    source_rec.price, source_rec.calories, NULL,
    source_rec.badge_ar, source_rec.badge_en,
    source_rec.is_available, false, source_rec.sort_order
  ) RETURNING id INTO new_product_id;

  -- Copy variants (without images)
  INSERT INTO public.product_variants (
    product_id, name_ar, name_en, price, calories, sort_order, is_visible
  )
  SELECT
    new_product_id, name_ar, name_en, price, calories, sort_order, is_visible
  FROM public.product_variants
  WHERE product_id = source_product_id;

  -- Copy addon group links
  INSERT INTO public.product_addon_groups (product_id, addon_group_id)
  SELECT new_product_id, addon_group_id
  FROM public.product_addon_groups
  WHERE product_id = source_product_id;

  RETURN new_product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.duplicate_product(uuid) TO authenticated;
