
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'support_agent';
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as UserProfile[];
    },
  });
};

export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('useCurrentUserProfile - Current auth user:', user?.id);
      
      if (!user) {
        console.log('useCurrentUserProfile - No authenticated user found');
        return null;
      }

      console.log('useCurrentUserProfile - Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('useCurrentUserProfile - Profile query result:', { data, error });

      if (error) {
        console.error('useCurrentUserProfile - Error fetching profile:', error);
        throw error;
      }

      console.log('useCurrentUserProfile - Profile data:', data);
      return data as UserProfile;
    },
    enabled: true,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['current-user-profile'] });
      toast.success('تم تحديث دور المستخدم بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في تحديث دور المستخدم: ' + error.message);
    },
  });
};
