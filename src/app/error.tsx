"use client";

import { useEffect, useState } from 'react';

export default function MenuError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const stored = document.cookie.match(/maher-kaif-lang=(ar|en)/);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe cookie reading
    if (stored) setLang(stored[1] as 'ar' | 'en');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--light-background)' }}>
      <div className="text-center">
        <p className="text-red-500 font-medium mb-2">
          {lang === 'ar' ? 'حدث خطأ' : 'An error occurred'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: '#F26522' }}
        >
          {lang === 'ar' ? 'إعادة المحاولة' : 'Try again'}
        </button>
      </div>
    </div>
  );
}
