import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminUser = {
  supabase: SupabaseClient;
  userId: string;
};

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/admin/login');
  }

  const { data: isAdmin } = await supabase.rpc('is_admin');

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return { supabase, userId: user.id };
}
