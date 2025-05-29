
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, BookOpen, Star, Users } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-brand-blue-50 via-brand-purple-50 to-brand-green-50 py-20 lg:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-brand-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-brand-green-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-brand-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              <span className="gradient-text">{t('heroTitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-brand-gradient text-white hover:opacity-90 transition-all transform hover:scale-105 px-10 py-4 text-lg font-semibold shadow-lg"
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                {t('startChat')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue-300 text-brand-blue-700 hover:bg-brand-blue-50 px-10 py-4 text-lg font-semibold shadow-md"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                {t('learnMore')}
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-in-right">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-brand-blue-gradient rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('instantSupport') || 'دعم فوري'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('instantSupportDesc') || 'احصل على إجابات فورية لاستفساراتك على مدار الساعة'}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-brand-purple-gradient rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('expertTeam') || 'فريق خبراء'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('expertTeamDesc') || 'فريق متخصص من المهندسين جاهز لمساعدتك'}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-brand-green-gradient rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('topQuality') || 'جودة عالية'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('topQualityDesc') || 'حلول مخصصة وعالية الجودة لجميع احتياجاتك'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
