import type { Metadata } from 'next';
import AdminClientLayout from '@/components/admin/AdminClientLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
