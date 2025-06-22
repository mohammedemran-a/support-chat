
import React, { useEffect } from 'react';
import { useCurrentUserProfile } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '@/components/AdminPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useCurrentUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AdminDashboard - Auth status:', { isAuthenticated, authLoading, userId: user?.id });
    console.log('AdminDashboard - Profile:', { userProfile, profileLoading });
    
    if (!authLoading && !profileLoading) {
      if (!isAuthenticated) {
        console.log('AdminDashboard - User not authenticated, redirecting to login');
        navigate('/login');
      } else if (userProfile && userProfile.role !== 'admin') {
        console.log('AdminDashboard - User is not admin, role:', userProfile.role);
        navigate('/chat');
      }
    }
  }, [isAuthenticated, authLoading, userProfile, profileLoading, navigate, user]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">يجب تسجيل الدخول</h2>
              <p className="text-gray-600">يجب عليك تسجيل الدخول للوصول إلى لوحة الإدارة</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">غير مصرح لك</h2>
              <p className="text-gray-600">ليس لديك صلاحية للوصول إلى لوحة الإدارة</p>
              <p className="text-sm text-gray-500 mt-2">دورك الحالي: {userProfile?.role || 'غير محدد'}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AdminPanel />
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
