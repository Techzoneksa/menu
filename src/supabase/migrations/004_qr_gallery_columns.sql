-- ============================================================
-- 004_qr_gallery_columns.sql
-- Add QR display settings columns + product gallery is ready
-- ============================================================

-- QR display customization columns
ALTER TABLE public.menu_settings
  ADD COLUMN IF NOT EXISTS qr_color text DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS qr_bg text DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS qr_text_ar text DEFAULT 'امسح الرمز لمشاهدة المنيو',
  ADD COLUMN IF NOT EXISTS qr_text_en text DEFAULT 'Scan to View the Menu';
