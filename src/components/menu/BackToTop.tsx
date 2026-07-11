"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 end-6 z-40 w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
