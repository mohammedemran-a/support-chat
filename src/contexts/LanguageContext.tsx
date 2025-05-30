
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextProps {
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations = {
  ar: {
    heroTitle: 'نحن هنا لدعمك',
    heroSubtitle: 'احصل على المساعدة التي تحتاجها بسرعة وسهولة. فريق الدعم الفني لدينا متواجد على مدار الساعة.',
    startChat: 'ابدأ الدردشة الآن',
    learnMore: 'اعرف المزيد',
    home: 'الرئيسية',
    chat: 'دردشة',
    faq: 'الأسئلة الشائعة',
    register: 'تسجيل',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    enterEmail: 'أدخل بريدك الإلكتروني',
    enterPassword: 'أدخل كلمة مرورك',
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    loginError: 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.',
    noAccount: 'ليس لديك حساب؟',
    welcomeBack: 'مرحباً بعودتك!',
    loading: 'جار التحميل...',
    typeMessage: 'اكتب رسالتك هنا...',
    technicalSupport: 'الدعم الفني',
    onlineNow: 'متصل الآن',
    transferToHuman: 'التحويل إلى موظف بشري',
    transferringToHuman: 'جاري التحويل إلى موظف بشري...',
    menu: 'القائمة',
    previousChats: 'المحادثات السابقة',
    settings: 'الإعدادات',
    languageSettings: 'إعدادات اللغة',
    languageSettingsDesc: 'اختر لغة التطبيق المفضلة لديك',
    currentLanguage: 'اللغة الحالية',
    appearance: 'المظهر',
    appearanceDesc: 'تخصيص مظهر التطبيق',
    theme: 'السمة',
    themeDesc: 'اختر بين الوضع الفاتح والداكن',
    light: 'فاتح',
    dark: 'داكن',
    notifications: 'الإشعارات',
    notificationsDesc: 'إدارة تفضيلات الإشعارات',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    emailNotificationsDesc: 'تلقي إشعارات عبر البريد الإلكتروني',
    pushNotifications: 'الإشعارات الفورية',
    pushNotificationsDesc: 'تلقي إشعارات فورية في المتصفح',
    enabled: 'مفعل',
    disabled: 'معطل',
    account: 'الحساب',
    accountDesc: 'إدارة معلومات حسابك',
    editProfile: 'تعديل الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    saveSettings: 'حفظ الإعدادات',
    settingsSaved: 'تم حفظ الإعدادات بنجاح',
    settingsDesc: 'قم بتخصيص تجربتك وإدارة حسابك',
    actions: 'الإجراءات',
    adminDashboard: 'لوحة تحكم المشرف',
    manageSystemSettings: 'إدارة إعدادات النظام والمحتوى',
    // Features Section
    featuresTitle: 'المميزات',
    feature1Title: 'دعم فوري على مدار الساعة',
    feature1Desc: 'احصل على إجابات فورية لاستفساراتك في أي وقت من اليوم',
    feature2Title: 'ذكاء اصطناعي متقدم',
    feature2Desc: 'تقنيات حديثة تفهم احتياجاتك وتقدم حلول دقيقة',
    feature3Title: 'دعم متعدد اللغات',
    feature3Desc: 'تحدث معنا بالعربية أو الإنجليزية كما تفضل',
    // Stats Section
    statsTitle: 'إحصائياتنا',
    stat1: 'مستخدم راضٍ',
    stat2: 'مشكلة تم حلها',
    stat3: 'متوسط وقت الاستجابة',
    stat4: 'معدل الرضا',
  },
  en: {
    heroTitle: 'We are here to support you',
    heroSubtitle: 'Get the help you need quickly and easily. Our technical support team is available 24/7.',
    startChat: 'Start Chat Now',
    learnMore: 'Learn More',
    home: 'Home',
    chat: 'Chat',
    faq: 'FAQ',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    loginSuccess: 'Logged in successfully!',
    loginError: 'Login failed. Please check your credentials.',
    noAccount: 'Don\'t have an account?',
    welcomeBack: 'Welcome back!',
    loading: 'Loading...',
    typeMessage: 'Type your message here...',
    technicalSupport: 'Technical Support',
    onlineNow: 'Online Now',
    transferToHuman: 'Transfer to Human',
    transferringToHuman: 'Transferring to human...',
    menu: 'Menu',
    previousChats: 'Previous Chats',
    settings: 'Settings',
    languageSettings: 'Language Settings',
    languageSettingsDesc: 'Choose your preferred application language',
    currentLanguage: 'Current Language',
    appearance: 'Appearance',
    appearanceDesc: 'Customize the application appearance',
    theme: 'Theme',
    themeDesc: 'Choose between light and dark mode',
    light: 'Light',
    dark: 'Dark',
    notifications: 'Notifications',
    notificationsDesc: 'Manage your notification preferences',
    emailNotifications: 'Email Notifications',
    emailNotificationsDesc: 'Receive notifications via email',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Receive instant browser notifications',
    enabled: 'Enabled',
    disabled: 'Disabled',
    account: 'Account',
    accountDesc: 'Manage your account information',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully',
    settingsDesc: 'Customize your experience and manage your account',
    actions: 'Actions',
    adminDashboard: 'Admin Dashboard',
    manageSystemSettings: 'Manage system settings and content',
    // Features Section
    featuresTitle: 'Features',
    feature1Title: '24/7 Instant Support',
    feature1Desc: 'Get instant answers to your questions at any time of the day',
    feature2Title: 'Advanced AI Technology',
    feature2Desc: 'Modern technology that understands your needs and provides accurate solutions',
    feature3Title: 'Multi-language Support',
    feature3Desc: 'Talk to us in Arabic or English as you prefer',
    // Stats Section
    statsTitle: 'Our Statistics',
    stat1: 'Happy Users',
    stat2: 'Problems Solved',
    stat3: 'Average Response Time',
    stat4: 'Satisfaction Rate',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null;
  const defaultLanguage = storedLanguage || (navigator.language.startsWith('ar') ? 'ar' : 'en');
  const [language, setLanguage] = useState<"en" | "ar">(defaultLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextProps = {
    language,
    toggleLanguage,
    t,
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
