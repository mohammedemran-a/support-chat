
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface LanguageContextProps {
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  t: (key: string) => string;
  isLoading: boolean;
}

// Fallback translations to prevent showing keys while loading
const fallbackTranslations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    chat: 'Chat',
    faq: 'FAQ',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loading: 'Loading...',
    welcome: 'Welcome',
    searchFAQ: 'Search FAQ...',
    noResults: 'No results found',
    faqDescription: 'Find answers to frequently asked questions'
  },
  ar: {
    home: 'الرئيسية',
    chat: 'الدردشة',
    faq: 'الأسئلة الشائعة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    loading: 'جاري التحميل...',
    welcome: 'مرحباً',
    searchFAQ: 'البحث في الأسئلة الشائعة...',
    noResults: 'لا توجد نتائج',
    faqDescription: 'ابحث عن إجابات للأسئلة الشائعة'
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null;
  const defaultLanguage = storedLanguage || (navigator.language.startsWith('ar') ? 'ar' : 'en');
  const [language, setLanguage] = useState<"en" | "ar">(defaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch translations from database
  const { data: translations = {}, isLoading, error } = useTranslations(language);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    
    // Mark as initialized after first load
    if (!isLoading && !isInitialized) {
      setIsInitialized(true);
    }
  }, [language, isLoading, isInitialized]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    // Use database translations if available and loaded
    if (!isLoading && !error && translations[key]) {
      return translations[key];
    }

    // Use fallback translations while loading or if database translation not found
    const fallback = fallbackTranslations[language]?.[key];
    if (fallback) {
      return fallback;
    }

    // If no fallback exists, warn and return key
    if (isInitialized) {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
    }
    
    return key;
  };

  const value: LanguageContextProps = {
    language,
    toggleLanguage,
    t,
    isLoading: isLoading && !isInitialized,
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
