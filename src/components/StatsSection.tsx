
import React from 'react';
import { useTranslation } from 'react-i18next';

const StatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      number: '10K+',
      label: t('stat1'),
      icon: '👥'
    },
    {
      number: '50K+',
      label: t('stat2'),
      icon: '✅'
    },
    {
      number: '< 30s',
      label: t('stat3'),
      icon: '⚡'
    },
    {
      number: '98%',
      label: t('stat4'),
      icon: '⭐'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('statsTitle')}
          </h2>
          <div className="w-24 h-1 bg-brand-gradient mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Icon */}
                <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                
                {/* Number */}
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                
                {/* Label */}
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
