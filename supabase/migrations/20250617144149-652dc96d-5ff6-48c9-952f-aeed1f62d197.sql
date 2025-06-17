
-- Create languages table
CREATE TABLE public.languages (
  code VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL
);

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid UUID REFERENCES auth.users NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  preferred_language_code VARCHAR REFERENCES public.languages(code),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support_agents table
CREATE TABLE public.support_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid UUID REFERENCES auth.users NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid UUID REFERENCES auth.users NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create intents table
CREATE TABLE public.intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL,
  confidence FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  support_agent_id UUID REFERENCES public.support_agents(id),
  intent_id UUID REFERENCES public.intents(id),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  content TEXT NOT NULL,
  sender VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create knowledge_base table
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  language_code VARCHAR REFERENCES public.languages(code) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default languages
INSERT INTO public.languages (code, name) VALUES 
('ar', 'العربية'),
('en', 'English');

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = uuid);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = uuid);

-- Create RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = (SELECT uuid FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = (SELECT uuid FROM public.users WHERE id = user_id));

-- Create RLS policies for messages
CREATE POLICY "Users can view messages from their conversations" ON public.messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE user_id = (SELECT id FROM public.users WHERE uuid = auth.uid())
    )
  );

CREATE POLICY "Users can create messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE user_id = (SELECT id FROM public.users WHERE uuid = auth.uid())
    )
  );

-- Create RLS policies for knowledge_base (public read access)
CREATE POLICY "Anyone can read knowledge base" ON public.knowledge_base
  FOR SELECT TO public USING (true);

-- Create RLS policies for languages (public read access)
CREATE POLICY "Anyone can read languages" ON public.languages
  FOR SELECT TO public USING (true);

-- Create RLS policies for support agents (admin access only)
CREATE POLICY "Admin access for support agents" ON public.support_agents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE uuid = auth.uid())
  );

-- Create RLS policies for admins (admin access only)
CREATE POLICY "Admin access for admins table" ON public.admins
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE uuid = auth.uid())
  );

-- Create RLS policies for intents (admin and support agent access)
CREATE POLICY "Admin and support agent access for intents" ON public.intents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE uuid = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.support_agents WHERE uuid = auth.uid())
  );
