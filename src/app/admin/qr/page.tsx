"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchQRDisplaySettings, saveQRDisplaySettings } from './actions';
import { Download, Copy, Check, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function resolveMenuUrl(settingsDomain: string | null): string {
  let base = '';
  if (settingsDomain) {
    base = settingsDomain.replace(/\/+$/, '');
  } else if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    base = (envUrl || window.location.origin).replace(/\/+$/, '');
  }
  return `${base}`;
}

export default function AdminQRPage() {
  const [menuUrl, setMenuUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#FFFFFF');
  const [textAr, setTextAr] = useState('');
  const [textEn, setTextEn] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQRDisplaySettings().then(res => {
      if (res.success && res.data) {
        setMenuUrl(resolveMenuUrl(res.data.menu_domain || null));
        if (res.data.qr_color) setQrColor(res.data.qr_color);
        if (res.data.qr_bg) setQrBg(res.data.qr_bg);
        if (res.data.qr_text_ar) setTextAr(res.data.qr_text_ar);
        if (res.data.qr_text_en) setTextEn(res.data.qr_text_en);
      } else {
        setMenuUrl(resolveMenuUrl(null));
      }
    });
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveQRDisplaySettings({
      qr_color: qrColor,
      qr_bg: qrBg,
      qr_text_ar: textAr,
      qr_text_en: textEn,
    });
    setSaving(false);
    if (res.success) {
      setToast({ type: 'success', message: 'تم حفظ الإعدادات' });
    } else {
      setToast({ type: 'error', message: res.error || 'حدث خطأ' });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = qrBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const link = document.createElement('a');
      link.download = 'maher-kaif-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleDownloadSVG = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'maher-kaif-qr.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-lg">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">رمز QR للمنيو</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50" style={{ backgroundColor: '#F26522' }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm flex flex-col items-center gap-4">
        <div ref={qrRef} className="p-4 rounded-xl" style={{ backgroundColor: qrBg }}>
          <QRCodeSVG value={menuUrl} size={200} bgColor={qrBg} fgColor={qrColor} level="H" includeMargin={false} />
        </div>
        {(textAr || textEn) && (
          <div className="text-center">
            {textAr && <p className="text-sm font-medium">{textAr}</p>}
            {textEn && <p className="text-xs text-gray-500 mt-0.5">{textEn}</p>}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium mb-2">رابط المنيو</label>
        <div className="flex gap-2">
          <input value={menuUrl} readOnly className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none" dir="ltr" />
          <button onClick={handleCopy} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-medium">الألوان</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">لون الرمز</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
              <input value={qrColor} onChange={e => setQrColor(e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent text-xs outline-none" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">لون الخلفية</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={qrBg} onChange={e => setQrBg(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
              <input value={qrBg} onChange={e => setQrBg(e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent text-xs outline-none" dir="ltr" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-medium">نص أسفل الرمز</h2>
        <div><label className="block text-xs text-gray-500 mb-1">النص بالعربية</label><input value={textAr} onChange={e => setTextAr(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">النص بالإنجليزية</label><input value={textEn} onChange={e => setTextEn(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none" /></div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleDownloadPNG} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <Download size={16} /> تنزيل PNG
        </button>
        <button onClick={handleDownloadSVG} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <Download size={16} /> تنزيل SVG
        </button>
      </div>
    </div>
  );
}
