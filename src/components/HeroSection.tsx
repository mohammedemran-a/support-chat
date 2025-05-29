
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-brand-blue-50 via-brand-purple-50 to-brand-green-50 py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-brand-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-brand-green-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-brand-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="gradient-text">{t('heroTitle')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-brand-gradient text-white hover:opacity-90 transition-all transform hover:scale-105 px-8 py-3"
              >
                💬 {t('startChat')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue-300 text-brand-blue-700 hover:bg-brand-blue-50 px-8 py-3"
              >
                📚 {t('learnMore')}
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Chat Interface Mockup */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🤖</span>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 justify-end">
                  <div className="flex-1 bg-brand-blue-500 text-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm">أحتاج مساعدة في إعداد البريد الإلكتروني</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-bold">👤</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🤖</span>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">بالطبع! سأساعدك في إعداد البريد الإلكتروني. ما نوع الجهاز الذي تستخدمه؟</p>
                  </div>
                </div>
              </div>
              
              {/* Typing indicator */}
              <div className="flex justify-start mt-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-brand-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-brand-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white font-bold">✓</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-purple-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white text-xl">⚡</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
