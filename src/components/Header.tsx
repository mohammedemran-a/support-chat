
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUserProfile } from '@/hooks/useProfiles';
import { Languages, MessageSquare, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut, isAuthenticated } = useAuth();
  const { data: userProfile } = useCurrentUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLanguage);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    } catch (error) {
      toast.error('خطأ في تسجيل الخروج');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-800">
              {isRTL ? 'نظام الدعم الفني' : 'Technical Support System'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 ${
                location.pathname === '/' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
              }`}
            >
              {t('home')}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/chat" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 ${
                  location.pathname === '/chat' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
                }`}
              >
                {t('chat')}
              </Link>
            )}
            {userProfile?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 flex items-center space-x-2 ${
                  location.pathname === '/admin' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>لوحة الإدارة</span>
              </Link>
            )}
            <Link 
              to="/faq" 
              className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 ${
                location.pathname === '/faq' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
              }`}
            >
              {t('faq')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle with Icon */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-brand-blue-300"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{currentLanguage === 'ar' ? 'English' : 'العربية'}</span>
              <span className="sm:hidden">{currentLanguage === 'ar' ? 'EN' : 'ع'}</span>
            </Button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user?.email}</span>
                    {userProfile?.role === 'admin' && (
                      <Shield className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-brand-gradient text-white hover:opacity-90 shadow-md">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
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
          <div className="md:hidden py-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 ${
                  location.pathname === '/' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
                }`}
              >
                {t('home')}
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/chat" 
                  className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 ${
                    location.pathname === '/chat' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
                  }`}
                >
                  {t('chat')}
                </Link>
              )}
              {userProfile?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 flex items-center space-x-2 ${
                    location.pathname === '/admin' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>لوحة الإدارة</span>
                </Link>
              )}
              <Link 
                to="/faq" 
                className={`text-gray-700 hover:text-brand-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-brand-blue-50 ${
                  location.pathname === '/faq' ? 'text-brand-blue-600 bg-brand-blue-50' : ''
                }`}
              >
                {t('faq')}
              </Link>
              <div className="flex space-x-2 pt-2">
                {isAuthenticated ? (
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-700 w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
                  </Button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
