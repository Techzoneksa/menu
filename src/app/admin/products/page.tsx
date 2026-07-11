"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, saveProduct, deleteProduct, toggleProductField, duplicateProduct } from './actions';
import type { MenuCategory, MenuProduct, AddonGroup } from '@/types/menu';
import { Plus, Pencil, Trash2, Eye, EyeOff, Copy, Search, Loader2, GripVertical } from 'lucide-react';
import { normalizeSearchText } from '@/lib/search';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { ImageUploader } from '@/components/admin/ImageUploader';

type VariantForm = { name_ar: string; name_en: string; price: string; calories: string; sort_order: number; is_visible: boolean };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVisible, setFilterVisible] = useState('all');

  const [f, setF] = useState({
    name_ar: '', name_en: '', slug: '', category_id: '', description_ar: '', description_en: '',
    price: '', calories: '', image_url: null as string | null, badge_ar: '', badge_en: '',
    is_available: true, is_visible: true, sort_order: 0,
  });

  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [selectedAddonGroupIds, setSelectedAddonGroupIds] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    const res = await fetchProducts();
    if (res.success) {
      setProducts(res.data.products as MenuProduct[]);
      setCategories(res.data.categories as MenuCategory[]);
      setAddonGroups(res.data.addonGroups as AddonGroup[]);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Server action state updates
  useEffect(() => { loadData(); }, [loadData]);

  const filteredProducts = products.filter(p => {
    if (search) {
      const q = normalizeSearchText(search);
      if (!normalizeSearchText(p.name_ar).includes(q) && !normalizeSearchText(p.name_en).includes(q)) return false;
    }
    if (filterCategory !== 'all' && p.category_id !== filterCategory) return false;
    if (filterVisible === 'visible' && !p.is_visible) return false;
    if (filterVisible === 'hidden' && p.is_visible) return false;
    return true;
  });

  const resetForm = () => {
    setF({ name_ar: '', name_en: '', slug: '', category_id: '', description_ar: '', description_en: '', price: '', calories: '', image_url: null, badge_ar: '', badge_en: '', is_available: true, is_visible: true, sort_order: 0 });
    setVariants([]);
    setSelectedAddonGroupIds([]);
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (p: MenuProduct) => {
    setEditing(p);
    setF({
      name_ar: p.name_ar, name_en: p.name_en, slug: p.slug, category_id: p.category_id,
      description_ar: p.description_ar || '', description_en: p.description_en || '',
      price: p.price?.toString() || '', calories: p.calories?.toString() || '', image_url: p.image_url,
      badge_ar: p.badge_ar || '', badge_en: p.badge_en || '', is_available: p.is_available, is_visible: p.is_visible, sort_order: p.sort_order,
    });
    setVariants((p.variants || []).map(v => ({
      name_ar: v.name_ar, name_en: v.name_en, price: v.price.toString(), calories: v.calories?.toString() || '', sort_order: v.sort_order, is_visible: v.is_visible,
    })));
    setSelectedAddonGroupIds((p.addon_groups || []).map(ag => ag.id));
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveProduct({
      id: editing?.id,
      name_ar: f.name_ar, name_en: f.name_en, slug: f.slug, category_id: f.category_id,
      description_ar: f.description_ar || null, description_en: f.description_en || null,
      price: f.price ? parseFloat(f.price) : null, calories: f.calories ? parseInt(f.calories) : null,
      image_url: f.image_url, badge_ar: f.badge_ar || null, badge_en: f.badge_en || null,
      is_available: f.is_available, is_visible: f.is_visible, sort_order: f.sort_order,
      variants: variants.map(v => ({
        name_ar: v.name_ar, name_en: v.name_en,
        price: parseFloat(v.price), calories: v.calories ? parseInt(v.calories) : null,
        sort_order: v.sort_order, is_visible: v.is_visible,
      })),
      addonGroupIds: selectedAddonGroupIds,
    });
    setSaving(false);
    if (res.success) {
      setShowForm(false);
      resetForm();
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteProduct(deleteTarget.id);
    if (res.success) { setDeleteTarget(null); loadData(); }
  };

  const handleCopy = async (p: MenuProduct) => {
    await duplicateProduct(p.id);
    loadData();
  };

  const toggleField = async (p: MenuProduct, field: 'is_visible' | 'is_available') => {
    await toggleProductField(p.id, field, !p[field]);
    loadData();
  };

  const addVariant = () => {
    setVariants([...variants, { name_ar: '', name_en: '', price: '', calories: '', sort_order: variants.length, is_visible: true }]);
  };

  const updateVariant = (idx: number, field: keyof VariantForm, value: string | boolean) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: value };
    setVariants(updated);
  };

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const toggleAddonGroup = (agId: string) => {
    setSelectedAddonGroupIds(prev => prev.includes(agId) ? prev.filter(id => id !== agId) : [...prev, agId]);
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name_ar : '';
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold">إدارة المنتجات</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: '#F26522' }}>
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="w-full ps-9 pe-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
          <option value="all">جميع الفئات</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
        </select>
        <select value={filterVisible} onChange={e => setFilterVisible(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
          <option value="all">الكل</option>
          <option value="visible">ظاهر</option>
          <option value="hidden">مخفى</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <GripVertical size={16} className="opacity-30 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{p.name_ar}</p>
              <p className="text-xs text-gray-500">{p.name_en}</p>
              <div className="flex gap-3 mt-1">
                {p.price !== null && <span className="text-xs" style={{ color: '#F26522' }}>{p.price} ر.س</span>}
                {p.calories !== null && <span className="text-xs text-gray-400">{p.calories} سعرة</span>}
                <span className="text-xs text-gray-400">{getCategoryName(p.category_id)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => toggleField(p, 'is_visible')} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                {p.is_visible ? <Eye size={16} /> : <EyeOff size={16} className="opacity-40" />}
              </button>
              <button onClick={() => toggleField(p, 'is_available')} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-bold ${!p.is_available ? 'text-red-500' : ''}`}>
                {p.is_available ? 'م' : 'غ'}
              </button>
              <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Pencil size={16} /></button>
              <button onClick={() => handleCopy(p)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Copy size={16} /></button>
              <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowForm(false); resetForm(); }} />
          <div className="relative min-h-screen flex items-start justify-center p-4 pt-8">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-xl">
              <h2 className="font-bold text-lg mb-4">{editing ? 'تعديل المنتج' : 'إضافة منتج'}</h2>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pe-2">
                <div>
                  <label className="block text-sm font-medium mb-1">الفئة *</label>
                  <select value={f.category_id} onChange={e => setF({ ...f, category_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none">
                    <option value="">اختر الفئة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar} - {c.name_en}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">الاسم بالعربية *</label><input value={f.name_ar} onChange={e => setF({ ...f, name_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">الاسم بالإنجليزية *</label><input value={f.name_en} onChange={e => setF({ ...f, name_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Slug *</label><input value={f.slug} onChange={e => setF({ ...f, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" /></div>
                <div><label className="block text-sm font-medium mb-1">الوصف بالعربية</label><textarea value={f.description_ar} onChange={e => setF({ ...f, description_ar: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none resize-none" /></div>
                <div><label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label><textarea value={f.description_en} onChange={e => setF({ ...f, description_en: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">السعر</label><input type="number" step="0.01" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" /></div>
                  <div><label className="block text-sm font-medium mb-1">السعرات الحرارية</label><input type="number" value={f.calories} onChange={e => setF({ ...f, calories: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">الشارة بالعربية</label><input value={f.badge_ar} onChange={e => setF({ ...f, badge_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">الشارة بالإنجليزية</label><input value={f.badge_en} onChange={e => setF({ ...f, badge_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">الترتيب</label><input type="number" value={f.sort_order} onChange={e => setF({ ...f, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_visible} onChange={e => setF({ ...f, is_visible: e.target.checked })} className="rounded" /> مرئي</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_available} onChange={e => setF({ ...f, is_available: e.target.checked })} className="rounded" /> متوفر</label>
                </div>
                <ImageUploader bucket="menu-products" currentUrl={f.image_url} onUpload={(url) => setF({ ...f, image_url: url })} onRemove={() => setF({ ...f, image_url: null })} label="الصورة الرئيسية" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">الأحجام</label>
                    <button onClick={addVariant} className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"><Plus size={12} /> إضافة حجم</button>
                  </div>
                  {variants.map((v, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-2 space-y-2">
                      <div className="flex gap-2">
                        <input value={v.name_ar} onChange={e => updateVariant(i, 'name_ar', e.target.value)} placeholder="الاسم بالعربية" className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent text-xs outline-none" />
                        <input value={v.name_en} onChange={e => updateVariant(i, 'name_en', e.target.value)} placeholder="Name" className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent text-xs outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <input type="number" step="0.01" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} placeholder="السعر" className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent text-xs outline-none" dir="ltr" />
                        <input type="number" value={v.calories} onChange={e => updateVariant(i, 'calories', e.target.value)} placeholder="السعرات" className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent text-xs outline-none" dir="ltr" />
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={v.is_visible} onChange={e => updateVariant(i, 'is_visible', e.target.checked)} className="rounded" /> ظاهر</label>
                        <button onClick={() => removeVariant(i)} className="text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {addonGroups.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">مجموعات الإضافات</label>
                    <div className="space-y-1">
                      {addonGroups.map(ag => (
                        <label key={ag.id} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <input type="checkbox" checked={selectedAddonGroupIds.includes(ag.id)} onChange={() => toggleAddonGroup(ag.id)} className="rounded" />
                          {ag.name_ar} - {ag.name_en}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
                <button onClick={handleSave} disabled={saving || !f.name_ar || !f.name_en || !f.slug || !f.category_id} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteDialog isOpen={!!deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} title="حذف المنتج" lang="ar" />
    </div>
  );
}
