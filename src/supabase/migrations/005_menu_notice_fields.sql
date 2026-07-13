-- ============================================================
-- 005_menu_notice_fields.sql
-- Add VAT notice, calorie guidance, allergen legend settings
-- ============================================================

ALTER TABLE public.menu_settings
  ADD COLUMN IF NOT EXISTS show_menu_notice      boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS vat_notice_ar         text DEFAULT 'جميع الأسعار شاملة ضريبة القيمة المضافة 15٪',
  ADD COLUMN IF NOT EXISTS vat_notice_en         text DEFAULT 'All prices include 15% VAT',
  ADD COLUMN IF NOT EXISTS calories_notice_ar    text DEFAULT 'يحتاج الرجال تقريبًا إلى 2500 سعرة حرارية يوميًا
تحتاج النساء تقريبًا إلى 2000 سعرة حرارية يوميًا
يحتاج الأطفال تقريبًا إلى 1800 سعرة حرارية يوميًا',
  ADD COLUMN IF NOT EXISTS calories_notice_en    text DEFAULT 'Men need approximately 2,500 calories per day
Women need approximately 2,000 calories per day
Children need approximately 1,800 calories per day',
  ADD COLUMN IF NOT EXISTS show_allergen_legend  boolean DEFAULT true;

-- Add comment for clarity
COMMENT ON COLUMN public.menu_settings.show_menu_notice IS 'Show the VAT + calories + allergen notice section at the bottom of /menu';
COMMENT ON COLUMN public.menu_settings.show_allergen_legend IS 'Show the 10-item allergen legend inside the notice section';
COMMENT ON COLUMN public.menu_settings.vat_notice_ar IS 'Arabic VAT notice text';
COMMENT ON COLUMN public.menu_settings.vat_notice_en IS 'English VAT notice text';
COMMENT ON COLUMN public.menu_settings.calories_notice_ar IS 'Arabic daily calorie guidance (newline-separated items)';
COMMENT ON COLUMN public.menu_settings.calories_notice_en IS 'English daily calorie guidance (newline-separated items)';
