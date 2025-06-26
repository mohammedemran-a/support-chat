
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Translation {
  key: string;
  language_code: string;
  value: string;
}

export const useTranslations = (languageCode: string) => {
  return useQuery({
    queryKey: ['translations', languageCode],
    queryFn: async () => {
      console.log('Fetching translations for language:', languageCode);
      
      const { data, error } = await supabase
        .from('translations')
        .select('key, value')
        .eq('language_code', languageCode);

      if (error) {
        console.error('Error fetching translations:', error);
        throw error;
      }

      console.log('Fetched translations:', data?.length, 'items');

      // Convert array to object for easy lookup
      const translationsMap: Record<string, string> = {};
      data?.forEach((translation) => {
        translationsMap[translation.key] = translation.value;
      });

      return translationsMap;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (increased from 30 minutes)
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours (increased from 1 hour)
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: 3, // Retry failed requests up to 3 times
  });
};
