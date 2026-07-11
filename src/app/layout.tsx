import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Tajawal, Inter } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-tajawal',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "ماهر كيف | Maher Kaif",
  description: "Digital Menu - Maher Kaif Coffee",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('maher-kaif-lang')?.value;
  const lang = langCookie === 'en' ? 'en' : 'ar';
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning className={`${tajawal.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
