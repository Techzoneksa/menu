"use client";

import { useState, useEffect } from 'react';
import { fetchDashboardStats } from './actions';
import { FolderTree, Package, Eye, EyeOff, Ban, Image, ExternalLink, QrCode } from 'lucide-react';

interface DashboardStats {
  categories: number;
  products: number;
  visibleProducts: number;
  hiddenProducts: number;
  unavailableProducts: number;
  banners: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then(res => {
      if (res.success) setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const cards = [
    { label: 'الفئات', value: stats?.categories || 0, icon: FolderTree, color: 'bg-blue-500' },
    { label: 'المنتجات', value: stats?.products || 0, icon: Package, color: 'bg-green-500' },
    { label: 'المنتجات الظاهرة', value: stats?.visibleProducts || 0, icon: Eye, color: 'bg-emerald-500' },
    { label: 'المنتجات المخفية', value: stats?.hiddenProducts || 0, icon: EyeOff, color: 'bg-yellow-500' },
    { label: 'غير المتوفرة', value: stats?.unavailableProducts || 0, icon: Ban, color: 'bg-red-500' },
    { label: 'البنرات', value: stats?.banners || 0, icon: Image, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-white`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
          <ExternalLink size={16} />
          فتح المنيو
        </a>
        <a href="/admin/qr" className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
          <QrCode size={16} />
          صفحة QR
        </a>
      </div>
    </div>
  );
}
