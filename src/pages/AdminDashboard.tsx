
import React, { useEffect, useState } from 'react';
import { useCurrentUserProfile, useProfiles, useUpdateUserRole, UserProfile } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  UserCheck,
  Database,
  Activity,
  FileText,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useCurrentUserProfile();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const updateUserRole = useUpdateUserRole();
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Admin Panel functions
  const handleRoleChange = (userId: string, newRole: string) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdateRole = (userId: string) => {
    const newRole = selectedRoles[userId];
    if (newRole) {
      updateUserRole.mutate({ userId, role: newRole });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'support_agent':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مشرف';
      case 'support_agent':
        return 'وكيل دعم';
      default:
        return 'مستخدم';
    }
  };

  // Statistics calculations
  const stats = {
    totalUsers: profiles?.length || 0,
    admins: profiles?.filter(p => p.role === 'admin').length || 0,
    supportAgents: profiles?.filter(p => p.role === 'support_agent').length || 0,
    regularUsers: profiles?.filter(p => p.role === 'user').length || 0,
  };

  useEffect(() => {
    console.log('🏛️ AdminDashboard - Component mounted');
    console.log('🏛️ AdminDashboard - Auth status:', { isAuthenticated, authLoading, userId: user?.id });
    console.log('🏛️ AdminDashboard - Profile:', { userProfile, profileLoading, profileError });
    
    if (!authLoading && !profileLoading) {
      if (!isAuthenticated) {
        console.log('❌ AdminDashboard - User not authenticated, redirecting to login');
        navigate('/login');
      } else if (userProfile) {
        console.log('🔍 AdminDashboard - Checking user role:', userProfile.role);
        if (userProfile.role !== 'admin') {
          console.log('🚫 AdminDashboard - User is not admin, role:', userProfile.role);
          navigate('/chat');
        } else {
          console.log('✅ AdminDashboard - User is admin, showing admin panel');
        }
      } else if (profileError) {
        console.error('❌ AdminDashboard - Profile error:', profileError);
        navigate('/chat');
      }
    }
  }, [isAuthenticated, authLoading, userProfile, profileLoading, profileError, navigate, user]);

  if (authLoading || profileLoading || profilesLoading) {
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
              <p className="text-xs text-gray-400 mt-1">معرف المستخدم: {user?.id}</p>
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
                <p className="text-gray-600">إدارة شاملة للنظام والمستخدمين</p>
              </div>
            </div>
            <Badge variant="destructive" className="px-3 py-1">
              <Shield className="w-4 h-4 mr-2" />
              مشرف النظام
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>نظرة عامة</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>إدارة المستخدمين</span>
              </TabsTrigger>
              <TabsTrigger value="conversations" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>المحادثات</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>التحليلات</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>الإعدادات</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>نشاط النظام</span>
                    </CardTitle>
                    <CardDescription>
                      مراقبة حالة النظام والأداء
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">حالة الخادم</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          متصل
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">قاعدة البيانات</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          نشطة
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">آخر تحديث</span>
                        <span className="text-sm text-gray-500">قبل دقائق قليلة</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="w-5 h-5" />
                      <span>إدارة قاعدة البيانات</span>
                    </CardTitle>
                    <CardDescription>
                      عرض وإدارة بيانات النظام
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        عرض السجلات
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        إعدادات قاعدة البيانات
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>إعدادات سريعة</span>
                    </CardTitle>
                    <CardDescription>
                      الوصول السريع للإعدادات المهمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        إعدادات الأمان
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        إعدادات المستخدمين
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management Tab */}
            <TabsContent value="users">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-brand-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">لوحة إدارة المستخدمين</h1>
                    <p className="text-gray-600">إدارة أدوار المستخدمين وصلاحياتهم</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">إجمالي المستخدمين</p>
                          <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-600">المشرفين</p>
                          <p className="text-3xl font-bold text-red-900">{stats.admins}</p>
                        </div>
                        <Shield className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">وكلاء الدعم</p>
                          <p className="text-3xl font-bold text-green-900">{stats.supportAgents}</p>
                        </div>
                        <UserCheck className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">المستخدمين العاديين</p>
                          <p className="text-3xl font-bold text-purple-900">{stats.regularUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>إدارة أدوار المستخدمين</CardTitle>
                    <CardDescription>
                      يمكنك تغيير أدوار المستخدمين من هنا
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profilesLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">جاري تحميل بيانات المستخدمين...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {profiles?.map((profile: UserProfile) => (
                          <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-medium">{profile.name}</h3>
                                <p className="text-sm text-gray-600">{profile.email}</p>
                              </div>
                              <Badge variant={getRoleBadgeVariant(profile.role)}>
                                {getRoleLabel(profile.role)}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Select
                                value={selectedRoles[profile.user_id] || profile.role}
                                onValueChange={(value) => handleRoleChange(profile.user_id, value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">مستخدم</SelectItem>
                                  <SelectItem value="support_agent">وكيل دعم</SelectItem>
                                  <SelectItem value="admin">مشرف</SelectItem>
                                </SelectContent>
                              </Select>

                              {selectedRoles[profile.user_id] && 
                               selectedRoles[profile.user_id] !== profile.role && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateRole(profile.user_id)}
                                  disabled={updateUserRole.isPending}
                                >
                                  {updateUserRole.isPending ? 'جاري التحديث...' : 'تحديث'}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Conversations Tab */}
            <TabsContent value="conversations">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة المحادثات</CardTitle>
                  <CardDescription>
                    عرض ومراقبة جميع المحادثات في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>سيتم إضافة إدارة المحادثات قريباً</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>التحليلات والتقارير</CardTitle>
                  <CardDescription>
                    إحصائيات مفصلة حول استخدام النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>سيتم إضافة التحليلات والتقارير قريباً</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات النظام</CardTitle>
                  <CardDescription>
                    إدارة الإعدادات العامة للنظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>سيتم إضافة إعدادات النظام قريباً</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
