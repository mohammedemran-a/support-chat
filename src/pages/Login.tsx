
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (user) {
      console.log('Login - User already authenticated, redirecting to chat');
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent, isRetry = false) => {
    e.preventDefault();
    
    if (!isRetry) {
      setRetryCount(0);
    }
    
    setIsLoading(true);
    
    try {
      console.log('Login - Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Handle specific error types
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('loginError') || 'بيانات الدخول غير صحيحة');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error(t('emailNotConfirmed') || 'يرجى تأكيد بريدك الإلكتروني أولاً');
        } else if (error.message.includes('Too many requests')) {
          toast.error(t('tooManyRequests') || 'محاولات كثيرة جداً، يرجى المحاولة لاحقاً');
        } else if (error.message.includes('Network')) {
          if (retryCount < 2) {
            toast.error(t('networkError') || 'خطأ في الشبكة، جاري إعادة المحاولة...');
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              handleLogin(e, true);
            }, 2000);
            return;
          } else {
            toast.error(t('networkError') || 'خطأ في الشبكة، يرجى المحاولة مرة أخرى');
          }
        } else {
          toast.error(error.message || t('loginError') || 'فشل تسجيل الدخول');
        }
        return;
      }

      console.log('Login - Success:', data.user?.id);
      toast.success(t('loginSuccess') || 'تم تسجيل الدخول بنجاح!');
      navigate('/chat');
      
    } catch (error: any) {
      console.error('Login error:', error);
      if (retryCount < 2) {
        toast.error(t('retrying') || 'جاري إعادة المحاولة...');
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          handleLogin(e, true);
        }, 2000);
      } else {
        toast.error(t('loginError') || 'فشل تسجيل الدخول');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold dark:text-white">{t('welcomeBack') || 'مرحباً بعودتك!'}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t('login') || 'تسجيل الدخول'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">{t('email') || 'البريد الإلكتروني'}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enterEmail') || 'أدخل بريدك الإلكتروني'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">{t('password') || 'كلمة المرور'}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('enterPassword') || 'أدخل كلمة مرورك'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-gradient hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                retryCount > 0 ? (t('retrying') || 'إعادة المحاولة...') : (t('loading') || 'جار التحميل...')
              ) : (t('login') || 'تسجيل الدخول')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('noAccount') || 'ليس لديك حساب؟'}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-brand-blue-600 hover:underline font-medium dark:text-brand-blue-400"
                >
                  {t('register') || 'تسجيل'}
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
