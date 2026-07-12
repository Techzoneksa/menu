import { z } from 'zod';

const safeText = z.string().trim().max(500);
const safeTextNullable = safeText.nullable().optional();

export const categorySchema = z.object({
  name_ar: z.string().trim().min(1, 'الاسم بالعربية مطلوب').max(200),
  name_en: z.string().trim().min(1, 'الاسم بالإنجليزية مطلوب').max(200),
  slug: z.string().trim().min(1, 'الرابط المختصر مطلوب').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'الرابط غير صالح').max(200),
  icon: safeTextNullable,
  image_url: safeTextNullable,
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const productSchema = z.object({
  category_id: z.string().uuid('اختر فئة'),
  name_ar: z.string().trim().min(1, 'الاسم بالعربية مطلوب').max(200),
  name_en: z.string().trim().min(1, 'الاسم بالإنجليزية مطلوب').max(200),
  slug: z.string().trim().min(1, 'الرابط المختصر مطلوب').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'الرابط غير صالح').max(200),
  description_ar: safeTextNullable,
  description_en: safeTextNullable,
  price: z.number().min(0).nullable().optional(),
  calories: z.number().int().min(0).nullable().optional(),
  image_url: safeTextNullable,
  badge_ar: safeTextNullable,
  badge_en: safeTextNullable,
  is_available: z.boolean().default(true),
  is_visible: z.boolean().default(true),
  is_hot: z.boolean().default(false),
  is_cold: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

export const variantSchema = z.object({
  name_ar: z.string().trim().min(1, 'الاسم بالعربية مطلوب').max(200),
  name_en: z.string().trim().min(1, 'الاسم بالإنجليزية مطلوب').max(200),
  price: z.number().min(0, 'السعر يجب أن يكون موجبًا'),
  calories: z.number().int().min(0).nullable().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const addonGroupSchema = z.object({
  name_ar: z.string().trim().min(1, 'الاسم بالعربية مطلوب').max(200),
  name_en: z.string().trim().min(1, 'الاسم بالإنجليزية مطلوب').max(200),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const addonItemSchema = z.object({
  addon_group_id: z.string().uuid(),
  name_ar: z.string().trim().min(1, 'الاسم بالعربية مطلوب').max(200),
  name_en: z.string().trim().min(1, 'الاسم بالإنجليزية مطلوب').max(200),
  price: z.number().min(0, 'السعر الإضافي يجب أن يكون موجبًا'),
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

const safeUrl = z.string().trim().max(2000).refine(
  (val) => {
    if (!val) return true;
    try {
      const url = new URL(val);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'الرابط غير صالح / Invalid URL' }
).nullable().optional();

const safeInternalLink = z.string().trim().max(500).refine(
  (val) => {
    if (!val) return true;
    if (!val.startsWith('/')) return false;
    if (val.includes('javascript:') || val.includes('data:') || val.includes('vbscript:')) return false;
    return true;
  },
  { message: 'الرابط الداخلي يجب أن يبدأ بـ /' }
).nullable().optional();

const hexColor = z.string().regex(/^#([0-9A-Fa-f]{6})$/, 'اللون غير صالح / Invalid hex color').nullable().optional();

export const bannerSchema = z.object({
  image_url: z.string().min(1, 'صورة البنر مطلوبة'),
  title_ar: safeTextNullable,
  title_en: safeTextNullable,
  description_ar: safeTextNullable,
  description_en: safeTextNullable,
  internal_link: safeInternalLink,
  sort_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

export const settingsSchema = z.object({
  cafe_name_ar: safeTextNullable,
  cafe_name_en: safeTextNullable,
  description_ar: safeTextNullable,
  description_en: safeTextNullable,
  logo_url: safeTextNullable,
  white_logo_url: safeTextNullable,
  primary_color: hexColor,
  phone: safeTextNullable,
  whatsapp: safeTextNullable,
  email: z.string().trim().email().nullable().optional(),
  instagram: safeUrl,
  location_url: safeUrl,
  branch_status_ar: safeTextNullable,
  branch_status_en: safeTextNullable,
  show_branch_status: z.boolean().default(false),
  english_enabled: z.boolean().default(true),
  default_theme: z.enum(['light', 'dark', 'system']).default('system'),
  menu_domain: safeUrl,
  qr_color: hexColor,
  qr_bg: hexColor,
  qr_text_ar: safeTextNullable,
  qr_text_en: safeTextNullable,
});

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
