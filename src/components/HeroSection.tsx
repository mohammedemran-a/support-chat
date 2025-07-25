
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-brand-blue-50 via-brand-purple-50 to-brand-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-blue-200 dark:bg-brand-blue-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-brand-purple-200 dark:bg-brand-purple-800 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-brand-green-200 dark:bg-brand-green-800 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-brand-blue-100 dark:bg-brand-blue-900 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
              <span className="gradient-text">{t('heroTitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-brand-gradient text-white hover:opacity-90 transition-all transform hover:scale-105 px-10 py-4 text-lg font-semibold shadow-lg"
                onClick={() => navigate('/chat')}
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                {t('startChat')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue-300 text-brand-blue-700 hover:bg-brand-blue-50 dark:border-brand-blue-600 dark:text-brand-blue-400 dark:hover:bg-brand-blue-900/20 px-10 py-4 text-lg font-semibold shadow-md"
                onClick={() => navigate('/faq')}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
