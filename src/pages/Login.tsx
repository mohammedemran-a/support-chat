
import React, { useState, useEffect } from 'react';
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

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkUserRoleAndRedirect = async (userId: string) => {
    console.log('🔍 checkUserRoleAndRedirect - Checking user role for:', userId);
    
    try {
      // Add a small delay to ensure the profile is created by the trigger
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, name, email, user_id')
        .eq('user_id', userId)
        .single();
      
      console.log('🔍 checkUserRoleAndRedirect - Profile query result:', { profile, error });
      
      if (error) {
        console.error('❌ checkUserRoleAndRedirect - Error fetching profile:', error);
        // If profile doesn't exist, redirect to chat as default
        console.log('➡️ checkUserRoleAndRedirect - No profile found, redirecting to /chat');
        navigate('/chat');
        return;
      }
      
      console.log('✅ checkUserRoleAndRedirect - Profile found:', profile);
      console.log('🔑 checkUserRoleAndRedirect - User role:', profile.role);
      
      if (profile?.role === 'admin') {
        console.log('👑 checkUserRoleAndRedirect - User is admin, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('👤 checkUserRoleAndRedirect - User is not admin, redirecting to /chat. Role:', profile?.role);
        navigate('/chat');
      }
    } catch (error) {
      console.error('💥 checkUserRoleAndRedirect - Error in function:', error);
      navigate('/chat');
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      console.log('🚀 Login useEffect - Checking initial session');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🚀 Login useEffect - Initial session:', session?.user?.id);
      
      if (session) {
        console.log('✅ Login useEffect - User already logged in, checking role');
        await checkUserRoleAndRedirect(session.user.id);
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Login Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ Login Auth - User signed in, checking role');
        await checkUserRoleAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setIsLoading(true);
    
    // إضافة retry mechanism
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🔐 Login attempt ${retryCount + 1} for:`, formData.email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        console.log('🔐 Login result:', { user: data.user?.id, error });

        if (error) {
          console.error('❌ Login error:', error);
          
          // معالجة أنواع مختلفة من الأخطاء
          if (error.message.includes('Invalid login credentials')) {
            toast.error('بيانات الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور');
            break; // لا نعيد المحاولة للبيانات الخاطئة
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('يرجى تأكيد بريدك الإلكتروني أولاً');
            break;
          } else if (error.message.includes('network') || error.message.includes('timeout')) {
            retryCount++;
            if (retryCount < maxRetries) {
              toast.error(`خطأ في الشبكة. إعادة المحاولة ${retryCount}/${maxRetries}`);
              await new Promise(resolve => setTimeout(resolve, 2000)); // انتظار ثانيتين
              continue;
            } else {
              toast.error('خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى');
            }
          } else {
            toast.error(error.message || 'خطأ في تسجيل الدخول');
          }
          break;
        }

        if (data.user) {
          console.log('✅ Login successful for user:', data.user.id);
          toast.success(t('loginSuccess') || 'تم تسجيل الدخول بنجاح');
          // Role check and navigation will be handled by the auth state change listener
          break;
        }
      } catch (error: any) {
        console.error('💥 Login error:', error);
        retryCount++;
        if (retryCount < maxRetries) {
          toast.error(`خطأ غير متوقع. إعادة المحاولة ${retryCount}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          toast.error('خطأ في تسجيل الدخول. يرجى المحاولة لاحقاً');
        }
      }
    }
    
    setIsLoading(false);
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
