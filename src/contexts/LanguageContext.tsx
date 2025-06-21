
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface LanguageContextProps {
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null;
  const defaultLanguage = storedLanguage || (navigator.language.startsWith('ar') ? 'ar' : 'en');
  const [language, setLanguage] = useState<"en" | "ar">(defaultLanguage);

  // Fetch translations from database
  const { data: translations = {}, isLoading, error } = useTranslations(language);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    // If translations are still loading or there's an error, return the key as fallback
    if (isLoading || error) {
      console.log('Translations not ready, returning key:', key);
      return key;
    }

    // Return translation from database or fallback to key
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      return key;
    }

    return translation;
  };

  const value: LanguageContextProps = {
    language,
    toggleLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
