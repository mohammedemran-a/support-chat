-- إنشاء جدول المحادثات
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- إنشاء جدول الرسائل
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID,
  content TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS للمحادثات
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- إضافة سياسات المحادثات
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can view all conversations" 
ON public.conversations 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can create their own conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- إضافة سياسات الرسائل
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE conversations.id = messages.conversation_id 
  AND (conversations.user_id = auth.uid() OR get_user_role(auth.uid()) = 'admin')
));

CREATE POLICY "Users can create messages in their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.conversations 
  WHERE conversations.id = messages.conversation_id 
  AND conversations.user_id = auth.uid()
));

-- إضافة سياسة للمشرفين لإدراج في قاعدة المعرفة
CREATE POLICY "Admins can insert knowledge base items" 
ON public.knowledge_base 
FOR INSERT 
WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update knowledge base items" 
ON public.knowledge_base 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete knowledge base items" 
ON public.knowledge_base 
FOR DELETE 
USING (get_user_role(auth.uid()) = 'admin');

-- إنشاء دالة لتحديث timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة triggers للـ timestamps
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إضافة فهارس للأداء
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_knowledge_base_language_code ON public.knowledge_base(language_code);