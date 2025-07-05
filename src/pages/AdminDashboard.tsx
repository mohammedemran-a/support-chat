
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useConversations, useDeleteConversation } from '@/hooks/useConversations';
import { useAddKnowledgeBaseItem, useDeleteKnowledgeBaseItem, useToggleFrequentQuestion } from '@/hooks/useKnowledgeBaseAdmin';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { toast } from 'sonner';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  UserCheck,
  FileText,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useCurrentUserProfile();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const updateUserRole = useUpdateUserRole();
  
  // Conversations hooks
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const deleteConversation = useDeleteConversation();
  
  // Knowledge base hooks
  const { data: knowledgeBaseAr } = useKnowledgeBase('ar');
  const { data: knowledgeBaseEn } = useKnowledgeBase('en');
  const addKnowledgeBaseItem = useAddKnowledgeBaseItem();
  const deleteKnowledgeBaseItem = useDeleteKnowledgeBaseItem();
  const toggleFrequentQuestion = useToggleFrequentQuestion();
  
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('users');
  
  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    questionAr: '',
    answerAr: '',
    questionEn: '',
    answerEn: ''
  });
  const navigate = useNavigate();

  // FAQ functions
  const handleFaqFormChange = (field: string, value: string) => {
    setFaqForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!faqForm.questionAr || !faqForm.answerAr || !faqForm.questionEn || !faqForm.answerEn) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    addKnowledgeBaseItem.mutate(faqForm, {
      onSuccess: () => {
        setFaqForm({
          questionAr: '',
          answerAr: '',
          questionEn: '',
          answerEn: ''
        });
      }
    });
  };

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>إدارة المستخدمين</span>
              </TabsTrigger>
              <TabsTrigger value="conversations" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>المحادثات</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>الأسئلة</span>
              </TabsTrigger>
            </TabsList>

            {/* Users Management Tab */}
            <TabsContent value="users">
              <div className="space-y-6">

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
                  {conversationsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">جاري تحميل المحادثات...</p>
                      </div>
                    </div>
                  ) : conversations && conversations.length > 0 ? (
                    <div className="space-y-4">
                      {conversations.map((conversation) => (
                        <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <MessageSquare className="w-8 h-8 text-brand-blue-600" />
                            <div>
                              <h3 className="font-medium">{conversation.title || 'محادثة بدون عنوان'}</h3>
                              <p className="text-sm text-gray-600">{conversation.profile?.name} - {conversation.profile?.email}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(conversation.created_at).toLocaleDateString('ar-SA')}</span>
                                <Clock className="w-3 h-3 ml-2" />
                                <span>{new Date(conversation.created_at).toLocaleTimeString('ar-SA')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                              {conversation.status === 'active' ? 'نشطة' : 'مكتملة'}
                            </Badge>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteConversation.mutate(conversation.id)}
                              disabled={deleteConversation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد محادثات حالياً</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-brand-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة الأسئلة</h1>
                    <p className="text-gray-600">إضافة وإدارة الأسئلة باللغتين العربية والإنجليزية</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>إضافة سؤال جديد</CardTitle>
                    <CardDescription>
                      يمكنك إضافة الأسئلة والأجوبة باللغة العربية والإنجليزية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleFaqSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Arabic Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">النسخة العربية</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="questionAr">السؤال بالعربية</Label>
                            <Input
                              id="questionAr"
                              value={faqForm.questionAr}
                              onChange={(e) => handleFaqFormChange('questionAr', e.target.value)}
                              placeholder="اكتب السؤال باللغة العربية..."
                              required
                              dir="rtl"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="answerAr">الإجابة بالعربية</Label>
                            <Textarea
                              id="answerAr"
                              value={faqForm.answerAr}
                              onChange={(e) => handleFaqFormChange('answerAr', e.target.value)}
                              placeholder="اكتب الإجابة باللغة العربية..."
                              rows={4}
                              required
                              dir="rtl"
                            />
                          </div>
                        </div>

                        {/* English Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">English Version</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="questionEn">Question in English</Label>
                            <Input
                              id="questionEn"
                              value={faqForm.questionEn}
                              onChange={(e) => handleFaqFormChange('questionEn', e.target.value)}
                              placeholder="Write the question in English..."
                              required
                              dir="ltr"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="answerEn">Answer in English</Label>
                            <Textarea
                              id="answerEn"
                              value={faqForm.answerEn}
                              onChange={(e) => handleFaqFormChange('answerEn', e.target.value)}
                              placeholder="Write the answer in English..."
                              rows={4}
                              required
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFaqForm({
                            questionAr: '',
                            answerAr: '',
                            questionEn: '',
                            answerEn: ''
                          })}
                          disabled={addKnowledgeBaseItem.isPending}
                        >
                          إعادة تعيين
                        </Button>
                        <Button
                          type="submit"
                          disabled={addKnowledgeBaseItem.isPending}
                          className="min-w-[120px]"
                        >
                          {addKnowledgeBaseItem.isPending ? 'جاري الحفظ...' : 'حفظ السؤال'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Current Knowledge Base */}
                <Card>
                  <CardHeader>
                    <CardTitle>قاعدة المعرفة الحالية</CardTitle>
                    <CardDescription>
                      عرض وإدارة الأسئلة الموجودة في قاعدة المعرفة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Arabic Knowledge Base */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">الأسئلة العربية ({knowledgeBaseAr?.length || 0})</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                           {knowledgeBaseAr?.map((item) => (
                             <div key={item.id} className="p-4 border rounded-lg space-y-2">
                               <div className="flex items-start justify-between">
                                 <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                     <h4 className="font-medium text-right" dir="rtl">{item.question}</h4>
                                     {item.is_frequent && (
                                       <Badge variant="secondary" className="text-xs">شائع</Badge>
                                     )}
                                   </div>
                                   <p className="text-sm text-gray-600 text-right" dir="rtl">{item.answer}</p>
                                   <div className="text-xs text-gray-400">
                                     {new Date(item.created_at).toLocaleDateString('ar-SA')}
                                   </div>
                                 </div>
                                 <div className="flex items-center space-x-2 ml-2">
                                   <div className="flex items-center space-x-2">
                                     <Label htmlFor={`frequent-ar-${item.id}`} className="text-xs">شائع</Label>
                                     <Switch
                                       id={`frequent-ar-${item.id}`}
                                       checked={item.is_frequent}
                                       onCheckedChange={(checked) => 
                                         toggleFrequentQuestion.mutate({ id: item.id, isFrequent: checked })
                                       }
                                       disabled={toggleFrequentQuestion.isPending}
                                     />
                                   </div>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     className="text-red-600 hover:text-red-800"
                                     onClick={() => deleteKnowledgeBaseItem.mutate(item.id)}
                                     disabled={deleteKnowledgeBaseItem.isPending}
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           ))}
                          {(!knowledgeBaseAr || knowledgeBaseAr.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>لا توجد أسئلة باللغة العربية</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* English Knowledge Base */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">English Questions ({knowledgeBaseEn?.length || 0})</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                           {knowledgeBaseEn?.map((item) => (
                             <div key={item.id} className="p-4 border rounded-lg space-y-2">
                               <div className="flex items-start justify-between">
                                 <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                     <h4 className="font-medium text-left" dir="ltr">{item.question}</h4>
                                     {item.is_frequent && (
                                       <Badge variant="secondary" className="text-xs">Frequent</Badge>
                                     )}
                                   </div>
                                   <p className="text-sm text-gray-600 text-left" dir="ltr">{item.answer}</p>
                                   <div className="text-xs text-gray-400">
                                     {new Date(item.created_at).toLocaleDateString('en-US')}
                                   </div>
                                 </div>
                                 <div className="flex items-center space-x-2 ml-2">
                                   <div className="flex items-center space-x-2">
                                     <Label htmlFor={`frequent-en-${item.id}`} className="text-xs">Frequent</Label>
                                     <Switch
                                       id={`frequent-en-${item.id}`}
                                       checked={item.is_frequent}
                                       onCheckedChange={(checked) => 
                                         toggleFrequentQuestion.mutate({ id: item.id, isFrequent: checked })
                                       }
                                       disabled={toggleFrequentQuestion.isPending}
                                     />
                                   </div>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     className="text-red-600 hover:text-red-800"
                                     onClick={() => deleteKnowledgeBaseItem.mutate(item.id)}
                                     disabled={deleteKnowledgeBaseItem.isPending}
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           ))}
                          {(!knowledgeBaseEn || knowledgeBaseEn.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>No English questions available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
