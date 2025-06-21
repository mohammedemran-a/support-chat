
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

      console.log('Fetched translations:', data);

      // Convert array to object for easy lookup
      const translationsMap: Record<string, string> = {};
      data?.forEach((translation) => {
        translationsMap[translation.key] = translation.value;
      });

      return translationsMap;
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    cacheTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
};
