
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeBaseItem {
  id: string;
  question: string;
  answer: string;
  language_code: string;
  is_frequent: boolean;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBase = (languageCode: string) => {
  return useQuery({
    queryKey: ['knowledge-base', languageCode],
    queryFn: async () => {
      console.log('Fetching knowledge base for language:', languageCode);
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('language_code', languageCode)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching knowledge base:', error);
        throw error;
      }

      console.log('Fetched knowledge base items:', data?.length);
      return data as KnowledgeBaseItem[];
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
};

// Hook للحصول على الأسئلة الشائعة فقط
export const useFrequentQuestions = (languageCode: string) => {
  return useQuery({
    queryKey: ['frequent-questions', languageCode],
    queryFn: async () => {
      console.log('Fetching frequent questions for language:', languageCode);
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('language_code', languageCode)
        .eq('is_frequent', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching frequent questions:', error);
        throw error;
      }

      console.log('Fetched frequent questions:', data?.length);
      return data as KnowledgeBaseItem[];
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
};

export const useSearchKnowledgeBase = (query: string, languageCode: string) => {
  return useQuery({
    queryKey: ['knowledge-base-search', query, languageCode],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      console.log('Searching knowledge base:', { query, languageCode });
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('language_code', languageCode)
        .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error searching knowledge base:', error);
        throw error;
      }

      console.log('Search results:', data?.length);
      return data as KnowledgeBaseItem[];
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
