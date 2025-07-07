
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Languages, Moon, Sun, Bell, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

const SettingsContent = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, effectiveTheme } = useTheme();

  const handleSaveSettings = () => {
    toast.success(t('settingsSaved') || 'تم حفظ الإعدادات بنجاح');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('settings') || 'الإعدادات'}
          </h1>
          <p className="text-gray-600">
            {t('settingsDesc') || 'قم بتخصيص تجربتك وإدارة حسابك'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Languages className="h-5 w-5 text-brand-blue-600" />
                <span>{t('languageSettings') || 'إعدادات اللغة'}</span>
              </CardTitle>
              <CardDescription>
                {t('languageSettingsDesc') || 'اختر لغة التطبيق المفضلة لديك'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('currentLanguage') || 'اللغة الحالية'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {i18n.language === 'ar' ? 'العربية' : 'English'}
                  </p>
                </div>
                <Button
                  onClick={toggleLanguage}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Languages className="h-4 w-4" />
                  <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Sun className="h-5 w-5 text-brand-blue-600" />
                <span>{t('appearance') || 'المظهر'}</span>
              </CardTitle>
              <CardDescription>
                {t('appearanceDesc') || 'تخصيص مظهر التطبيق'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('theme') || 'السمة'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('themeDesc') || 'اختر بين الوضع الفاتح والداكن'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={effectiveTheme === 'light' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {t('light') || 'فاتح'}
                  </Button>
                  <Button 
                    variant={effectiveTheme === 'dark' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    {t('dark') || 'داكن'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-brand-blue-600" />
                <span>{t('notifications') || 'الإشعارات'}</span>
              </CardTitle>
              <CardDescription>
                {t('notificationsDesc') || 'إدارة تفضيلات الإشعارات'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('emailNotifications') || 'إشعارات البريد الإلكتروني'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('emailNotificationsDesc') || 'تلقي إشعارات عبر البريد الإلكتروني'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('enabled') || 'مفعل'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('pushNotifications') || 'الإشعارات الفورية'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('pushNotificationsDesc') || 'تلقي إشعارات فورية في المتصفح'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('disabled') || 'معطل'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <User className="h-5 w-5 text-brand-blue-600" />
                <span>{t('account') || 'الحساب'}</span>
              </CardTitle>
              <CardDescription>
                {t('accountDesc') || 'إدارة معلومات حسابك'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  {t('editProfile') || 'تعديل الملف الشخصي'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('changePassword') || 'تغيير كلمة المرور'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              className="bg-brand-gradient text-white hover:opacity-90"
            >
              {t('saveSettings') || 'حفظ الإعدادات'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SettingsContent />
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
