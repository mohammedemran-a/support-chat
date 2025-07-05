import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddKnowledgeBaseItemData {
  questionAr: string;
  answerAr: string;
  questionEn: string;
  answerEn: string;
}

export const useAddKnowledgeBaseItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddKnowledgeBaseItemData) => {
      // إضافة النسخة العربية
      const { error: errorAr } = await supabase
        .from('knowledge_base')
        .insert({
          question: data.questionAr,
          answer: data.answerAr,
          language_code: 'ar'
        });

      if (errorAr) {
        throw new Error('خطأ في إضافة النسخة العربية: ' + errorAr.message);
      }

      // إضافة النسخة الإنجليزية
      const { error: errorEn } = await supabase
        .from('knowledge_base')
        .insert({
          question: data.questionEn,
          answer: data.answerEn,
          language_code: 'en'
        });

      if (errorEn) {
        throw new Error('خطأ في إضافة النسخة الإنجليزية: ' + errorEn.message);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      toast.success('تم إضافة السؤال بنجاح إلى قاعدة المعرفة');
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء إضافة السؤال');
    },
  });
};

export const useDeleteKnowledgeBaseItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      queryClient.invalidateQueries({ queryKey: ['frequent-questions'] });
      toast.success('تم حذف السؤال بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في حذف السؤال: ' + error.message);
    },
  });
};

export const useToggleFrequentQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFrequent }: { id: string; isFrequent: boolean }) => {
      const { error } = await supabase
        .from('knowledge_base')
        .update({ is_frequent: isFrequent })
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      queryClient.invalidateQueries({ queryKey: ['frequent-questions'] });
      toast.success('تم تحديث حالة السؤال بنجاح');
    },
    onError: (error: any) => {
      toast.error('خطأ في تحديث السؤال: ' + error.message);
    },
  });
};