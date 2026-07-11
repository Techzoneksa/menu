"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language } from '@/types/menu';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  toggleLang: () => {},
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Language }) {
  const [lang, setLangState] = useState<Language>(initialLang || 'ar');

  useEffect(() => {
    const stored = localStorage.getItem('maher-kaif-lang') as Language | null;
    if (stored && (stored === 'ar' || stored === 'en')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage initialization
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('maher-kaif-lang', newLang);
    document.cookie = `maher-kaif-lang=${newLang};path=/;max-age=31536000`;
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'en' ? 'ltr' : 'rtl';
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
