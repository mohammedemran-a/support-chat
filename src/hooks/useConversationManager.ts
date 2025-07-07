
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useConversations, useConversationMessages, useDeleteConversation } from './useConversations';

export const useConversationManager = () => {
  const queryClient = useQueryClient();
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const deleteConversationMutation = useDeleteConversation();

  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: title || 'محادثة جديدة',
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const saveMessage = useMutation({
    mutationFn: async ({ conversationId, content, role }: { 
      conversationId: string; 
      content: string; 
      role: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user?.id,
          content,
          role,
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversation-messages', variables.conversationId] 
      });
    },
  });

  const loadConversation = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  };

  return {
    conversations,
    conversationsLoading,
    createConversation: createConversation.mutateAsync,
    saveMessage: saveMessage.mutateAsync,
    loadConversation,
    deleteConversation: deleteConversationMutation.mutateAsync,
  };
};
