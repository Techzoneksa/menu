import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export type AdminUser = {
  supabase: SupabaseClient;
  userId: string;
  displayName: string | null;
  role: string | null;
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

  const { data: profile } = await supabase.rpc('get_admin_profile');

  const displayName = profile && profile.length > 0 ? profile[0].display_name : null;
  const role = profile && profile.length > 0 ? profile[0].role : null;

  return { supabase, userId: user.id, displayName, role };
}
