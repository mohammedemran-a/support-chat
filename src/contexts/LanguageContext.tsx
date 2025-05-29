
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    chat: 'الدردشة',
    faq: 'الأسئلة الشائعة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    
    // Hero Section
    heroTitle: 'دعم فني ذكي متاح على مدار الساعة',
    heroSubtitle: 'احصل على إجابات فورية لجميع استفساراتك التقنية من خلال مساعدنا الذكي المطور خصيصاً لخدمتك',
    startChat: 'ابدأ المحادثة',
    learnMore: 'اعرف المزيد',
    
    // Features
    featuresTitle: 'لماذا تختار خدمتنا؟',
    feature1Title: 'متاح على مدار الساعة',
    feature1Desc: 'خدمة دعم فني لا تتوقف، متاحة 24/7 للرد على جميع استفساراتك',
    feature2Title: 'ردود ذكية وسريعة',
    feature2Desc: 'تقنية ذكاء اصطناعي متطورة تقدم حلول دقيقة في ثوانٍ معدودة',
    feature3Title: 'دعم متعدد اللغات',
    feature3Desc: 'خدمة باللغتين العربية والإنجليزية مع فهم دقيق للسياق الثقافي',
    
    // Stats
    statsTitle: 'إحصائيات رائعة',
    stat1: 'مستخدم راضٍ',
    stat2: 'استفسار تم حله',
    stat3: 'متوسط وقت الاستجابة',
    stat4: 'معدل رضا العملاء',
    
    // Footer
    footerDesc: 'منصة الدعم الفني الذكية التي تجمع بين التكنولوجيا المتقدمة والخدمة المتميزة',
    quickLinks: 'روابط سريعة',
    contact: 'تواصل معنا',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    addressText: 'الرياض، المملكة العربية السعودية',
    allRights: 'جميع الحقوق محفوظة',
  },
  en: {
    // Navigation
    home: 'Home',
    chat: 'Chat',
    faq: 'FAQ',
    login: 'Login',
    register: 'Sign Up',
    
    // Hero Section
    heroTitle: 'Smart Technical Support 24/7',
    heroSubtitle: 'Get instant answers to all your technical questions with our intelligent assistant designed specifically to serve you',
    startChat: 'Start Chat',
    learnMore: 'Learn More',
    
    // Features
    featuresTitle: 'Why Choose Our Service?',
    feature1Title: 'Available 24/7',
    feature1Desc: 'Non-stop technical support service, available 24/7 to answer all your questions',
    feature2Title: 'Smart & Fast Responses',
    feature2Desc: 'Advanced AI technology provides accurate solutions in seconds',
    feature3Title: 'Multi-language Support',
    feature3Desc: 'Service in both Arabic and English with accurate cultural context understanding',
    
    // Stats
    statsTitle: 'Amazing Statistics',
    stat1: 'Satisfied Users',
    stat2: 'Queries Resolved',
    stat3: 'Average Response Time',
    stat4: 'Customer Satisfaction',
    
    // Footer
    footerDesc: 'The smart technical support platform that combines advanced technology with excellent service',
    quickLinks: 'Quick Links',
    contact: 'Contact Us',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    addressText: 'Riyadh, Saudi Arabia',
    allRights: 'All Rights Reserved',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
