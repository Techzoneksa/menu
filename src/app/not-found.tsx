import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center space-y-6">
        <p className="text-7xl font-bold text-gray-200 dark:text-gray-800">404</p>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الصفحة غير موجودة</h1>
          <p className="text-gray-500 dark:text-gray-400">Page not found</p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F26522' }}
        >
          العودة للمنيو / Back to Menu
        </Link>
      </div>
    </div>
  );
}
