"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, saveSettings } from './actions';
import type { MenuSettings } from '@/types/menu';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';

function FieldError({ field, errors }: { field: string; errors: Record<string, string> }) {
  if (!errors[field]) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle size={12} />
      {errors[field]}
    </p>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<MenuSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadSettings = useCallback(async () => {
    const res = await fetchSettings();
    if (res.success) setSettings(res.data as MenuSettings);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Server action state updates
  useEffect(() => { loadSettings(); }, [loadSettings]);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const update = (field: keyof MenuSettings, value: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value } as MenuSettings);
    if (fieldErrors[field]) setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, ...payload } = settings;
    const res = await saveSettings({ id, ...payload });
    setSaving(false);
    if (res.success) {
      setFieldErrors({});
      setToast({ type: 'success', message: 'تم حفظ الإعدادات بنجاح' });
    } else {
      if (res.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const [k, msgs] of Object.entries(res.fieldErrors)) { mapped[k] = msgs[0]; }
        setFieldErrors(mapped);
      }
      setToast({ type: 'error', message: res.error || 'حدث خطأ أثناء الحفظ' });
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">إعدادات المنيو</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl">
        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">اسم المقهى</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">الاسم بالعربية</label><input value={settings.cafe_name_ar || ''} onChange={e => update('cafe_name_ar', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">الاسم بالإنجليزية</label><input value={settings.cafe_name_en || ''} onChange={e => update('cafe_name_en', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">وصف المقهى</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">الوصف بالعربية</label><textarea value={settings.description_ar || ''} onChange={e => update('description_ar', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none resize-none" /></div>
            <div><label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label><textarea value={settings.description_en || ''} onChange={e => update('description_en', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none resize-none" /></div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">الشعارات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploader bucket="menu-logos" currentUrl={settings.logo_url} onUpload={(url) => update('logo_url', url)} onRemove={() => update('logo_url', null)} label="الشعار الملون" />
            <ImageUploader bucket="menu-logos" currentUrl={settings.white_logo_url} onUpload={(url) => update('white_logo_url', url)} onRemove={() => update('white_logo_url', null)} label="الشعار الأبيض" />
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">المظهر</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">اللون الأساسي</label>
              <div className="flex gap-2">
                <input type="color" value={settings.primary_color || '#F26522'} onChange={e => update('primary_color', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                <input value={settings.primary_color || ''} onChange={e => update('primary_color', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" />
              </div>
              <FieldError field="primary_color" errors={fieldErrors} />
            </div>
            <div><label className="block text-sm font-medium mb-1">الوضع الافتراضي</label>
              <select value={settings.default_theme} onChange={e => update('default_theme', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none">
                <option value="light">نهاري</option>
                <option value="dark">ليلي</option>
                <option value="system">النظام</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رابط المنيو</label>
              <input value={settings.menu_domain || ''} onChange={e => update('menu_domain', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" placeholder="https://..." />
              <FieldError field="menu_domain" errors={fieldErrors} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">التواصل</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">رقم الهاتف</label><input value={settings.phone || ''} onChange={e => update('phone', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" /></div>
            <div><label className="block text-sm font-medium mb-1">واتساب</label><input value={settings.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" /></div>
            <div><label className="block text-sm font-medium mb-1">البريد الإلكتروني</label><input value={settings.email || ''} onChange={e => update('email', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" />              <FieldError field="email" errors={fieldErrors} /></div>
            <div><label className="block text-sm font-medium mb-1">إنستغرام</label><input value={settings.instagram || ''} onChange={e => update('instagram', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" placeholder="https://instagram.com/..." />              <FieldError field="instagram" errors={fieldErrors} /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">رابط الموقع على الخريطة</label><input value={settings.location_url || ''} onChange={e => update('location_url', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" placeholder="https://maps.google.com/..." />              <FieldError field="location_url" errors={fieldErrors} /></div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">حالة الفرع</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.show_branch_status} onChange={e => update('show_branch_status', e.target.checked)} className="rounded" /> إظهار حالة الفرع</label>
            {settings.show_branch_status && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">الحالة بالعربية</label><input value={settings.branch_status_ar || ''} onChange={e => update('branch_status_ar', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                <div><label className="block text-sm font-medium mb-1">الحالة بالإنجليزية</label><input value={settings.branch_status_en || ''} onChange={e => update('branch_status_en', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-sm mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">اللغة</h2>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.english_enabled} onChange={e => update('english_enabled', e.target.checked)} className="rounded" /> تفعيل اللغة الإنجليزية</label>
        </div>
      </div>
    </div>
  );
}
