
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

    // Auth Forms
    name: 'الاسم',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    createAccount: 'إنشاء حساب جديد',
    welcomeBack: 'مرحباً بعودتك',
    enterName: 'أدخل الاسم',
    enterEmail: 'أدخل البريد الإلكتروني',
    enterPassword: 'أدخل كلمة المرور',
    loading: 'جاري التحميل...',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    registrationSuccess: 'تم إنشاء الحساب بنجاح',
    registrationError: 'خطأ في إنشاء الحساب',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginError: 'خطأ في تسجيل الدخول',

    // FAQ
    faqDescription: 'تجد هنا إجابات للأسئلة الأكثر شيوعاً',
    searchFAQ: 'ابحث في الأسئلة الشائعة...',
    noResults: 'لم يتم العثور على نتائج',

    // Chat
    menu: 'القائمة',
    settings: 'الإعدادات',
    changeLanguage: 'تغيير اللغة',
    logout: 'تسجيل الخروج',
    previousChats: 'المحادثات السابقة',
    technicalSupport: 'الدعم الفني',
    onlineNow: 'متصل الآن',
    transferToHuman: 'التحويل إلى موظف بشري',
    typeMessage: 'اكتب رسالتك هنا...',
    transferringToHuman: 'جاري التحويل إلى موظف بشري...',

    // Admin
    adminDashboard: 'لوحة تحكم المشرف',
    manageSystemSettings: 'إدارة إعدادات النظام والمحتوى',
    users: 'المستخدمون',
    chats: 'المحادثات',
    faqs: 'الأسئلة الشائعة',
    usersManagement: 'إدارة المستخدمين',
    manageRegisteredUsers: 'إدارة المستخدمين المسجلين في النظام',
    joinDate: 'تاريخ الانضمام',
    status: 'الحالة',
    actions: 'الإجراءات',
    active: 'نشط',
    inactive: 'غير نشط',
    chatsManagement: 'إدارة المحادثات',
    viewAllChats: 'عرض جميع المحادثات التي تمت مع البوت',
    user: 'المستخدم',
    startTime: 'وقت البداية',
    endTime: 'وقت النهاية',
    duration: 'المدة',
    completed: 'مكتملة',
    ongoing: 'جارية',
    faqsManagement: 'إدارة الأسئلة الشائعة',
    manageFAQDatabase: 'إدارة قاعدة بيانات الأسئلة الشائعة',
    addQuestion: 'إضافة سؤال',
    addNewQuestion: 'إضافة سؤال جديد',
    fillQuestionInBothLanguages: 'املأ السؤال والإجابة باللغتين',
    questionArabic: 'السؤال (عربي)',
    answerArabic: 'الإجابة (عربي)',
    questionEnglish: 'السؤال (إنجليزي)',
    answerEnglish: 'الإجابة (إنجليزي)',
    enterQuestionArabic: 'أدخل السؤال باللغة العربية',
    enterAnswerArabic: 'أدخل الإجابة باللغة العربية',
    enterQuestionEnglish: 'Enter question in English',
    enterAnswerEnglish: 'Enter answer in English',
    cancel: 'إلغاء',
    save: 'حفظ',
    fillAllFields: 'يرجى ملء جميع الحقول',
    faqAdded: 'تم إضافة السؤال بنجاح',
    faqDeleted: 'تم حذف السؤال بنجاح',
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

    // Auth Forms
    name: 'Name',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create New Account',
    welcomeBack: 'Welcome Back',
    enterName: 'Enter name',
    enterEmail: 'Enter email',
    enterPassword: 'Enter password',
    loading: 'Loading...',
    alreadyHaveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    passwordMismatch: 'Passwords do not match',
    registrationSuccess: 'Account created successfully',
    registrationError: 'Error creating account',
    loginSuccess: 'Login successful',
    loginError: 'Login error',

    // FAQ
    faqDescription: 'Find answers to the most frequently asked questions',
    searchFAQ: 'Search in FAQs...',
    noResults: 'No results found',

    // Chat
    menu: 'Menu',
    settings: 'Settings',
    changeLanguage: 'Change Language',
    logout: 'Logout',
    previousChats: 'Previous Chats',
    technicalSupport: 'Technical Support',
    onlineNow: 'Online Now',
    transferToHuman: 'Transfer to Human Agent',
    typeMessage: 'Type your message here...',
    transferringToHuman: 'Transferring to human agent...',

    // Admin
    adminDashboard: 'Admin Dashboard',
    manageSystemSettings: 'Manage system settings and content',
    users: 'Users',
    chats: 'Chats',
    faqs: 'FAQs',
    usersManagement: 'Users Management',
    manageRegisteredUsers: 'Manage registered users in the system',
    joinDate: 'Join Date',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    chatsManagement: 'Chats Management',
    viewAllChats: 'View all conversations with the bot',
    user: 'User',
    startTime: 'Start Time',
    endTime: 'End Time',
    duration: 'Duration',
    completed: 'Completed',
    ongoing: 'Ongoing',
    faqsManagement: 'FAQs Management',
    manageFAQDatabase: 'Manage FAQ database',
    addQuestion: 'Add Question',
    addNewQuestion: 'Add New Question',
    fillQuestionInBothLanguages: 'Fill question and answer in both languages',
    questionArabic: 'Question (Arabic)',
    answerArabic: 'Answer (Arabic)',
    questionEnglish: 'Question (English)',
    answerEnglish: 'Answer (English)',
    enterQuestionArabic: 'أدخل السؤال باللغة العربية',
    enterAnswerArabic: 'أدخل الإجابة باللغة العربية',
    enterQuestionEnglish: 'Enter question in English',
    enterAnswerEnglish: 'Enter answer in English',
    cancel: 'Cancel',
    save: 'Save',
    fillAllFields: 'Please fill all fields',
    faqAdded: 'Question added successfully',
    faqDeleted: 'Question deleted successfully',
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
