
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
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation function
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    return {
      isValid: Object.values(validations).every(Boolean),
      validations
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordMismatch') || 'كلمات المرور غير متطابقة');
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error(t('passwordRequirements') || 'كلمة المرور لا تلبي المتطلبات المطلوبة');
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
        
        // Handle specific error types
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          toast.error(t('emailAlreadyRegistered') || 'هذا البريد الإلكتروني مسجل بالفعل');
        } else if (error.message.includes('invalid email')) {
          toast.error(t('invalidEmail') || 'البريد الإلكتروني غير صالح');
        } else if (error.message.includes('Password')) {
          toast.error(t('passwordError') || 'خطأ في كلمة المرور');
        } else {
          toast.error(error.message || t('registrationError') || 'خطأ في إنشاء الحساب');
        }
        return;
      }

      toast.success(t('registrationSuccess') || 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(t('registrationError') || 'خطأ في إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold dark:text-white">{t('register') || 'تسجيل'}</CardTitle>
          <CardDescription className="dark:text-gray-300">{t('createAccount') || 'إنشاء حساب جديد'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-200">{t('name') || 'الاسم'}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('enterName') || 'أدخل الاسم'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-200">{t('email') || 'البريد الإلكتروني'}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enterEmail') || 'أدخل بريدك الإلكتروني'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              
              {/* Password strength indicators */}
              {formData.password && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {passwordValidation.validations.length ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.validations.length ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {t('passwordLength') || '8 أحرف على الأقل'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.validations.lowercase ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.validations.lowercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {t('passwordLowercase') || 'حرف صغير'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.validations.uppercase ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.validations.uppercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {t('passwordUppercase') || 'حرف كبير'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.validations.number ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.validations.number ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {t('passwordNumber') || 'رقم'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.validations.special ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> : 
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className={passwordValidation.validations.special ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {t('passwordSpecial') || 'رمز خاص (!@#$...)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-200">{t('confirmPassword') || 'تأكيد كلمة المرور'}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('confirmPassword') || 'تأكيد كلمة المرور'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-gradient hover:opacity-90"
              disabled={isLoading || !passwordValidation.isValid}
            >
              {isLoading ? (t('loading') || 'جار التحميل...') : (t('register') || 'تسجيل')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('alreadyHaveAccount') || 'لديك حساب بالفعل؟'}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-brand-blue-600 hover:underline font-medium dark:text-brand-blue-400"
                >
                  {t('login') || 'تسجيل الدخول'}
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
