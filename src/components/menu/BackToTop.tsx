"use client";

import { useState, useEffect } from "react";
import { useThemeContext } from "./ThemeContext";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center rounded-full shadow-lg transition-opacity animate-fade-in"
      style={{
        width: '44px',
        height: '44px',
        backgroundColor: 'var(--brand-primary)',
        color: '#fff',
        fontSize: '18px',
      }}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
