"use client";

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutEnd, setLockoutEnd] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getDelay = useCallback((attempts: number) => {
    if (attempts < 3) return 0;
    if (attempts < 5) return 2000;
    if (attempts < 8) return 5000;
    return 10000;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now < lockoutEnd) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const newCount = attemptCount + 1;
      setAttemptCount(newCount);
      const delay = getDelay(newCount);
      if (delay > 0) {
        setLockoutEnd(Date.now() + delay);
      }
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
      return;
    }

    setAttemptCount(0);
    const next = searchParams.get('next');
    if (next && next.startsWith('/admin') && !next.includes('://')) {
      router.push(next);
    } else {
      router.push('/admin');
    }
    router.refresh();
  };

  // eslint-disable-next-line react-hooks/purity
  const isLocked = Date.now() < lockoutEnd;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ماهر كيف</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLocked}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] disabled:opacity-50"
              dir="ltr"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLocked}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] pe-10 disabled:opacity-50"
                dir="ltr"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 opacity-50"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-2.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#F26522' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isLocked ? 'يرجى الانتظار...' : loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          أنشئ حساب المدير من Supabase Dashboard
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
