
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRTL = language === 'ar';

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AS</span>
            </div>
            <span className="font-bold text-xl text-gray-800">
              {isRTL ? 'الدعم العربي' : 'Arab Support'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-brand-blue-600 transition-colors font-medium">
              {t('home')}
            </a>
            <a href="/chat" className="text-gray-700 hover:text-brand-blue-600 transition-colors font-medium">
              {t('chat')}
            </a>
            <a href="/faq" className="text-gray-700 hover:text-brand-blue-600 transition-colors font-medium">
              {t('faq')}
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-700 hover:bg-gray-100"
            >
              {language === 'ar' ? '🇬🇧 EN' : '🇸🇦 ع'}
            </Button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-700">
                {t('login')}
              </Button>
              <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90">
                {t('register')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-brand-blue-600 transition-colors font-medium">
                {t('home')}
              </a>
              <a href="/chat" className="text-gray-700 hover:text-brand-blue-600 transition-colors font-medium">
                {t('chat')}
              </a>
              <a href="/faq" className="text-gray-700 hover:text-brand-blue-600 transition-colors font-medium">
                {t('faq')}
              </a>
              <div className="flex space-x-2 pt-2">
                <Button variant="ghost" size="sm" className="text-gray-700 flex-1">
                  {t('login')}
                </Button>
                <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90 flex-1">
                  {t('register')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
