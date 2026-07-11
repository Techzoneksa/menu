"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchCategories, saveCategory, deleteCategory, toggleCategoryVisibility, swapCategorySortOrder } from './actions';
import type { MenuCategory } from '@/types/menu';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Loader2 } from 'lucide-react';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { ImageUploader } from '@/components/admin/ImageUploader';

const iconOptions = ['Coffee', 'CupSoda', 'CoffeePot', 'Cake'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIcon, setFormIcon] = useState<string | null>(null);
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formIsVisible, setFormIsVisible] = useState(true);

  const loadCategories = useCallback(async () => {
    const res = await fetchCategories();
    if (res.success) {
      setCategories(res.data as MenuCategory[]);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('admin-lang') as 'ar' | 'en' | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage and server action state updates
    if (stored) setLang(stored);
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setFormNameAr('');
    setFormNameEn('');
    setFormSlug('');
    setFormIcon(null);
    setFormImageUrl(null);
    setFormSortOrder(0);
    setFormIsVisible(true);
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (cat: MenuCategory) => {
    setEditing(cat);
    setFormNameAr(cat.name_ar);
    setFormNameEn(cat.name_en);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon);
    setFormImageUrl(cat.image_url);
    setFormSortOrder(cat.sort_order);
    setFormIsVisible(cat.is_visible);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveCategory({
      id: editing?.id,
      name_ar: formNameAr,
      name_en: formNameEn,
      slug: formSlug,
      icon: formIcon,
      image_url: formImageUrl,
      sort_order: formSortOrder,
      is_visible: formIsVisible,
    });
    setSaving(false);
    if (res.success) {
      setShowForm(false);
      resetForm();
      loadCategories();
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    const res = await deleteCategory(deleteTarget.id);
    if (res.success) {
      setDeleteTarget(null);
      setDeleteError(null);
      loadCategories();
    } else {
      setDeleteError(res.error);
    }
  };

  const handleToggleVisibility = async (cat: MenuCategory) => {
    await toggleCategoryVisibility(cat.id, !cat.is_visible);
    loadCategories();
  };

  const moveCategory = async (cat: MenuCategory, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? cat.sort_order - 1 : cat.sort_order + 1;
    const otherCat = categories.find(c => c.sort_order === newOrder && c.id !== cat.id);
    if (otherCat) {
      await swapCategorySortOrder(cat.id, otherCat.id);
      loadCategories();
    }
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
        <p className="text-red-500 mb-2">{lang === 'ar' ? 'حدث خطأ' : 'Error occurred'}</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button onClick={loadCategories} className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: '#F26522', color: 'white' }}>
          {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">إدارة الفئات</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: '#F26522' }}>
          <Plus size={16} />
          إضافة فئة
        </button>
      </div>

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <GripVertical size={16} className="opacity-30 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{cat.name_ar}</p>
              <p className="text-xs text-gray-500 truncate">{cat.name_en}</p>
              <p className="text-xs text-gray-400">/{cat.slug}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => moveCategory(cat, 'up')} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">↑</button>
              <button onClick={() => moveCategory(cat, 'down')} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">↓</button>
              <button onClick={() => handleToggleVisibility(cat)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                {cat.is_visible ? <Eye size={16} /> : <EyeOff size={16} className="opacity-40" />}
              </button>
              <button onClick={() => openEdit(cat)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil size={16} />
              </button>
              <button onClick={() => { setDeleteTarget(cat); setDeleteError(null); }} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">لا توجد فئات</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="font-bold text-lg mb-4">{editing ? 'تعديل الفئة' : 'إضافة فئة'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم بالعربية *</label>
                <input value={formNameAr} onChange={e => setFormNameAr(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الاسم بالإنجليزية *</label>
                <input value={formNameEn} onChange={e => setFormNameEn(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input value={formSlug} onChange={e => setFormSlug(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522]" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الأيقونة</label>
                <div className="flex gap-2">
                  {iconOptions.map(icon => (
                    <button key={icon} type="button" onClick={() => setFormIcon(formIcon === icon ? null : icon)} className={`px-3 py-1.5 rounded-lg text-xs border ${formIcon === icon ? 'border-[#F26522] bg-[#F26522]/10' : 'border-gray-200 dark:border-gray-600'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الترتيب</label>
                <input type="number" value={formSortOrder} onChange={e => setFormSortOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522]" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formIsVisible} onChange={e => setFormIsVisible(e.target.checked)} className="rounded" />
                <label className="text-sm">مرئي</label>
              </div>
              <ImageUploader bucket="menu-products" currentUrl={formImageUrl} onUpload={setFormImageUrl} onRemove={() => setFormImageUrl(null)} label="صورة الفئة (اختياري)" />
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
              <button onClick={handleSave} disabled={saving || !formNameAr || !formNameEn || !formSlug} className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-white flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteDialog isOpen={!!deleteTarget} onConfirm={handleDelete} onCancel={() => { setDeleteTarget(null); setDeleteError(null); }} title="حذف الفئة" lang={lang} error={deleteError} />
    </div>
  );
}
