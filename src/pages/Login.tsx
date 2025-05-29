
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const LoginForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Login data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate JWT token storage
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', mockToken);
      
      toast.success(t('loginSuccess') || 'تم تسجيل الدخول بنجاح');
      navigate('/chat');
    } catch (error) {
      toast.error(t('loginError') || 'خطأ في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
          <CardDescription>{t('welcomeBack') || 'مرحباً بعودتك'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email') || 'البريد الإلكتروني'}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enterEmail') || 'أدخل البريد الإلكتروني'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password') || 'كلمة المرور'}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('enterPassword') || 'أدخل كلمة المرور'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-gradient hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (t('loading') || 'جاري التحميل...') : t('login')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('noAccount') || 'ليس لديك حساب؟'}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-brand-blue-600 hover:underline font-medium"
                >
                  {t('register')}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Login = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <LoginForm />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Login;
