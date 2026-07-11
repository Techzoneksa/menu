"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchAddons, saveAddonGroup, deleteAddonGroup, saveAddonItem, deleteAddonItem, saveAddonLinks } from './actions';
import type { AddonGroup, AddonItem } from '@/types/menu';
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { DeleteDialog } from '@/components/admin/DeleteDialog';

type ProductRef = { id: string; name_ar: string; name_en: string };

export default function AdminAddonsPage() {
  const [groups, setGroups] = useState<(AddonGroup & { items: AddonItem[] })[]>([]);
  const [products, setProducts] = useState<ProductRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AddonGroup | null>(null);
  const [gForm, setGForm] = useState({ name_ar: '', name_en: '', sort_order: 0, is_visible: true });
  const [saving, setSaving] = useState(false);

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AddonItem | null>(null);
  const [itemGroupId, setItemGroupId] = useState('');
  const [iForm, setIForm] = useState({ name_ar: '', name_en: '', price: '', sort_order: 0, is_visible: true });

  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkGroupId, setLinkGroupId] = useState('');
  const [linkedProductIds, setLinkedProductIds] = useState<string[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'group' | 'item'; id: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetchAddons();
      if (res.success) {
        setGroups(res.data.groups as (AddonGroup & { items: AddonItem[] })[]);
        setProducts(res.data.products as ProductRef[]);
      }
    } catch {
      setError('Failed to load addons');
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Server action state updates
  useEffect(() => { loadData(); }, [loadData]);

  const resetGroupForm = () => { setGForm({ name_ar: '', name_en: '', sort_order: 0, is_visible: true }); setEditingGroup(null); };
  const resetItemForm = () => { setIForm({ name_ar: '', name_en: '', price: '', sort_order: 0, is_visible: true }); setEditingItem(null); };

  const handleGroupSave = async () => {
    setSaving(true);
    const res = await saveAddonGroup({ id: editingGroup?.id, ...gForm });
    setSaving(false);
    if (res.success) { setShowGroupForm(false); resetGroupForm(); loadData(); }
  };

  const handleGroupDelete = async () => {
    if (!deleteTarget || deleteTarget.type !== 'group') return;
    await deleteAddonGroup(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  };

  const openItemForm = (groupId: string, item?: AddonItem) => {
    setItemGroupId(groupId);
    if (item) { setEditingItem(item); setIForm({ name_ar: item.name_ar, name_en: item.name_en, price: item.price.toString(), sort_order: item.sort_order, is_visible: item.is_visible }); }
    else { resetItemForm(); }
    setShowItemForm(true);
  };

  const handleItemSave = async () => {
    setSaving(true);
    const res = await saveAddonItem({
      id: editingItem?.id, addon_group_id: itemGroupId,
      name_ar: iForm.name_ar, name_en: iForm.name_en,
      price: parseFloat(iForm.price), sort_order: iForm.sort_order, is_visible: iForm.is_visible,
    });
    setSaving(false);
    if (res.success) { setShowItemForm(false); resetItemForm(); loadData(); }
  };

  const handleItemDelete = async () => {
    if (!deleteTarget || deleteTarget.type !== 'item') return;
    await deleteAddonItem(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  };

  const openLinkForm = async (groupId: string) => {
    setLinkGroupId(groupId);
    setLinkedProductIds([]);
    setShowLinkForm(true);
  };

  const handleLinkSave = async () => {
    setSaving(true);
    await saveAddonLinks(linkGroupId, linkedProductIds);
    setSaving(false);
    setShowLinkForm(false);
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
        <h1 className="text-xl font-bold">إدارة الإضافات</h1>
        <button onClick={() => { resetGroupForm(); setShowGroupForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: '#F26522' }}>
          <Plus size={16} /> إضافة مجموعة
        </button>
      </div>

      <div className="space-y-3">
        {groups.map(group => (
          <div key={group.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <button onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)} className="p-1">
                {expandedGroup === group.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{group.name_ar}</p>
                <p className="text-xs text-gray-500">{group.name_en} • {group.items?.length || 0} عناصر</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openLinkForm(group.id)} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700">ربط منتجات</button>
                <button onClick={() => { setEditingGroup(group); setGForm({ name_ar: group.name_ar, name_en: group.name_en, sort_order: group.sort_order, is_visible: group.is_visible }); setShowGroupForm(true); }} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Pencil size={16} /></button>
                <button onClick={() => setDeleteTarget({ type: 'group', id: group.id })} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>

            {expandedGroup === group.id && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-2">
                {group.items?.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex-1">
                      <p className="text-sm">{item.name_ar}</p>
                      <p className="text-xs text-gray-500">{item.name_en}</p>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#F26522' }}>+{item.price} ر.س</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openItemForm(group.id, item)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget({ type: 'item', id: item.id })} className="p-1 rounded hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => openItemForm(group.id)} className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors flex items-center justify-center gap-1">
                  <Plus size={14} /> إضافة عنصر
                </button>
              </div>
            )}
          </div>
        ))}
        {groups.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">لا توجد مجموعات إضافات</p>}
      </div>

      {showGroupForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowGroupForm(false); resetGroupForm(); }} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="font-bold text-lg mb-4">{editingGroup ? 'تعديل المجموعة' : 'إضافة مجموعة'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">الاسم بالعربية *</label><input value={gForm.name_ar} onChange={e => setGForm({ ...gForm, name_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">الاسم بالإنجليزية *</label><input value={gForm.name_en} onChange={e => setGForm({ ...gForm, name_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">الترتيب</label><input type="number" value={gForm.sort_order} onChange={e => setGForm({ ...gForm, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={gForm.is_visible} onChange={e => setGForm({ ...gForm, is_visible: e.target.checked })} className="rounded" /> مرئي</label>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => { setShowGroupForm(false); resetGroupForm(); }} className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
              <button onClick={handleGroupSave} disabled={saving || !gForm.name_ar || !gForm.name_en} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
                {saving && <Loader2 size={14} className="animate-spin" />} حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {showItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowItemForm(false); resetItemForm(); }} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="font-bold text-lg mb-4">{editingItem ? 'تعديل العنصر' : 'إضافة عنصر'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">الاسم بالعربية *</label><input value={iForm.name_ar} onChange={e => setIForm({ ...iForm, name_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">الاسم بالإنجليزية *</label><input value={iForm.name_en} onChange={e => setIForm({ ...iForm, name_en: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">السعر الإضافي *</label><input type="number" step="0.01" value={iForm.price} onChange={e => setIForm({ ...iForm, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">الترتيب</label><input type="number" value={iForm.sort_order} onChange={e => setIForm({ ...iForm, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={iForm.is_visible} onChange={e => setIForm({ ...iForm, is_visible: e.target.checked })} className="rounded" /> مرئي</label>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => { setShowItemForm(false); resetItemForm(); }} className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
              <button onClick={handleItemSave} disabled={saving || !iForm.name_ar || !iForm.name_en || !iForm.price} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
                {saving && <Loader2 size={14} className="animate-spin" />} حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {showLinkForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLinkForm(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="font-bold text-lg mb-4">ربط المنتجات بالمجموعة</h2>
            <div className="space-y-1">
              {products.map(p => (
                <label key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                  <input type="checkbox" checked={linkedProductIds.includes(p.id)} onChange={() => setLinkedProductIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className="rounded" />
                  <span className="text-sm">{p.name_ar}</span>
                  <span className="text-xs text-gray-500">{p.name_en}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setShowLinkForm(false)} className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">إلغاء</button>
              <button onClick={handleLinkSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
                {saving && <Loader2 size={14} className="animate-spin" />} حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteDialog
        isOpen={!!deleteTarget}
        onConfirm={deleteTarget?.type === 'group' ? handleGroupDelete : handleItemDelete}
        onCancel={() => setDeleteTarget(null)}
        title={deleteTarget?.type === 'group' ? 'حذف المجموعة' : 'حذف العنصر'}
        lang="ar"
      />
    </div>
  );
}
