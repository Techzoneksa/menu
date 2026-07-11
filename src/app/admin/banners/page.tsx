"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from 'react';
import { fetchBanners, saveBanner, deleteBanner, toggleBannerVisibility } from './actions';
import type { MenuBanner } from '@/types/menu';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<MenuBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuBanner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuBanner | null>(null);
  const [saving, setSaving] = useState(false);

  const [f, setF] = useState({
    image_url: '', title_ar: '', title_en: '', description_ar: '', description_en: '',
    internal_link: '', sort_order: 0, is_visible: true,
  });

  const loadData = useCallback(async () => {
    const res = await fetchBanners();
    if (res.success) setBanners(res.data as MenuBanner[]);
    else setError(res.error);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Server action state updates
  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setF({ image_url: '', title_ar: '', title_en: '', description_ar: '', description_en: '', internal_link: '', sort_order: 0, is_visible: true });
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (b: MenuBanner) => {
    setEditing(b);
    setF({
      image_url: b.image_url, title_ar: b.title_ar || '', title_en: b.title_en || '',
      description_ar: b.description_ar || '', description_en: b.description_en || '',
      internal_link: b.internal_link || '', sort_order: b.sort_order, is_visible: b.is_visible,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!f.image_url) return;
    setSaving(true);
    const res = await saveBanner({
      id: editing?.id,
      image_url: f.image_url, title_ar: f.title_ar || null, title_en: f.title_en || null,
      description_ar: f.description_ar || null, description_en: f.description_en || null,
      internal_link: f.internal_link || null, sort_order: f.sort_order, is_visible: f.is_visible,
    });
    setSaving(false);
    if (res.success) { setShowForm(false); resetForm(); loadData(); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBanner(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  };

  const handleToggleVisibility = async (b: MenuBanner) => {
    await toggleBannerVisibility(b.id, !b.is_visible);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-2">حدث خطأ</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button onClick={loadData} className="mt-4 px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: '#F26522' }}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">إدارة البنرات</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: '#F26522' }}>
          <Plus size={16} /> إضافة بنر
        </button>
      </div>

      <div className="space-y-3">
        {banners.map(b => (
          <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
            {b.image_url && <img src={b.image_url} alt="" className="w-20 h-12 object-cover rounded-lg shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{b.title_ar || b.title_en || 'بنر بدون عنوان'}</p>
              <p className="text-xs text-gray-500">الترتيب: {b.sort_order}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleToggleVisibility(b)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                {b.is_visible ? <Eye size={16} /> : <EyeOff size={16} className="opacity-40" />}
              </button>
              <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Pencil size={16} /></button>
              <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">لا توجد بنرات</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-8">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-xl">
              <h2 className="font-bold text-lg mb-4">{editing ? 'تعديل البنر' : 'إضافة بنر'}</h2>
              <div className="space-y-4">
                <ImageUploader bucket="menu-banners" currentUrl={f.image_url || null} onUpload={(url) => setF({ ...f, image_url: url })} onRemove={() => setF({ ...f, image_url: '' })} label="صورة البنر *" />
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">العنوان بالعربية</label><input value={f.title_ar} onChange={e => setF({ ...f, title_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">العنوان بالإنجليزية</label><input value={f.title_en} onChange={e => setF({ ...f, title_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">الوصف بالعربية</label><textarea value={f.description_ar} onChange={e => setF({ ...f, description_ar: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none resize-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label><textarea value={f.description_en} onChange={e => setF({ ...f, description_en: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none resize-none" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">رابط داخلي (اختياري)</label><input value={f.internal_link} onChange={e => setF({ ...f, internal_link: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" placeholder="/menu?product=..." /></div>
                <div><label className="block text-sm font-medium mb-1">الترتيب</label><input type="number" value={f.sort_order} onChange={e => setF({ ...f, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_visible} onChange={e => setF({ ...f, is_visible: e.target.checked })} className="rounded" /> مرئي</label>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
                <button onClick={handleSave} disabled={saving || !f.image_url} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
                  {saving && <Loader2 size={14} className="animate-spin" />} حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteDialog isOpen={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} title="حذف البنر" lang="ar" />
    </div>
  );
}
