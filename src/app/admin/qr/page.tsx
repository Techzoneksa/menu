"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchQRSettings } from './actions';
import { Download, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function resolveMenuUrl(settingsDomain: string | null): string {
  let base = '';
  if (settingsDomain) {
    base = settingsDomain.replace(/\/+$/, '');
  } else if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    base = (envUrl || window.location.origin).replace(/\/+$/, '');
  }
  return `${base}/menu`;
}

export default function AdminQRPage() {
  const [menuUrl, setMenuUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#FFFFFF');
  const [textAr, setTextAr] = useState('امسح الرمز لمشاهدة المنيو');
  const [textEn, setTextEn] = useState('Scan to View the Menu');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQRSettings().then(res => {
      if (res.success) {
        setMenuUrl(resolveMenuUrl(res.data?.menu_domain || null));
      } else {
        setMenuUrl(resolveMenuUrl(null));
      }
    });
  }, []);

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
      ctx!.fillStyle = qrBg;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(img, 0, 0);
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
      <h1 className="text-xl font-bold">رمز QR للمنيو</h1>
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
