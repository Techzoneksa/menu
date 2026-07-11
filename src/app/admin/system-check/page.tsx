"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, XCircle, AlertCircle, Server, Database, HardDrive, User, Globe } from 'lucide-react';

interface CheckItem {
  label: string;
  status: 'ok' | 'error' | 'warning';
  detail: string;
  icon: React.ReactNode;
}

export default function SystemCheckPage() {
  const [results, setResults] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runChecks = async () => {
      const checks: CheckItem[] = [];
      const supabase = createClient();

      try {
        const { error } = await supabase.from('menu_settings').select('id').limit(1);
        if (error) throw error;
        checks.push({ label: 'الاتصال بـ Supabase', status: 'ok', detail: 'متصل', icon: <Server size={18} /> });
      } catch (e: any) {
        checks.push({ label: 'الاتصال بـ Supabase', status: 'error', detail: e.message || 'فشل الاتصال', icon: <Server size={18} /> });
      }

      const tables = ['menu_categories', 'menu_products', 'product_variants', 'addon_groups', 'addon_items', 'product_addon_groups', 'menu_banners', 'menu_settings', 'product_images'];
      let tablesOk = true;
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('id').limit(1);
          if (error) { tablesOk = false; break; }
        } catch {
          tablesOk = false;
          break;
        }
      }
      checks.push({
        label: 'الجداول',
        status: tablesOk ? 'ok' : 'error',
        detail: tablesOk ? `${tables.length} جداول موجودة` : 'بعض الجداول مفقودة - قم بتنفيذ migrations',
        icon: <Database size={18} />
      });

      const countTable = async (table: string) => {
        try {
          const { count } = await supabase.from(table).select('id', { count: 'exact', head: true });
          return count || 0;
        } catch { return -1; }
      };

      const catCount = await countTable('menu_categories');
      checks.push({ label: 'الفئات', status: catCount >= 4 ? 'ok' : catCount >= 0 ? 'warning' : 'error', detail: `${catCount} فئات`, icon: <Database size={18} /> });

      const prodCount = await countTable('menu_products');
      checks.push({ label: 'المنتجات', status: prodCount >= 30 ? 'ok' : prodCount >= 0 ? 'warning' : 'error', detail: `${prodCount} منتج`, icon: <Database size={18} /> });

      const variantCount = await countTable('product_variants');
      checks.push({ label: 'الأحجام', status: variantCount >= 0 ? 'ok' : 'error', detail: `${variantCount} حجم`, icon: <Database size={18} /> });

      const agCount = await countTable('addon_groups');
      checks.push({ label: 'مجموعات الإضافات', status: agCount >= 0 ? 'ok' : 'error', detail: `${agCount} مجموعة`, icon: <Database size={18} /> });

      const aiCount = await countTable('addon_items');
      checks.push({ label: 'عناصر الإضافات', status: aiCount >= 0 ? 'ok' : 'error', detail: `${aiCount} عنصر`, icon: <Database size={18} /> });

      const bannerCount = await countTable('menu_banners');
      checks.push({ label: 'البنرات', status: bannerCount >= 0 ? 'ok' : 'error', detail: `${bannerCount} بنر`, icon: <Database size={18} /> });

      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const required = ['menu-logos', 'menu-products', 'menu-banners'];
        const existing = (buckets || []).map(b => b.id);
        const missing = required.filter(b => !existing.includes(b));
        checks.push({
          label: 'Storage Buckets',
          status: missing.length === 0 ? 'ok' : 'warning',
          detail: missing.length === 0 ? 'جميع ال Buckets موجودة' : `مفقودة: ${missing.join(', ')}`,
          icon: <HardDrive size={18} />
        });
      } catch {
        checks.push({ label: 'Storage Buckets', status: 'warning', detail: 'تعذر التحقق', icon: <HardDrive size={18} /> });
      }

      const { data: { user } } = await supabase.auth.getUser();
      checks.push({
        label: 'المستخدم الإداري',
        status: user ? 'ok' : 'warning',
        detail: user ? `مسجل: ${user.email}` : 'غير مسجل',
        icon: <User size={18} />
      });

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      checks.push({
        label: 'NEXT_PUBLIC_SITE_URL',
        status: siteUrl ? 'ok' : 'warning',
        detail: siteUrl || 'غير محدد - يُستخدم window.location.origin',
        icon: <Globe size={18} />
      });

      setResults(checks);
      setLoading(false);
    };

    runChecks();
  }, []);

  const okCount = results.filter(r => r.status === 'ok').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warnCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold">فحص جاهزية النظام</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System Readiness Check</p>
      </div>

      {!loading && (
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-green-600"><CheckCircle size={16} /> {okCount} جاهز</span>
          {warnCount > 0 && <span className="flex items-center gap-1.5 text-yellow-600"><AlertCircle size={16} /> {warnCount} يحتاج إعداد</span>}
          {errorCount > 0 && <span className="flex items-center gap-1.5 text-red-600"><XCircle size={16} /> {errorCount} خطأ</span>}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                r.status === 'ok' ? 'bg-green-100 text-green-600' : r.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{r.label}</p>
                <p className="text-xs text-gray-500">{r.detail}</p>
              </div>
              <div className="shrink-0">
                {r.status === 'ok' ? <CheckCircle size={18} className="text-green-500" /> : r.status === 'error' ? <XCircle size={18} className="text-red-500" /> : <AlertCircle size={18} className="text-yellow-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
