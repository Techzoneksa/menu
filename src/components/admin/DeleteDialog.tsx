"use client";

interface DeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  lang: 'ar' | 'en';
  error?: string | null;
}

export function DeleteDialog({ isOpen, onConfirm, onCancel, title, lang, error }: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {lang === 'ar' ? 'هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete? This action cannot be undone.'}
        </p>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">
            {lang === 'ar' ? 'حذف' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
