
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isRTL = language === 'ar';

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AS</span>
            </div>
            <span className="font-bold text-xl text-gray-800">
              {isRTL ? 'الدعم العربي' : 'Arab Support'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium ${
                location.pathname === '/' ? 'text-brand-blue-600' : ''
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/chat" 
              className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium ${
                location.pathname === '/chat' ? 'text-brand-blue-600' : ''
              }`}
            >
              {t('chat')}
            </Link>
            <Link 
              to="/faq" 
              className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium ${
                location.pathname === '/faq' ? 'text-brand-blue-600' : ''
              }`}
            >
              {t('faq')}
            </Link>
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
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-700">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90">
                  {t('register')}
                </Button>
              </Link>
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
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium ${
                  location.pathname === '/' ? 'text-brand-blue-600' : ''
                }`}
              >
                {t('home')}
              </Link>
              <Link 
                to="/chat" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium ${
                  location.pathname === '/chat' ? 'text-brand-blue-600' : ''
                }`}
              >
                {t('chat')}
              </Link>
              <Link 
                to="/faq" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium ${
                  location.pathname === '/faq' ? 'text-brand-blue-600' : ''
                }`}
              >
                {t('faq')}
              </Link>
              <div className="flex space-x-2 pt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="text-gray-700 w-full">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90 w-full">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
