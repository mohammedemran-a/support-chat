-- إصلاح العلاقة بين conversations و profiles
-- أولاً نحذف القيد الموجود إذا كان هناك أي
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;

-- ثم نضيف القيد الصحيح
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- تحديث RLS policies للتأكد من العمل الصحيح
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
CREATE POLICY "Admins can view all conversations" 
ON public.conversations 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

-- إضافة index لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);