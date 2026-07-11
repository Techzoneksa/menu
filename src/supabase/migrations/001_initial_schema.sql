-- ============================================================
-- 001_initial_schema.sql
-- Maher Kaif Menu – full schema, RLS, triggers & indexes
-- ============================================================

-- ── updated_at trigger function ──────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── menu_categories ──────────────────────────────────────────
CREATE TABLE public.menu_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text UNIQUE NOT NULL,
  name_ar    text NOT NULL,
  name_en    text NOT NULL,
  icon       text,
  image_url  text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER set_menu_categories_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── menu_products ────────────────────────────────────────────
CREATE TABLE public.menu_products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid REFERENCES public.menu_categories(id) ON DELETE CASCADE NOT NULL,
  slug          text UNIQUE NOT NULL,
  name_ar       text NOT NULL,
  name_en       text NOT NULL,
  description_ar text,
  description_en text,
  price         numeric,
  calories      int,
  image_url     text,
  badge_ar      text,
  badge_en      text,
  is_available  boolean DEFAULT true,
  is_visible    boolean DEFAULT true,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TRIGGER set_menu_products_updated_at
  BEFORE UPDATE ON public.menu_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── product_images ───────────────────────────────────────────
CREATE TABLE public.product_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.menu_products(id) ON DELETE CASCADE NOT NULL,
  image_url  text NOT NULL,
  alt_ar     text,
  alt_en     text,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ── product_variants ─────────────────────────────────────────
CREATE TABLE public.product_variants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.menu_products(id) ON DELETE CASCADE NOT NULL,
  name_ar    text NOT NULL,
  name_en    text NOT NULL,
  price      numeric NOT NULL,
  calories   int,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER set_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── addon_groups ─────────────────────────────────────────────
CREATE TABLE public.addon_groups (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar    text NOT NULL,
  name_en    text NOT NULL,
  sort_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER set_addon_groups_updated_at
  BEFORE UPDATE ON public.addon_groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── addon_items ──────────────────────────────────────────────
CREATE TABLE public.addon_items (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_group_id uuid REFERENCES public.addon_groups(id) ON DELETE CASCADE NOT NULL,
  name_ar        text NOT NULL,
  name_en        text NOT NULL,
  price          numeric NOT NULL,
  sort_order     int DEFAULT 0,
  is_visible     boolean DEFAULT true,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE TRIGGER set_addon_items_updated_at
  BEFORE UPDATE ON public.addon_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── product_addon_groups (join table) ────────────────────────
CREATE TABLE public.product_addon_groups (
  product_id     uuid REFERENCES public.menu_products(id) ON DELETE CASCADE NOT NULL,
  addon_group_id uuid REFERENCES public.addon_groups(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (product_id, addon_group_id)
);

-- ── menu_banners ─────────────────────────────────────────────
CREATE TABLE public.menu_banners (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url      text NOT NULL,
  title_ar       text,
  title_en       text,
  description_ar text,
  description_en text,
  internal_link  text,
  sort_order     int DEFAULT 0,
  is_visible     boolean DEFAULT true,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE TRIGGER set_menu_banners_updated_at
  BEFORE UPDATE ON public.menu_banners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── menu_settings ────────────────────────────────────────────
CREATE TABLE public.menu_settings (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_name_ar       text DEFAULT 'ماهر كيف',
  cafe_name_en       text DEFAULT 'Maher Kaif',
  description_ar     text,
  description_en     text,
  logo_url           text,
  white_logo_url     text,
  primary_color      text DEFAULT '#F26522',
  phone              text,
  whatsapp           text,
  email              text,
  instagram          text,
  location_url       text,
  branch_status_ar   text,
  branch_status_en   text,
  show_branch_status boolean DEFAULT false,
  english_enabled    boolean DEFAULT true,
  default_theme      text DEFAULT 'system',
  menu_domain        text,
  updated_at         timestamptz DEFAULT now()
);

CREATE TRIGGER set_menu_settings_updated_at
  BEFORE UPDATE ON public.menu_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_menu_products_category_id ON public.menu_products (category_id);
CREATE INDEX idx_menu_products_sort_order  ON public.menu_products (sort_order);
CREATE INDEX idx_menu_categories_sort_order ON public.menu_categories (sort_order);
CREATE INDEX idx_product_variants_product_id ON public.product_variants (product_id);
CREATE INDEX idx_product_variants_sort_order  ON public.product_variants (sort_order);
CREATE INDEX idx_product_images_product_id ON public.product_images (product_id);
CREATE INDEX idx_product_images_sort_order  ON public.product_images (sort_order);
CREATE INDEX idx_addon_items_addon_group_id ON public.addon_items (addon_group_id);
CREATE INDEX idx_addon_items_sort_order     ON public.addon_items (sort_order);
CREATE INDEX idx_addon_groups_sort_order    ON public.addon_groups (sort_order);
CREATE INDEX idx_menu_banners_sort_order    ON public.menu_banners (sort_order);
CREATE INDEX idx_product_addon_groups_addon_group_id ON public.product_addon_groups (addon_group_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.menu_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_groups          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_addon_groups  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_banners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_settings         ENABLE ROW LEVEL SECURITY;

-- ── menu_categories ──────────────────────────────────────────
CREATE POLICY "Public can view visible categories"
  ON public.menu_categories FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on categories"
  ON public.menu_categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── menu_products ────────────────────────────────────────────
CREATE POLICY "Public can view visible products"
  ON public.menu_products FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on products"
  ON public.menu_products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── product_images ───────────────────────────────────────────
CREATE POLICY "Public can view visible product images"
  ON public.product_images FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on product images"
  ON public.product_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── product_variants ─────────────────────────────────────────
CREATE POLICY "Public can view visible variants"
  ON public.product_variants FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on variants"
  ON public.product_variants FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── addon_groups ─────────────────────────────────────────────
CREATE POLICY "Public can view visible addon groups"
  ON public.addon_groups FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on addon groups"
  ON public.addon_groups FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── addon_items ──────────────────────────────────────────────
CREATE POLICY "Public can view visible addon items"
  ON public.addon_items FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on addon items"
  ON public.addon_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── product_addon_groups ─────────────────────────────────────
CREATE POLICY "Public can view product_addon_groups"
  ON public.product_addon_groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated full access on product_addon_groups"
  ON public.product_addon_groups FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── menu_banners ─────────────────────────────────────────────
CREATE POLICY "Public can view visible banners"
  ON public.menu_banners FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated full access on banners"
  ON public.menu_banners FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── menu_settings ────────────────────────────────────────────
CREATE POLICY "Public can view settings"
  ON public.menu_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated full access on settings"
  ON public.menu_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
