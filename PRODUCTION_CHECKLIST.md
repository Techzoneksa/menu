# قائمة تحقق ما قبل الإطلاق — Maher Kaif

## Supabase
- [ ] إنشاء مشروع Supabase
- [ ] تشغيل Migration 001_initial_schema.sql
- [ ] تشغيل Migration 002_storage_buckets.sql
- [ ] تشغيل Migration 003_admin_rbac.sql
- [ ] تشغيل seed.sql
- [ ] إنشاء مستخدم المدير في Authentication
- [ ] إدراج المستخدم في admin_users
- [ ] التحقق من عمل is_admin()
- [ ] تكوين Authentication → Site URL: `https://maher.jaadsa.com/`
- [ ] تكوين Authentication → Redirect URLs: `https://maher.jaadsa.com/reset-password`

## Storage Buckets
- [ ] التأكد من وجود bucket menu-logos
- [ ] التأكد من وجود bucket menu-products
- [ ] التأكد من وجود bucket menu-banners
- [ ] التحقق من سياسات storage (admin only write)

## RLS Policies
- [ ] الزائر يقرأ المنيو
- [ ] الزائر لا يرفع صور
- [ ] الزائر لا يعدّل البيانات
- [ ] المستخدم غير المدير لا يفتح الإدارة
- [ ] المدير يفتح الإدارة ويعدّل

## الصور
- [ ] رفع الشعار الأساسي
- [ ] رفع الشعار الأبيض
- [ ] رفع صور المنتجات
- [ ] رفع البنرات
- [ ] التحقق من عدم ظهور صور مكسورة

## المحتوى
- [ ] تحديث معلومات التواصل
- [ ] تحديث رابط الموقع
- [ ] تحديث حالة الفرع
- [ ] تحديث لون الهوية
- [ ] إدخال رابط الدومين

## QR
- [ ] توليد رمز QR
- [ ] اختبار المسح من الهاتف
- [ ] التحقق من فتح صفحة المنيو الصحيحة

## النشر
- [ ] إعداد Environment Variables على الاستضافة
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL=https://maher.jaadsa.com`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] تشغيل npm run build
- [ ] تشغيل التطبيق
- [ ] اختبار جميع الصفحات
- [ ] اختبار الوضع النهاري والليلي
- [ ] اختبار اللغة العربية والإنجليزية
- [ ] اختبار على الجوال
- [ ] التحقق من عدم وجود console errors

## إعادة تعيين كلمة المرور
- [ ] فتح `/admin/login` والضغط على "نسيت كلمة المرور؟"
- [ ] إدخال البريد الإلكتروني والضغط على "إرسال رابط إعادة التعيين"
- [ ] التحقق من استلام البريد الإلكتروني
- [ ] فتح الرابط من البريد
- [ ] التأكد من فتح صفحة `/reset-password` بدون تحويل إلى localhost
- [ ] إدخال كلمة مرور جديدة وتأكيدها
- [ ] التأكد من ظهور رسالة "تم تغيير كلمة المرور"
- [ ] تسجيل الدخول بكلمة المرور الجديدة
- [ ] التأكد من عمل تسجيل الدخول بنجاح
