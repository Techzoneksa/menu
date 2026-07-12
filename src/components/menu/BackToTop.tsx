"use client";

import { useState, useEffect } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed z-40 flex items-center justify-center rounded-full shadow-lg animate-fade-in"
      style={{
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: 'var(--brand-primary)',
        color: '#fff',
        fontSize: '16px',
      }}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
