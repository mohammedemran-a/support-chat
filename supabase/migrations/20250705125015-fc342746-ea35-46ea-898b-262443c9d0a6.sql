-- إضافة عمود لتمييز الأسئلة الشائعة/الهامة
ALTER TABLE public.knowledge_base 
ADD COLUMN is_frequent boolean NOT NULL DEFAULT false;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX idx_knowledge_base_frequent ON public.knowledge_base(is_frequent, language_code);