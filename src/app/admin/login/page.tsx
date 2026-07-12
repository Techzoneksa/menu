"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';

function getInitialLang(): 'ar' | 'en' {
  if (typeof document === 'undefined') return 'ar';
  const match = document.cookie.match(/maher-kaif-lang=(ar|en)/);
  return match ? (match[1] as 'ar' | 'en') : 'ar';
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lang] = useState<'ar' | 'en'>(getInitialLang);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [cafeName, setCafeName] = useState('ماهر كيف');
  const [lockoutDeadline, setLockoutDeadline] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLocked = lockoutRemaining > 0;

  useEffect(() => {
    const supabase = createClient();
    supabase.from('menu_settings').select('logo_url, cafe_name_ar, cafe_name_en').limit(1).single().then(({ data }) => {
      if (data) {
        setLogoUrl(data.logo_url || null);
        setCafeName(lang === 'ar' ? (data.cafe_name_ar || 'ماهر كيف') : (data.cafe_name_en || 'Maher Kaif'));
      }
    });
  }, [lang]);

  useEffect(() => {
    if (lockoutDeadline <= 0) return;

    const update = () => {
      const left = Math.max(0, lockoutDeadline - Date.now());
      setLockoutRemaining(left);
      return left;
    };

    if (update() <= 0) return;
    const timer = setInterval(() => {
      if (update() <= 0) clearInterval(timer);
    }, 200);
    return () => clearInterval(timer);
  }, [lockoutDeadline]);

  const getDelay = useCallback((attempts: number) => {
    if (attempts < 3) return 0;
    if (attempts < 5) return 2000;
    if (attempts < 8) return 5000;
    return 10000;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        const delay = getDelay(newCount);
        if (delay > 0) setLockoutDeadline(Date.now() + delay);
        setError(lang === 'ar' ? 'تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.' : 'Unable to sign in. Check your email address and password.');
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError(lang === 'ar' ? 'تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.' : 'Unable to sign in. Check your email address and password.');
        setLoading(false);
        return;
      }

      const { data: adminCheck } = await supabase.rpc('is_admin');
      if (!adminCheck) {
        await supabase.auth.signOut();
        setError(lang === 'ar' ? 'ليس لديك صلاحية الوصول إلى لوحة التحكم.' : 'You do not have permission to access the admin panel.');
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
    } catch {
      setError(lang === 'ar' ? 'تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.' : 'Unable to sign in. Check your email address and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--light-background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={cafeName} className="h-14 w-auto mx-auto mb-3 object-contain" />
          ) : (
            <h1 className="text-2xl font-bold" style={{ color: '#F26522' }}>{cafeName}</h1>
          )}
          <p className="text-sm mt-1" style={{ color: 'var(--light-text-secondary)' }}>
            {lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 shadow-sm space-y-4" style={{ backgroundColor: 'var(--light-card)' }}>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLocked || loading}
              className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] disabled:opacity-50"
              style={{ borderColor: 'var(--light-border)' }}
              dir="ltr"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLocked || loading}
                className="w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] pe-10 disabled:opacity-50"
                style={{ borderColor: 'var(--light-border)' }}
                dir="ltr"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-end">
            <Link
              href="/forgot-password"
              className="text-xs transition-colors"
              style={{ color: 'var(--light-text-secondary)' }}
            >
              {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </Link>
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
            {loading && <Loader2 size={18} className="animate-spin" />}
            {isLocked
              ? (lang === 'ar' ? 'يرجى الانتظار...' : 'Please wait...')
              : loading
                ? (lang === 'ar' ? 'جاري الدخول...' : 'Signing in...')
                : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-background)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
