
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProfiles, useUpdateUserRole, UserProfile } from '@/hooks/useProfiles';
import { useTranslation } from 'react-i18next';
import { Shield, Users, UserCheck } from 'lucide-react';

const AdminPanel = () => {
  const { t } = useTranslation();
  const { data: profiles, isLoading } = useProfiles();
  const updateUserRole = useUpdateUserRole();
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-brand-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة إدارة المستخدمين</h1>
          <p className="text-gray-600">إدارة أدوار المستخدمين وصلاحياتهم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold">{profiles?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">المشرفين</p>
                <p className="text-2xl font-bold">
                  {profiles?.filter(p => p.role === 'admin').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">وكلاء الدعم</p>
                <p className="text-2xl font-bold">
                  {profiles?.filter(p => p.role === 'support_agent').length || 0}
                </p>
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
