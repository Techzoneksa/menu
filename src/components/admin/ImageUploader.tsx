"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
  bucket: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_MIME_PREFIX = 'image/';
const BLOCKED_EXTENSIONS = ['svg', 'gif', 'exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'pif', 'vbs', 'js', 'sh', 'php', 'asp', 'aspx', 'jsp'];
const MAX_SIZE = 5 * 1024 * 1024;

function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type) || !file.type.startsWith(ALLOWED_MIME_PREFIX)) {
    return 'نوع الملف غير مدعوم. يُسمح فقط بـ JPG و PNG و WebP.';
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return 'امتداد الملف محظور (SVG / GIF / ملفات تنفيذية غير مسموح بها).';
  }

  if (file.size > MAX_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `الملف كبير جداً (${sizeMB}MB). الحد الأقصى هو 5MB.`;
  }

  if (file.size === 0) {
    return 'الملف فارغ. اختر ملفاً آخر.';
  }

  return null;
}

export function ImageUploader({ bucket, currentUrl, onUpload, onRemove, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${crypto.randomUUID()}.${ext}`;

      setProgress(30);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      setProgress(60);

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

      setProgress(80);

      onUpload(publicUrl);

      if (currentUrl) {
        const oldPath = extractStoragePath(currentUrl, bucket);
        if (oldPath) {
          await supabase.storage.from(bucket).remove([oldPath]);
        }
      }

      setProgress(100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل الرفع. حاول مرة أخرى.';
      setError(message);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}

      {currentUrl ? (
        <div className="relative inline-block">
          <img src={currentUrl} alt="" className="w-24 h-24 object-cover rounded-lg" />
          <button
            type="button"
            onClick={onRemove}
            disabled={uploading}
            className="absolute -top-2 -end-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" style={{ color: '#F26522' }} />
              <span className="text-xs text-gray-500">{progress}%</span>
            </>
          ) : (
            <>
              <Upload size={20} className="opacity-40" />
              <span className="text-xs opacity-40">Upload</span>
            </>
          )}
        </button>
      )}

      {uploading && (
        <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: '#F26522' }}
          />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
