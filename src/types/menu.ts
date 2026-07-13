export interface MenuCategory {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  icon: string | null;
  icon_emoji: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuProduct {
  id: string;
  category_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number | null;
  discount_price: number | null;
  calories: number | null;
  image_url: string | null;
  is_hot: boolean;
  is_cold: boolean;
  badge_ar: string | null;
  badge_en: string | null;
  is_available: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: MenuCategory;
  variants?: ProductVariant[];
  addon_groups?: AddonGroup[];
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_ar: string | null;
  alt_en: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  price: number;
  calories: number | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddonGroup {
  id: string;
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  items?: AddonItem[];
}

export interface AddonItem {
  id: string;
  addon_group_id: string;
  name_ar: string;
  name_en: string;
  price: number;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductAddonGroup {
  product_id: string;
  addon_group_id: string;
}

export interface MenuBanner {
  id: string;
  image_url: string;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  internal_link: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuSettings {
  id: string;
  cafe_name_ar: string | null;
  cafe_name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  logo_url: string | null;
  white_logo_url: string | null;
  primary_color: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  location_url: string | null;
  branch_status_ar: string | null;
  branch_status_en: string | null;
  show_branch_status: boolean;
  english_enabled: boolean;
  default_theme: string;
  menu_domain: string | null;
  qr_color: string | null;
  qr_bg: string | null;
  qr_text_ar: string | null;
  qr_text_en: string | null;
  show_menu_notice: boolean | null;
  vat_notice_ar: string | null;
  vat_notice_en: string | null;
  calories_notice_ar: string | null;
  calories_notice_en: string | null;
  show_allergen_legend: boolean | null;
  updated_at: string;
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark' | 'system';

export type ProductWithCategory = MenuProduct & {
  category?: MenuCategory;
};