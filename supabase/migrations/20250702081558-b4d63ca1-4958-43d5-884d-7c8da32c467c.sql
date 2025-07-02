-- حذف السياسات الحالية المعطلة
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- إنشاء دالة آمنة للتحقق من دور المستخدم
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid LIMIT 1;
$$;

-- سياسة جديدة للعرض - المستخدمون يمكنهم رؤية ملفهم الشخصي والمشرفون يمكنهم رؤية الكل
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  public.get_user_role(auth.uid()) = 'admin'
);

-- سياسة جديدة للتحديث - المستخدمون يمكنهم تحديث ملفهم والمشرفون يمكنهم تحديث الكل
CREATE POLICY "Users can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR 
  public.get_user_role(auth.uid()) = 'admin'
);