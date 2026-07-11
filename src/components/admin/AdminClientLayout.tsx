"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminThemeProvider } from '@/components/admin/AdminThemeContext';
import { usePathname } from 'next/navigation';

type LangContextType = {
  lang: 'ar' | 'en';
  toggleLang: () => void;
};

export const AdminLangContext = createContext<LangContextType>({
  lang: 'ar',
  toggleLang: () => {},
});

export function useAdminLang() {
  return useContext(AdminLangContext);
}

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('admin-lang') as 'ar' | 'en' | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage initialization
    if (stored) setLang(stored);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Close sidebar on route change
    setSidebarOpen(false);
  }, [pathname]);

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('admin-lang', newLang);
  };

  if (pathname === '/admin/login') {
    return (
      <AdminThemeProvider>
        <>{children}</>
      </AdminThemeProvider>
    );
  }

  return (
    <AdminThemeProvider>
      <AdminLangContext.Provider value={{ lang, toggleLang }}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" dir="ltr">
          <AdminHeader
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleLang={toggleLang}
          />
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} lang={lang} />

          <main className="lg:ms-64 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </AdminLangContext.Provider>
    </AdminThemeProvider>
  );
}
