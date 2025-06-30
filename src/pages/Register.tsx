
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

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordMismatch') || 'كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: formData.name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        if (error.message.includes('already registered')) {
          toast.error('هذا البريد الإلكتروني مسجل بالفعل');
        } else {
          toast.error(error.message || 'خطأ في إنشاء الحساب');
        }
        return;
      }

      toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('خطأ في إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('register')}</CardTitle>
          <CardDescription>{t('createAccount') || 'إنشاء حساب جديد'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('name') || 'الاسم'}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('enterName') || 'أدخل الاسم'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

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
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword') || 'تأكيد كلمة المرور'}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('confirmPassword') || 'تأكيد كلمة المرور'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-gradient hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (t('loading') || 'جاري التحميل...') : (t('register') || 'إنشاء حساب')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('alreadyHaveAccount') || 'لديك حساب بالفعل؟'}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-brand-blue-600 hover:underline font-medium"
                >
                  {t('login')}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
