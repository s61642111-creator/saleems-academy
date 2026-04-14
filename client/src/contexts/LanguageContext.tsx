import { createContext, useContext, useEffect, useState } from 'react';
import { storageLanguage } from '@/lib/storage';

type Language = 'en' | 'ar';
interface LanguageContextType { language: Language; setLanguage: (l: Language) => void; }

const LanguageContext = createContext<LanguageContextType>({ language: 'en', setLanguage: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(storageLanguage.get);
  const setLanguage = (l: Language) => { setLanguageState(l); storageLanguage.set(l); };
  useEffect(() => {
    document.documentElement.dir  = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() { return useContext(LanguageContext); }