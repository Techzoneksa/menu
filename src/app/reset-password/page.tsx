"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';

function getInitialLang(): 'ar' | 'en' {
  if (typeof document === 'undefined') return 'ar';
  const match = document.cookie.match(/maher-kaif-lang=(ar|en)/);
  return match ? (match[1] as 'ar' | 'en') : 'ar';
}

type Status = 'loading' | 'ready' | 'success' | 'error' | 'expired';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [lang] = useState<'ar' | 'en'>(getInitialLang);
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const supabase = createClient();

        const code = searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (exchangeError) {
            setStatus('expired');
            return;
          }
          setStatus('ready');
          return;
        }

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        if (type !== 'recovery' || !accessToken || !refreshToken) {
          if (!cancelled) setStatus('expired');
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (cancelled) return;
        if (sessionError) {
          setStatus('expired');
          return;
        }

        window.history.replaceState({}, '', window.location.pathname);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('expired');
      }
    }

    init();

    return () => { cancelled = true; };
  }, [searchParams]);

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 6) {
      return lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          updateError.message.includes('same password')
            ? (lang === 'ar' ? 'لا يمكن استخدام نفس كلمة المرور القديمة. اختر كلمة مرور جديدة.' : 'Cannot use the same password. Choose a new one.')
            : (lang === 'ar' ? 'حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى.' : 'Error updating password. Please try again.')
        );
        setLoading(false);
        return;
      }

      setStatus('success');
    } catch {
      setError(lang === 'ar' ? 'حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى.' : 'Error updating password. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: '#F26522' }} />
          <p className="text-sm text-gray-500">{lang === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</p>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF2F2' }}>
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-lg font-bold mb-2">
            {lang === 'ar' ? 'الرابط منتهي الصلاحية' : 'Link Expired'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {lang === 'ar'
              ? 'رابط إعادة تعيين كلمة المرور منتهي الصلاحية أو غير صالح. طلب رابط جديد.'
              : 'The password reset link has expired or is invalid. Request a new one.'}
          </p>
          <Link
            href="/forgot-password"
            className="inline-block w-full py-2.5 rounded-xl text-white font-medium text-sm text-center hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F26522' }}
          >
            {lang === 'ar' ? 'طلب رابط جديد' : 'Request New Link'}
          </Link>
          <Link
            href="/admin/login"
            className="block mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ECFDF5' }}>
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-lg font-bold mb-2">
            {lang === 'ar' ? 'تم تغيير كلمة المرور' : 'Password Updated'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {lang === 'ar'
              ? 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
              : 'Your password has been updated. You can now sign in with your new password.'}
          </p>
          <Link
            href="/admin/login"
            className="inline-block w-full py-2.5 rounded-xl text-white font-medium text-sm text-center hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F26522' }}
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#F26522' }}>
            {lang === 'ar' ? 'كلمة مرور جديدة' : 'New Password'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lang === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter your new password'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] pe-10 disabled:opacity-50"
                dir="ltr"
                autoComplete="new-password"
                autoFocus
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

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] pe-10 disabled:opacity-50"
                dir="ltr"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute end-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#F26522' }}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading
              ? (lang === 'ar' ? 'جاري التحديث...' : 'Updating...')
              : (lang === 'ar' ? 'تغيير كلمة المرور' : 'Update Password')
            }
          </button>

          <Link
            href="/admin/login"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
