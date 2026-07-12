"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 end-6 z-40 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 animate-fade-in safe-bottom"
      style={{
        backgroundColor: '#008CA3',
        color: '#FFFFFF',
      }}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}
