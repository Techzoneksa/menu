BEGIN;

-- ============================================================
-- Maher Kaif Menu – Safe Setup (Idempotent)
-- Run: 1..N times safely inside a transaction
-- ============================================================

-- 1. Functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 3. Tables (CREATE IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL, name_en text NOT NULL,
  icon text, image_url text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL, name_en text NOT NULL,
  description_ar text, description_en text,
  price numeric CHECK (price IS NULL OR price >= 0),
  calories int CHECK (calories IS NULL OR calories >= 0),
  image_url text,
  badge_ar text, badge_en text,
  is_available boolean DEFAULT true,
  is_visible boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  alt_ar text, alt_en text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  name_ar text NOT NULL, name_en text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  calories int CHECK (calories IS NULL OR calories >= 0),
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.addon_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL, name_en text NOT NULL,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.addon_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_group_id uuid NOT NULL,
  name_ar text NOT NULL, name_en text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_addon_groups (
  product_id uuid NOT NULL,
  addon_group_id uuid NOT NULL,
  PRIMARY KEY (product_id, addon_group_id)
);

CREATE TABLE IF NOT EXISTS public.menu_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title_ar text, title_en text,
  description_ar text, description_en text,
  internal_link text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_name_ar text DEFAULT 'ماهر كيف',
  cafe_name_en text DEFAULT 'Maher Kaif',
  description_ar text, description_en text,
  logo_url text, white_logo_url text,
  primary_color text DEFAULT '#F26522',
  phone text, whatsapp text, email text,
  instagram text, location_url text,
  branch_status_ar text, branch_status_en text,
  show_branch_status boolean DEFAULT false,
  english_enabled boolean DEFAULT true,
  default_theme text DEFAULT 'system' CHECK (default_theme IN ('light','dark','system')),
  menu_domain text,
  qr_color text DEFAULT '#000000',
  qr_bg text DEFAULT '#FFFFFF',
  qr_text_ar text DEFAULT 'امسح الرمز لمشاهدة المنيو',
  qr_text_en text DEFAULT 'Scan to View the Menu',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT 'المدير',
  role text DEFAULT 'admin' CHECK (role IN ('super_admin','admin')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create admin check function only after admin_users exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND role = 'super_admin');
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_profile()
RETURNS TABLE(display_name text, role text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT au.display_name, au.role FROM public.admin_users au WHERE au.user_id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_admin_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_profile() TO authenticated;

-- 4. Foreign keys (add if missing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'menu_products_category_id_fkey') THEN
    ALTER TABLE public.menu_products ADD CONSTRAINT menu_products_category_id_fkey
      FOREIGN KEY (category_id) REFERENCES public.menu_categories(id) ON DELETE RESTRICT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_images_product_id_fkey') THEN
    ALTER TABLE public.product_images ADD CONSTRAINT product_images_product_id_fkey
      FOREIGN KEY (product_id) REFERENCES public.menu_products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_variants_product_id_fkey') THEN
    ALTER TABLE public.product_variants ADD CONSTRAINT product_variants_product_id_fkey
      FOREIGN KEY (product_id) REFERENCES public.menu_products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'addon_items_addon_group_id_fkey') THEN
    ALTER TABLE public.addon_items ADD CONSTRAINT addon_items_addon_group_id_fkey
      FOREIGN KEY (addon_group_id) REFERENCES public.addon_groups(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_addon_groups_product_id_fkey') THEN
    ALTER TABLE public.product_addon_groups ADD CONSTRAINT product_addon_groups_product_id_fkey
      FOREIGN KEY (product_id) REFERENCES public.menu_products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_addon_groups_addon_group_id_fkey') THEN
    ALTER TABLE public.product_addon_groups ADD CONSTRAINT product_addon_groups_addon_group_id_fkey
      FOREIGN KEY (addon_group_id) REFERENCES public.addon_groups(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_menu_products_category_id ON public.menu_products(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_products_sort_order ON public.menu_products(sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_categories_sort_order ON public.menu_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sort_order ON public.product_variants(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON public.product_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_addon_items_addon_group_id ON public.addon_items(addon_group_id);
CREATE INDEX IF NOT EXISTS idx_addon_items_sort_order ON public.addon_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_addon_groups_sort_order ON public.addon_groups(sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_banners_sort_order ON public.menu_banners(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_addon_groups_addon_group_id ON public.product_addon_groups(addon_group_id);

-- 6. Triggers (drop safely, then re-create)
DROP TRIGGER IF EXISTS set_menu_categories_updated_at ON public.menu_categories;
DROP TRIGGER IF EXISTS set_menu_products_updated_at ON public.menu_products;
DROP TRIGGER IF EXISTS set_product_variants_updated_at ON public.product_variants;
DROP TRIGGER IF EXISTS set_addon_groups_updated_at ON public.addon_groups;
DROP TRIGGER IF EXISTS set_addon_items_updated_at ON public.addon_items;
DROP TRIGGER IF EXISTS set_menu_banners_updated_at ON public.menu_banners;
DROP TRIGGER IF EXISTS set_menu_settings_updated_at ON public.menu_settings;

CREATE TRIGGER set_menu_categories_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_menu_products_updated_at BEFORE UPDATE ON public.menu_products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_addon_groups_updated_at BEFORE UPDATE ON public.addon_groups FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_addon_items_updated_at BEFORE UPDATE ON public.addon_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_menu_banners_updated_at BEFORE UPDATE ON public.menu_banners FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_menu_settings_updated_at BEFORE UPDATE ON public.menu_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. RLS
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_addon_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 8. Drop old policies
DROP POLICY IF EXISTS "Public can view visible categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Public can view visible products" ON public.menu_products;
DROP POLICY IF EXISTS "Public can view visible product images" ON public.product_images;
DROP POLICY IF EXISTS "Public can view visible variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public can view visible addon groups" ON public.addon_groups;
DROP POLICY IF EXISTS "Public can view visible addon items" ON public.addon_items;
DROP POLICY IF EXISTS "Public can view product_addon_groups" ON public.product_addon_groups;
DROP POLICY IF EXISTS "Public can view visible banners" ON public.menu_banners;
DROP POLICY IF EXISTS "Public can view settings" ON public.menu_settings;
DROP POLICY IF EXISTS "Admin full access on categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Admin full access on products" ON public.menu_products;
DROP POLICY IF EXISTS "Admin full access on product images" ON public.product_images;
DROP POLICY IF EXISTS "Admin full access on variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admin full access on addon groups" ON public.addon_groups;
DROP POLICY IF EXISTS "Admin full access on addon items" ON public.addon_items;
DROP POLICY IF EXISTS "Admin full access on product_addon_groups" ON public.product_addon_groups;
DROP POLICY IF EXISTS "Admin full access on banners" ON public.menu_banners;
DROP POLICY IF EXISTS "Admin full access on settings" ON public.menu_settings;
DROP POLICY IF EXISTS "No public read on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated full access on categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Authenticated full access on products" ON public.menu_products;
DROP POLICY IF EXISTS "Authenticated full access on product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated full access on variants" ON public.product_variants;
DROP POLICY IF EXISTS "Authenticated full access on addon groups" ON public.addon_groups;
DROP POLICY IF EXISTS "Authenticated full access on addon items" ON public.addon_items;
DROP POLICY IF EXISTS "Authenticated full access on product_addon_groups" ON public.product_addon_groups;
DROP POLICY IF EXISTS "Authenticated full access on banners" ON public.menu_banners;
DROP POLICY IF EXISTS "Authenticated full access on settings" ON public.menu_settings;

-- 9. Public read policies
CREATE POLICY "Public can view visible categories" ON public.menu_categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible products" ON public.menu_products FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible product images" ON public.product_images FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible variants" ON public.product_variants FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible addon groups" ON public.addon_groups FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible addon items" ON public.addon_items FOR SELECT USING (is_visible = true);

CREATE POLICY "Public can view product_addon_groups" ON public.product_addon_groups FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.menu_products WHERE id = product_addon_groups.product_id AND is_visible = true)
    AND EXISTS (SELECT 1 FROM public.addon_groups WHERE id = product_addon_groups.addon_group_id AND is_visible = true)
  );

CREATE POLICY "Public can view visible banners" ON public.menu_banners FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view settings" ON public.menu_settings FOR SELECT USING (true);

-- 10. Admin policies
CREATE POLICY "Admin full access on categories" ON public.menu_categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on products" ON public.menu_products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on product images" ON public.product_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on variants" ON public.product_variants FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on addon groups" ON public.addon_groups FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on addon items" ON public.addon_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on product_addon_groups" ON public.product_addon_groups FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on banners" ON public.menu_banners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access on settings" ON public.menu_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "No public read on admin_users" ON public.admin_users FOR SELECT USING (false);

-- 11. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('menu-logos','menu-logos',true),
  ('menu-products','menu-products',true),
  ('menu-banners','menu-banners',true)
ON CONFLICT (id) DO NOTHING;

-- 12. Storage policies (drop all known names first)
DROP POLICY IF EXISTS "Public read access on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Public read access on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin update on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete on menu-logos" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Admin update on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete on menu-products" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin update on menu-banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete on menu-banners" ON storage.objects;

CREATE POLICY "Public read access on menu-logos" ON storage.objects FOR SELECT USING (bucket_id = 'menu-logos');
CREATE POLICY "Public read access on menu-products" ON storage.objects FOR SELECT USING (bucket_id = 'menu-products');
CREATE POLICY "Public read access on menu-banners" ON storage.objects FOR SELECT USING (bucket_id = 'menu-banners');

CREATE POLICY "Admin upload on menu-logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-logos' AND public.is_admin());
CREATE POLICY "Admin update on menu-logos" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-logos' AND public.is_admin());
CREATE POLICY "Admin delete on menu-logos" ON storage.objects FOR DELETE USING (bucket_id = 'menu-logos' AND public.is_admin());
CREATE POLICY "Admin upload on menu-products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-products' AND public.is_admin());
CREATE POLICY "Admin update on menu-products" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-products' AND public.is_admin());
CREATE POLICY "Admin delete on menu-products" ON storage.objects FOR DELETE USING (bucket_id = 'menu-products' AND public.is_admin());
CREATE POLICY "Admin upload on menu-banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-banners' AND public.is_admin());
CREATE POLICY "Admin update on menu-banners" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-banners' AND public.is_admin());
CREATE POLICY "Admin delete on menu-banners" ON storage.objects FOR DELETE USING (bucket_id = 'menu-banners' AND public.is_admin());

-- 13. RPC: swap_category_sort_order
CREATE OR REPLACE FUNCTION public.swap_category_sort_order(cat_id_a uuid, cat_id_b uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE order_a int; order_b int;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT sort_order INTO order_a FROM public.menu_categories WHERE id = cat_id_a;
  SELECT sort_order INTO order_b FROM public.menu_categories WHERE id = cat_id_b;
  UPDATE public.menu_categories SET sort_order = order_b WHERE id = cat_id_a;
  UPDATE public.menu_categories SET sort_order = order_a WHERE id = cat_id_b;
END; $$;

REVOKE ALL ON FUNCTION public.swap_category_sort_order(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.swap_category_sort_order(uuid, uuid) TO authenticated;

-- 14. RPC: duplicate_product
CREATE OR REPLACE FUNCTION public.duplicate_product(source_product_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_product_id uuid; new_slug text; source_rec record;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT * INTO source_rec FROM public.menu_products WHERE id = source_product_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;
  new_slug := source_rec.slug || '-copy-' || replace(gen_random_uuid()::text, '-', '');
  INSERT INTO public.menu_products (
    category_id, slug, name_ar, name_en, description_ar, description_en,
    price, calories, image_url, badge_ar, badge_en, is_available, is_visible, sort_order
  ) VALUES (
    source_rec.category_id, new_slug,
    source_rec.name_ar || ' (نسخة)', source_rec.name_en || ' (copy)',
    source_rec.description_ar, source_rec.description_en,
    source_rec.price, source_rec.calories, NULL,
    source_rec.badge_ar, source_rec.badge_en,
    source_rec.is_available, false, source_rec.sort_order
  ) RETURNING id INTO new_product_id;
  INSERT INTO public.product_variants(product_id, name_ar, name_en, price, calories, sort_order, is_visible)
  SELECT new_product_id, name_ar, name_en, price, calories, sort_order, is_visible
  FROM public.product_variants WHERE product_id = source_product_id;
  INSERT INTO public.product_addon_groups(product_id, addon_group_id)
  SELECT new_product_id, addon_group_id FROM public.product_addon_groups WHERE product_id = source_product_id;
  RETURN new_product_id;
END; $$;

REVOKE ALL ON FUNCTION public.duplicate_product(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.duplicate_product(uuid) TO authenticated;

-- 15. Seed data (idempotent)
DO $$ DECLARE
  v_cat_hot_cold uuid; v_cat_non_coffee uuid; v_cat_saudi_pot uuid; v_cat_desserts uuid;
  v_prod_mini uuid; v_addon uuid;
BEGIN

INSERT INTO public.menu_categories (slug, name_ar, name_en, icon, sort_order)
VALUES
  ('hot-cold-drinks', 'مشروبات ساخنة وباردة', 'Hot & Cold Drinks', 'Coffee', 1),
  ('non-coffee-drinks', 'بدون قهوة', 'Non-Coffee Drinks', 'CupSoda', 2),
  ('saudi-coffee-pot', 'دلة سعودي', 'Saudi Coffee Pot', 'UtensilsCrossed', 3),
  ('desserts', 'حلويات', 'Desserts', 'Cake', 4)
ON CONFLICT (slug) DO NOTHING;

SELECT id INTO v_cat_hot_cold FROM public.menu_categories WHERE slug = 'hot-cold-drinks';
SELECT id INTO v_cat_non_coffee FROM public.menu_categories WHERE slug = 'non-coffee-drinks';
SELECT id INTO v_cat_saudi_pot FROM public.menu_categories WHERE slug = 'saudi-coffee-pot';
SELECT id INTO v_cat_desserts FROM public.menu_categories WHERE slug = 'desserts';

INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_hot_cold, 'todays-coffee', 'قهوة اليوم', 'Today''s Coffee', 9, 5, 1),
  (v_cat_hot_cold, 'espresso', 'اسبريسو', 'Espresso', 10, 3, 2),
  (v_cat_hot_cold, 'americano', 'أمريكانو', 'Americano', 11, 5, 3),
  (v_cat_hot_cold, 'v60', 'V60', 'V60', 15, 6, 4),
  (v_cat_hot_cold, 'macchiato', 'ميكاتو', 'Macchiato', 10, 20, 5),
  (v_cat_hot_cold, 'cortado', 'كورتادو', 'Cortado', 14, 80, 6),
  (v_cat_hot_cold, 'cappuccino', 'كابتشينو', 'Cappuccino', 15, 140, 7),
  (v_cat_hot_cold, 'flat-white', 'فلات وايت', 'Flat White', 15, 120, 8),
  (v_cat_hot_cold, 'spanish-latte', 'سبانيش لاتيه', 'Spanish Latte', 17, 198, 9),
  (v_cat_hot_cold, 'latte', 'لاتيه', 'Latte', 16, 165, 10),
  (v_cat_hot_cold, 'white-mocha-latte', 'وايت موكا لاتيه', 'White Mocha Latte', 17, 175, 11),
  (v_cat_hot_cold, 'iced-shaken-white-mocha', 'آيس شيكن وايت موكا', 'Iced Shaken White Mocha', 18, 120, 12),
  (v_cat_hot_cold, 'saudi-latte', 'سعودي لاتيه', 'Saudi Latte', NULL, 120, 13)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en,
  price = EXCLUDED.price, calories = EXCLUDED.calories, sort_order = EXCLUDED.sort_order;

INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_non_coffee, 'hot-chocolate', 'هوت شوكولاتة', 'Hot Chocolate', 18, 400, 1),
  (v_cat_non_coffee, 'passion-fruit', 'باشن فروت', 'Passion Fruit', 15, 371, 2),
  (v_cat_non_coffee, 'matcha', 'ماتشا', 'Matcha', 17, 120, 3),
  (v_cat_non_coffee, 'mix-berry-mojito', 'موهيتو مكس بيري', 'Mix Berry Mojito', 15, 83, 4),
  (v_cat_non_coffee, 'hibiscus-s', 'كركديه S', 'Hibiscus S', NULL, 105, 5),
  (v_cat_non_coffee, 'berry-boba', 'بوبا توت', 'Berry Boba', 15, NULL, 6),
  (v_cat_non_coffee, 'matcha-with-cream', 'ماتشا بالكريمة', 'Matcha with Cream', 20, NULL, 7)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en,
  price = EXCLUDED.price, calories = EXCLUDED.calories, sort_order = EXCLUDED.sort_order;

INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_hot_cold, 'pistachio-latte', 'بستاشيو لاتيه', 'Pistachio Latte', 17, NULL, 14)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en,
  price = EXCLUDED.price, calories = EXCLUDED.calories, sort_order = EXCLUDED.sort_order;

INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_saudi_pot, 'saudi-coffee-pot', 'دلة قهوة سعودي', 'Saudi Coffee Pot', 25, 250, 1)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en,
  price = EXCLUDED.price, calories = EXCLUDED.calories, sort_order = EXCLUDED.sort_order;

INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_desserts, 'mango-cake', 'كيكة المانجو', 'Mango Cake', 21, 252, 1),
  (v_cat_desserts, 'mini-pancake', 'ميني بانكيك', 'Mini Pancake', NULL, NULL, 2),
  (v_cat_desserts, 'san-sebastian', 'سان سباستيان', 'San Sebastian', 17, 335, 3),
  (v_cat_desserts, 'galaxy-cheesecake', 'تشيز كيك جلاكسي', 'Galaxy Cheesecake', 18, 335, 4),
  (v_cat_desserts, 'honey-cake', 'كيكة العسل', 'Honey Cake', 17, 390, 5),
  (v_cat_desserts, 'tiramisu', 'تيراميسو', 'Tiramisu', 18, 390, 6),
  (v_cat_desserts, 'crunch-cake', 'كيكة كرانشي', 'Crunch Cake', 17, 550, 7),
  (v_cat_desserts, 'pudding', 'بودينغ', 'Pudding', 13, 145, 8),
  (v_cat_desserts, 'nutella-crepe', 'كريب نوتيلا', 'Nutella Crepe', 17, 428, 9),
  (v_cat_desserts, 'lotus-crepe', 'كريب لوتس', 'Lotus Crepe', 17, 448, 10),
  (v_cat_desserts, 'galaxy-crepe', 'كريب جلاكسي', 'Galaxy Crepe', 19, 412, 11),
  (v_cat_desserts, 'fettuccine-crepe', 'كريب فوتشيني', 'Fettuccine Crepe', 22, 427, 12),
  (v_cat_desserts, 'crepe-roll', 'كريب رول', 'Crepe Roll', 20, 451, 13),
  (v_cat_desserts, 'mix-crepe', 'كريب مكس', 'Mix Crepe', 24, 451, 14),
  (v_cat_desserts, 'nutella-waffle', 'وافل نوتيلا', 'Nutella Waffle', 17, 465, 15),
  (v_cat_desserts, 'lotus-waffle', 'وافل لوتس', 'Lotus Waffle', 17, 450, 16),
  (v_cat_desserts, 'galaxy-waffle', 'وافل جلاكسي', 'Galaxy Waffle', 19, 441, 17),
  (v_cat_desserts, 'crunchy-waffle', 'وافل كرانشي', 'Crunchy Waffle', 17, 427, 18),
  (v_cat_desserts, 'pistachio-waffle', 'وافل بيستاشو', 'Pistachio Waffle', 17, 473, 19),
  (v_cat_desserts, 'mix-waffle', 'وافل مكس', 'Mix Waffle', 24, 468, 20)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id, name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en,
  price = EXCLUDED.price, calories = EXCLUDED.calories, sort_order = EXCLUDED.sort_order;

SELECT id INTO v_prod_mini FROM public.menu_products WHERE slug = 'mini-pancake';

INSERT INTO public.product_variants (product_id, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_prod_mini, '10 حبات', '10 Pieces', 17, 430, 1),
  (v_prod_mini, '20 حبة', '20 Pieces', 31, 860, 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.addon_groups (name_ar, name_en, sort_order)
VALUES ('إضافات الحلويات', 'Dessert Add-ons', 1)
ON CONFLICT DO NOTHING;

SELECT id INTO v_addon FROM public.addon_groups WHERE name_en = 'Dessert Add-ons' LIMIT 1;

INSERT INTO public.addon_items (addon_group_id, name_ar, name_en, price, sort_order)
VALUES
  (v_addon, 'صوص شوكولاتة', 'Chocolate Sauce', 3, 1),
  (v_addon, 'صوص كراميل', 'Caramel Sauce', 3, 2),
  (v_addon, 'كريمة مخفوقة', 'Whipped Cream', 3, 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.product_addon_groups (product_id, addon_group_id)
SELECT p.id, v_addon
FROM public.menu_products p
WHERE p.slug IN (
  'mini-pancake','nutella-crepe','lotus-crepe','galaxy-crepe',
  'fettuccine-crepe','crepe-roll','mix-crepe','nutella-waffle',
  'lotus-waffle','galaxy-waffle','crunchy-waffle','pistachio-waffle','mix-waffle'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.menu_settings (cafe_name_ar, cafe_name_en, primary_color, english_enabled, default_theme)
VALUES ('ماهر كيف', 'Maher Kaif', '#F26522', true, 'system')
ON CONFLICT DO NOTHING;

-- Ensure exactly one settings row exists
IF (SELECT count(*) FROM public.menu_settings) = 0 THEN
  INSERT INTO public.menu_settings (cafe_name_ar, cafe_name_en, primary_color, english_enabled, default_theme)
  VALUES ('ماهر كيف', 'Maher Kaif', '#F26522', true, 'system');
END IF;

END $$;

-- 16. Grants
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 17. Reload schema
NOTIFY pgrst, 'reload schema';

COMMIT;

-- 18. Verification (runs after commit)
DO $$ DECLARE
  v_cats int; v_prods int; v_vars int; v_ag int; v_ai int; v_al int; v_set int; v_ban int;
BEGIN
  SELECT count(*) INTO v_cats FROM public.menu_categories;
  SELECT count(*) INTO v_prods FROM public.menu_products;
  SELECT count(*) INTO v_vars FROM public.product_variants;
  SELECT count(*) INTO v_ag FROM public.addon_groups;
  SELECT count(*) INTO v_ai FROM public.addon_items;
  SELECT count(*) INTO v_al FROM public.product_addon_groups;
  SELECT count(*) INTO v_set FROM public.menu_settings;
  SELECT count(*) INTO v_ban FROM public.menu_banners;

  RAISE NOTICE 'Verification: cats=% (expect 4), prods=% (expect 42), vars=% (expect 2), groups=% (expect 1), items=% (expect 3), links=% (expect 13), settings=% (expect 1), banners=% (expect 0)',
    v_cats, v_prods, v_vars, v_ag, v_ai, v_al, v_set, v_ban;

  IF v_cats != 4 OR v_prods != 42 OR v_vars != 2 OR v_ag != 1 OR v_ai != 3 OR v_al != 13 OR v_set < 1 THEN
    RAISE WARNING 'Data verification failed: categories=%, products=%, variants=%, addon_groups=%, addon_items=%, addon_links=%, settings=%',
      v_cats, v_prods, v_vars, v_ag, v_ai, v_al, v_set;
  END IF;
END $$;
