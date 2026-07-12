"use client";

import { Menu, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { AdminProfile } from './AdminClientLayout';

const roleLabels: Record<string, { ar: string; en: string }> = {
  super_admin: { ar: 'سوبر أدمن', en: 'Super Admin' },
  admin: { ar: 'مدير', en: 'Admin' },
};

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onToggleLang: () => void;
  logoUrl?: string | null;
  cafeName?: string;
  adminProfile?: AdminProfile | null;
  lang?: 'ar' | 'en';
}

export function AdminHeader({ onToggleSidebar, onToggleLang, logoUrl, cafeName, adminProfile, lang = 'ar' }: AdminHeaderProps) {
  const { resolvedTheme, cycleTheme } = useAdminTheme();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const displayName = adminProfile?.display_name || (lang === 'ar' ? 'المدير' : 'Admin');
  const roleKey = adminProfile?.role || 'admin';
  const roleLabel = roleLabels[roleKey]?.[lang] || roleLabels.admin[lang];

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden">
          <Menu size={20} />
        </button>
        <Image src={logoUrl || '/logo.svg'} alt={cafeName || 'Admin'} width={32} height={32} className="h-8 w-auto object-contain hidden sm:block" unoptimized />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-medium">{displayName}</span>
          <span className="text-xs opacity-50">{roleLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onToggleLang} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Toggle Language">
            <Globe size={18} />
          </button>
          <button onClick={cycleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
