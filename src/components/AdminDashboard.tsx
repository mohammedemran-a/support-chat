import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfiles } from '@/hooks/useProfiles';
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  UserCheck,
  Database,
  Activity,
  FileText,
  TrendingUp
} from 'lucide-react';
import AdminPanel from './AdminPanel';

const AdminDashboard = () => {
  const { data: profiles } = useProfiles();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: profiles?.length || 0,
    admins: profiles?.filter(p => p.role === 'admin').length || 0,
    supportAgents: profiles?.filter(p => p.role === 'support_agent').length || 0,
    regularUsers: profiles?.filter(p => p.role === 'user').length || 0,
  };

  return (
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
          <AdminPanel />
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
  );
};

export default AdminDashboard;