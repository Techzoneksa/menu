"use client";

import { LayoutDashboard, FolderTree, Package, Puzzle, Settings, QrCode, ExternalLink, X, Activity, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  logoUrl?: string | null;
  cafeName?: string;
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard' },
  { href: '/admin/categories', icon: FolderTree, labelAr: 'الفئات', labelEn: 'Categories' },
  { href: '/admin/products', icon: Package, labelAr: 'المنتجات', labelEn: 'Products' },
  { href: '/admin/addons', icon: Puzzle, labelAr: 'الإضافات', labelEn: 'Add-ons' },
  { href: '/admin/banners', icon: ImageIcon, labelAr: 'البنرات', labelEn: 'Banners' },
  { href: '/admin/settings', icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings' },
  { href: '/admin/qr', icon: QrCode, labelAr: 'رمز QR', labelEn: 'QR Code' },
  { href: '/admin/system-check', icon: Activity, labelAr: 'فحص النظام', labelEn: 'System Check' },
];

export function AdminSidebar({ isOpen, onClose, lang, logoUrl, cafeName }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      
      <aside
        className={`fixed top-0 start-0 h-full w-64 z-50 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 flex flex-col transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : lang === 'ar' ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Image src={logoUrl || '/logo.svg'} alt={cafeName || 'Admin'} width={32} height={32} className="h-8 w-auto object-contain" unoptimized />
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden">
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const label = lang === 'ar' ? item.labelAr : item.labelEn;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon size={18} className="opacity-60" />
                {label}
              </a>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ExternalLink size={18} className="opacity-60" />
            {lang === 'ar' ? 'فتح المنيو' : 'Open Menu'}
          </a>
        </div>
      </aside>
    </>
  );
}
