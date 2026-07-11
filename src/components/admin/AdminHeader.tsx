"use client";

import { Menu, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { useAdminTheme } from './AdminThemeContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onToggleLang: () => void;
}

export function AdminHeader({ onToggleSidebar, onToggleLang }: AdminHeaderProps) {
  const { resolvedTheme, cycleTheme } = useAdminTheme();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden">
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-bold hidden sm:block">لوحة التحكم | Admin</h1>
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
    </header>
  );
}
