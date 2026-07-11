-- ============================================================
-- 002_storage_buckets.sql
-- Storage buckets & policies for Maher Kaif menu assets
-- ============================================================

-- ── Create buckets ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('menu-logos',   'menu-logos',   true),
  ('menu-products','menu-products', true),
  ('menu-banners', 'menu-banners',  true);

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- ── menu-logos ───────────────────────────────────────────────
CREATE POLICY "Public read access on menu-logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-logos');

CREATE POLICY "Authenticated upload on menu-logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update on menu-logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete on menu-logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-logos' AND auth.role() = 'authenticated');

-- ── menu-products ────────────────────────────────────────────
CREATE POLICY "Public read access on menu-products"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-products');

CREATE POLICY "Authenticated upload on menu-products"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update on menu-products"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete on menu-products"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-products' AND auth.role() = 'authenticated');

-- ── menu-banners ─────────────────────────────────────────────
CREATE POLICY "Public read access on menu-banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-banners');

CREATE POLICY "Authenticated upload on menu-banners"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-banners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update on menu-banners"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menu-banners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete on menu-banners"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-banners' AND auth.role() = 'authenticated');
