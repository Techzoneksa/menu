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
  title: {
    default: "ماهر كيف | منيو القهوة والحلويات",
    template: "%s | ماهر كيف",
  },
  description: "اكتشف منيو ماهر كيف واستعرض تشكيلة القهوة الساخنة والباردة والحلويات والإضافات والأسعار بسهولة عبر الجوال.",
  metadataBase: new URL("https://maher.jaadsa.com"),
  alternates: {
    canonical: "https://maher.jaadsa.com",
  },
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://maher.jaadsa.com",
    siteName: "ماهر كيف",
    title: "ماهر كيف | منيو القهوة والحلويات",
    description: "اكتشف منيو ماهر كيف واستعرض تشكيلة القهوة الساخنة والباردة والحلويات والإضافات والأسعار بسهولة عبر الجوال.",
    images: [
      {
        url: "/logo.svg",
        width: 600,
        height: 200,
        alt: "ماهر كيف",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ماهر كيف | منيو القهوة والحلويات",
    description: "اكتشف منيو ماهر كيف واستعرض تشكيلة القهوة الساخنة والباردة والحلويات والإضافات والأسعار بسهولة عبر الجوال.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
