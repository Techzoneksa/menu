-- ============================================================
-- 006_contact_fields.sql
-- Add contact information settings for the public footer
-- ============================================================

ALTER TABLE public.menu_settings
  ADD COLUMN IF NOT EXISTS contact_phone                   text DEFAULT '0532424510',
  ADD COLUMN IF NOT EXISTS contact_whatsapp               text DEFAULT '966532424510',
  ADD COLUMN IF NOT EXISTS contact_instagram_url          text,
  ADD COLUMN IF NOT EXISTS contact_snapchat_url            text,
  ADD COLUMN IF NOT EXISTS contact_tiktok_url              text,
  ADD COLUMN IF NOT EXISTS contact_x_url                   text,
  ADD COLUMN IF NOT EXISTS contact_facebook_url            text,
  ADD COLUMN IF NOT EXISTS contact_social_username         text DEFAULT '@MAHERKAIFSA',
  ADD COLUMN IF NOT EXISTS contact_suggestions_msg_ar      text DEFAULT 'السلام عليكم،
لدي ملاحظة أو شكوى بخصوص منيو ماهر كيف.',
  ADD COLUMN IF NOT EXISTS contact_suggestions_msg_en      text DEFAULT 'Hello,
I have a suggestion or complaint regarding Maher Kaif Menu.',
  ADD COLUMN IF NOT EXISTS show_contact_section            boolean DEFAULT true;

COMMENT ON COLUMN public.menu_settings.contact_phone              IS 'Phone number displayed in the contact section (digits only, e.g. 0532424510)';
COMMENT ON COLUMN public.menu_settings.contact_whatsapp          IS 'WhatsApp number used for wa.me links (with country code, no +, e.g. 966532424510)';
COMMENT ON COLUMN public.menu_settings.contact_instagram_url     IS 'Instagram URL (e.g. https://instagram.com/maherkaifsa)';
COMMENT ON COLUMN public.menu_settings.contact_snapchat_url      IS 'Snapchat URL (e.g. https://snapchat.com/add/maherkaifsa)';
COMMENT ON COLUMN public.menu_settings.contact_tiktok_url        IS 'TikTok URL (e.g. https://tiktok.com/@maherkaifsa)';
COMMENT ON COLUMN public.menu_settings.contact_x_url             IS 'X / Twitter URL';
COMMENT ON COLUMN public.menu_settings.contact_facebook_url      IS 'Facebook URL';
COMMENT ON COLUMN public.menu_settings.contact_social_username    IS 'Clickable social handle shown in the contact section (e.g. @MAHERKAIFSA)';
COMMENT ON COLUMN public.menu_settings.contact_suggestions_msg_ar IS 'Prefilled Arabic WhatsApp message for suggestions & complaints';
COMMENT ON COLUMN public.menu_settings.contact_suggestions_msg_en IS 'Prefilled English WhatsApp message for suggestions & complaints';
COMMENT ON COLUMN public.menu_settings.show_contact_section       IS 'Toggle to show or hide the entire Contact & Support footer';
