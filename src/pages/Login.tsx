
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const LoginForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkUserRoleAndRedirect = async (userId: string) => {
    console.log('Checking user role for user ID:', userId);
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, name, email')
        .eq('user_id', userId)
        .single();
      
      console.log('Profile query result:', { profile, error });
      
      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, redirect to chat as default
        navigate('/chat');
        return;
      }
      
      if (profile?.role === 'admin') {
        console.log('User is admin, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('User is not admin, redirecting to /chat. Role:', profile?.role);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Error in checkUserRoleAndRedirect:', error);
      navigate('/chat');
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session);
      
      if (session) {
        await checkUserRoleAndRedirect(session.user.id);
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        await checkUserRoleAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', formData.email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('بيانات الدخول غير صحيحة');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('يرجى تأكيد بريدك الإلكتروني أولاً');
        } else {
          toast.error(error.message || 'خطأ في تسجيل الدخول');
        }
        return;
      }

      toast.success(t('loginSuccess') || 'تم تسجيل الدخول بنجاح');
      // Navigation will be handled by the auth state change listener
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('خطأ في تسجيل الدخول');
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
