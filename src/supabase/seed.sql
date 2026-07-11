-- ============================================================
-- seed.sql
-- Maher Kaif Menu – full seed data
-- ============================================================

-- ── Variables for category IDs ───────────────────────────────
DO $$
DECLARE
  v_cat_hot_cold    uuid;
  v_cat_non_coffee  uuid;
  v_cat_saudi_pot   uuid;
  v_cat_desserts    uuid;

  v_prod_mini_pancake uuid;
  v_addon_group_id    uuid;
BEGIN

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO public.menu_categories (slug, name_ar, name_en, icon, sort_order)
VALUES ('hot-cold-drinks', 'مشروبات ساخنة وباردة', 'Hot & Cold Drinks', 'Coffee', 1)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO v_cat_hot_cold;

INSERT INTO public.menu_categories (slug, name_ar, name_en, icon, sort_order)
VALUES ('non-coffee-drinks', 'بدون قهوة', 'Non-Coffee Drinks', 'CupSoda', 2)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO v_cat_non_coffee;

INSERT INTO public.menu_categories (slug, name_ar, name_en, icon, sort_order)
VALUES ('saudi-coffee-pot', 'دلة سعودي', 'Saudi Coffee Pot', 'UtensilsCrossed', 3)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO v_cat_saudi_pot;

INSERT INTO public.menu_categories (slug, name_ar, name_en, icon, sort_order)
VALUES ('desserts', 'حلويات', 'Desserts', 'Cake', 4)
ON CONFLICT (slug) DO NOTHING
RETURNING id INTO v_cat_desserts;

-- Fallback: fetch existing IDs if ON CONFLICT skipped the insert
SELECT id INTO v_cat_hot_cold FROM public.menu_categories WHERE slug = 'hot-cold-drinks';
SELECT id INTO v_cat_non_coffee FROM public.menu_categories WHERE slug = 'non-coffee-drinks';
SELECT id INTO v_cat_saudi_pot FROM public.menu_categories WHERE slug = 'saudi-coffee-pot';
SELECT id INTO v_cat_desserts FROM public.menu_categories WHERE slug = 'desserts';

-- ============================================================
-- PRODUCTS – Hot & Cold Drinks (sort_order 1-13)
-- ============================================================
INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_hot_cold, 'todays-coffee',       'قهوة اليوم',        'Today''s Coffee',          9,   5,  1),
  (v_cat_hot_cold, 'espresso',            'اسبريسو',           'Espresso',                10,   3,  2),
  (v_cat_hot_cold, 'americano',           'أمريكانو',           'Americano',               11,   5,  3),
  (v_cat_hot_cold, 'v60',                 'V60',               'V60',                     15,   6,  4),
  (v_cat_hot_cold, 'macchiato',           'ميكاتو',             'Macchiato',               10,  20,  5),
  (v_cat_hot_cold, 'cortado',             'كورتادو',            'Cortado',                 14,  80,  6),
  (v_cat_hot_cold, 'cappuccino',          'كابتشينو',           'Cappuccino',              15, 140,  7),
  (v_cat_hot_cold, 'flat-white',          'فلات وايت',          'Flat White',              15, 120,  8),
  (v_cat_hot_cold, 'spanish-latte',       'سبانيش لاتيه',       'Spanish Latte',           17, 198,  9),
  (v_cat_hot_cold, 'latte',               'لاتيه',              'Latte',                   16, 165, 10),
  (v_cat_hot_cold, 'white-mocha-latte',   'وايت موكا لاتيه',    'White Mocha Latte',       17, 175, 11),
  (v_cat_hot_cold, 'iced-shaken-white-mocha', 'آيس شيكن وايت موكا', 'Iced Shaken White Mocha', 18, 120, 12),
  (v_cat_hot_cold, 'saudi-latte',         'سعودي لاتيه',        'Saudi Latte',           NULL, 120, 13)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS – Non-Coffee Drinks (sort_order 1-5)
-- ============================================================
INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_non_coffee, 'hot-chocolate',       'هوت شوكولاتة',      'Hot Chocolate',      18, 400, 1),
  (v_cat_non_coffee, 'passion-fruit',       'باشن فروت',          'Passion Fruit',      15, 371, 2),
  (v_cat_non_coffee, 'matcha',              'ماتشا',              'Matcha',             17, 120, 3),
  (v_cat_non_coffee, 'mix-berry-mojito',    'موهيتو مكس بيري',   'Mix Berry Mojito',   15,  83, 4),
  (v_cat_non_coffee, 'hibiscus-s',          'كركديه S',           'Hibiscus S',        NULL, 105, 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS – Saudi Coffee Pot (sort_order 1)
-- ============================================================
INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_saudi_pot, 'saudi-coffee-pot', 'دلة قهوة سعودي', 'Saudi Coffee Pot', 25, 250, 1)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS – Desserts (sort_order 1-20)
-- ============================================================
INSERT INTO public.menu_products (category_id, slug, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_cat_desserts, 'mango-cake',            'كيكة المانجو',        'Mango Cake',            21,  252,  1),
  (v_cat_desserts, 'mini-pancake',          'ميني بانكيك',          'Mini Pancake',        NULL, NULL,  2),
  (v_cat_desserts, 'san-sebastian',         'سان سباستيان',        'San Sebastian',         17,  335,  3),
  (v_cat_desserts, 'galaxy-cheesecake',     'تشيز كيك جلاكسي',     'Galaxy Cheesecake',     18,  335,  4),
  (v_cat_desserts, 'honey-cake',            'كيكة العسل',           'Honey Cake',            17,  390,  5),
  (v_cat_desserts, 'tiramisu',              'تيراميسو',             'Tiramisu',              18,  390,  6),
  (v_cat_desserts, 'crunch-cake',           'كيكة كرانشي',          'Crunch Cake',           17,  550,  7),
  (v_cat_desserts, 'pudding',               'بودينغ',               'Pudding',               13,  145,  8),
  (v_cat_desserts, 'nutella-crepe',         'كريب نوتيلا',          'Nutella Crepe',         17,  428,  9),
  (v_cat_desserts, 'lotus-crepe',           'كريب لوتس',            'Lotus Crepe',           17,  448, 10),
  (v_cat_desserts, 'galaxy-crepe',          'كريب جلاكسي',          'Galaxy Crepe',          19,  412, 11),
  (v_cat_desserts, 'fettuccine-crepe',      'كريب فوتشيني',         'Fettuccine Crepe',      22,  427, 12),
  (v_cat_desserts, 'crepe-roll',            'كريب رول',             'Crepe Roll',            20,  451, 13),
  (v_cat_desserts, 'mix-crepe',             'كريب مكس',             'Mix Crepe',             24,  451, 14),
  (v_cat_desserts, 'nutella-waffle',        'وافل نوتيلا',          'Nutella Waffle',        17,  465, 15),
  (v_cat_desserts, 'lotus-waffle',          'وافل لوتس',            'Lotus Waffle',          17,  450, 16),
  (v_cat_desserts, 'galaxy-waffle',         'وافل جلاكسي',          'Galaxy Waffle',         19,  441, 17),
  (v_cat_desserts, 'crunchy-waffle',        'وافل كرانشي',          'Crunchy Waffle',        17,  427, 18),
  (v_cat_desserts, 'pistachio-waffle',      'وافل بيستاشو',         'Pistachio Waffle',      17,  473, 19),
  (v_cat_desserts, 'mix-waffle',            'وافل مكس',             'Mix Waffle',            24,  468, 20)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- VARIANTS – Mini Pancake
-- ============================================================
SELECT id INTO v_prod_mini_pancake FROM public.menu_products WHERE slug = 'mini-pancake';

INSERT INTO public.product_variants (product_id, name_ar, name_en, price, calories, sort_order)
VALUES
  (v_prod_mini_pancake, '10 حبات', '10 Pieces', 17, 430, 1),
  (v_prod_mini_pancake, '20 حبة',  '20 Pieces', 31, 860, 2);

-- ============================================================
-- ADDON GROUP – Dessert Add-ons
-- ============================================================
INSERT INTO public.addon_groups (name_ar, name_en, sort_order)
VALUES ('إضافات الحلويات', 'Dessert Add-ons', 1)
ON CONFLICT DO NOTHING
RETURNING id INTO v_addon_group_id;

SELECT id INTO v_addon_group_id FROM public.addon_groups WHERE name_en = 'Dessert Add-ons' LIMIT 1;

INSERT INTO public.addon_items (addon_group_id, name_ar, name_en, price, sort_order)
VALUES
  (v_addon_group_id, 'صوص شوكولاتة',  'Chocolate Sauce',  3, 1),
  (v_addon_group_id, 'صوص كراميل',     'Caramel Sauce',    3, 2),
  (v_addon_group_id, 'كريمة مخفوقة',   'Whipped Cream',    3, 3);

-- ============================================================
-- LINK ADDON GROUP → PRODUCTS
-- ============================================================
INSERT INTO public.product_addon_groups (product_id, addon_group_id)
SELECT p.id, v_addon_group_id
FROM public.menu_products p
WHERE p.slug IN (
  'mini-pancake',
  'nutella-crepe',
  'lotus-crepe',
  'galaxy-crepe',
  'fettuccine-crepe',
  'crepe-roll',
  'mix-crepe',
  'nutella-waffle',
  'lotus-waffle',
  'galaxy-waffle',
  'crunchy-waffle',
  'pistachio-waffle',
  'mix-waffle'
);

-- ============================================================
-- SETTINGS
-- ============================================================
INSERT INTO public.menu_settings (cafe_name_ar, cafe_name_en, primary_color, english_enabled, default_theme)
VALUES ('ماهر كيف', 'Maher Kaif', '#F26522', true, 'system');

END $$;
