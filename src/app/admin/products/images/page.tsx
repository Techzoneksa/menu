"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProductImages, saveProductImage, deleteProductImage, toggleProductImageVisibility, reorderProductImages } from '../images-actions';
import type { ProductImage } from '@/types/menu';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Eye, EyeOff, ChevronUp, ChevronDown, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProductImagesPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id') || '';

  const [images, setImages] = useState<ProductImage[]>([]);
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadImages = useCallback(async () => {
    if (!productId) { setError('product_id is required'); setLoading(false); return; }
    const res = await fetchProductImages(productId);
    if (res.success) {
      setImages(res.data as ProductImage[]);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    const supabase = createClient();
    supabase.from('menu_products').select('name_ar, name_en').eq('id', productId).single().then(({ data }) => {
      if (data) setProductName(`${data.name_ar} - ${data.name_en}`);
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Server action state updates
    loadImages();
  }, [productId, loadImages]);

  const handleUpload = async (url: string) => {
    const res = await saveProductImage({
      product_id: productId,
      image_url: url,
      sort_order: images.length,
      is_visible: true,
    });
    if (res.success) {
      showToast('success', 'تم رفع الصورة بنجاح');
      loadImages();
    } else {
      showToast('error', res.error);
    }
  };

  const handleUpdateAlt = async (img: ProductImage, field: 'alt_ar' | 'alt_en', value: string) => {
    const res = await saveProductImage({ id: img.id, product_id: img.product_id, image_url: img.image_url, [field]: value || undefined, alt_ar: img.alt_ar ?? undefined, alt_en: img.alt_en ?? undefined });
    if (res.success) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, [field]: value } : i));
      showToast('success', 'تم تحديث النص البديل');
    } else {
      showToast('error', res.error);
    }
  };

  const handleToggleVisibility = async (img: ProductImage) => {
    const newVisible = !img.is_visible;
    const res = await toggleProductImageVisibility(img.id, newVisible);
    if (res.success) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, is_visible: newVisible } : i));
      showToast('success', newVisible ? 'تم إظهار الصورة' : 'تم إخفاء الصورة');
    } else {
      showToast('error', res.error);
    }
  };

  const handleDelete = async (img: ProductImage) => {
    const res = await deleteProductImage(img.id);
    if (res.success) {
      showToast('success', 'تم حذف الصورة');
      loadImages();
    } else {
      showToast('error', res.error);
    }
  };

  const handleReorder = async (img: ProductImage, direction: 'up' | 'down') => {
    const currentIdx = images.findIndex(i => i.id === img.id);
    if (direction === 'up' && currentIdx === 0) return;
    if (direction === 'down' && currentIdx === images.length - 1) return;

    const swappedIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    const newImages = [...images];
    [newImages[currentIdx], newImages[swappedIdx]] = [newImages[swappedIdx], newImages[currentIdx]];

    setImages(newImages);

    const res = await reorderProductImages(newImages.map(i => i.id));
    if (res.success) {
      showToast('success', 'تم تغيير الترتيب');
    } else {
      showToast('error', res.error);
      loadImages();
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
        <p className="text-red-500 mb-2">حدث خطأ</p>
        <p className="text-sm text-gray-500">{error}</p>
        <Link href="/admin/products" className="mt-4 inline-block px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: '#F26522' }}>العودة</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 end-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin/products" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">إدارة صور المنتج</h1>
          <p className="text-sm text-gray-500">{productName}</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, idx) => (
            <div key={img.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <Image src={img.image_url} alt={img.alt_ar || ''} width={96} height={96} className="w-24 h-24 object-cover rounded-lg" unoptimized />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">النص البديل بالعربية</label>
                    <input
                      type="text"
                      defaultValue={img.alt_ar || ''}
                      onBlur={(e) => handleUpdateAlt(img, 'alt_ar', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none"
                      placeholder="وصف الصورة بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Alt Text (English)</label>
                    <input
                      type="text"
                      defaultValue={img.alt_en || ''}
                      onBlur={(e) => handleUpdateAlt(img, 'alt_en', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none"
                      placeholder="Image description in English"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleReorder(img, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleReorder(img, 'down')}
                    disabled={idx === images.length - 1}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(img)}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {img.is_visible ? <Eye size={16} /> : <EyeOff size={16} className="opacity-40" />}
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          لا توجد صور بعد
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold mb-4">إضافة صورة جديدة</h2>
        <ImageUploader
          bucket="menu-products"
          currentUrl={null}
          onUpload={handleUpload}
          onRemove={() => {}}
        />
      </div>
    </div>
  );
}
