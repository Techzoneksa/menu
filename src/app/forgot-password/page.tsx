"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

function getInitialLang(): 'ar' | 'en' {
  if (typeof document === 'undefined') return 'ar';
  const match = document.cookie.match(/maher-kaif-lang=(ar|en)/);
  return match ? (match[1] as 'ar' | 'en') : 'ar';
}

function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://maher.jaadsa.com';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang] = useState<'ar' | 'en'>(getInitialLang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const siteUrl = getSiteUrl();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (resetError) {
        setError(
          lang === 'ar'
            ? 'حدث خطأ أثناء إرسال الرسال��. تأكد من صحة البريد الإلكتروني.'
            : 'Error sending email. Please check your email address.'
        );
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError(
        lang === 'ar'
          ? 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.'
          : 'Error sending email. Please try again.'
      );
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ECFDF5' }}>
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-lg font-bold mb-2">
            {lang === 'ar' ? 'تم إرسال الرسالة' : 'Email Sent'}
          </h1>
          <p className="text-sm text-gray-500 mb-2">
            {lang === 'ar'
              ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى:'
              : 'A password reset link has been sent to:'}
          </p>
          <p className="text-sm font-medium mb-6" dir="ltr">{email}</p>
          <p className="text-xs text-gray-400 mb-6">
            {lang === 'ar'
              ? 'لم تصل الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam).'
              : "Didn't receive it? Check your spam folder."}
          </p>
          <Link
            href="/admin/login"
            className="inline-block w-full py-2.5 rounded-xl text-white font-medium text-sm text-center hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F26522' }}
          >
            {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFF8F0' }}>
            <Mail size={32} style={{ color: '#F26522' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#F26522' }}>
            {lang === 'ar' ? 'نسيت كلمة المرور' : 'Forgot Password'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lang === 'ar'
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور.'
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#F26522] disabled:opacity-50"
              dir="ltr"
              autoComplete="email"
              autoFocus
            />
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
              ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
              : (lang === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')
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
