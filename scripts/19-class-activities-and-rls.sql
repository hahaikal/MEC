-- Migration: 19-class-activities-and-rls.sql
-- Description: Create class_activities table and override RLS for admins on class_documents and class_activities

-- 1. Create class_activities table
CREATE TABLE IF NOT EXISTS public.class_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL
);

-- 2. Enable RLS
ALTER TABLE public.class_activities ENABLE ROW LEVEL SECURITY;

-- 3. RLS for class_activities
-- Viewable by everyone (parents, teachers, admins)
CREATE POLICY "class_activities_select" ON public.class_activities
  FOR SELECT USING (true);

-- Insertable by the assigned teacher or an admin/director/manager
CREATE POLICY "class_activities_insert" ON public.class_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE id = class_activities.class_id
      AND teacher_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'director', 'manager')
    )
  );

-- Deletable by the assigned teacher or an admin/director/manager
CREATE POLICY "class_activities_delete" ON public.class_activities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE id = class_activities.class_id
      AND teacher_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'director', 'manager')
    )
  );


-- 4. RLS for class_documents override for Admins
-- Note: The previous migration (18) might have only allowed the teacher. We update it to ensure admins can also manage documents.
DROP POLICY IF EXISTS "class_documents_insert" ON public.class_documents;
CREATE POLICY "class_documents_insert" ON public.class_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE id = class_documents.class_id
      AND teacher_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'director', 'manager')
    )
  );

DROP POLICY IF EXISTS "class_documents_delete" ON public.class_documents;
CREATE POLICY "class_documents_delete" ON public.class_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE id = class_documents.class_id
      AND teacher_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'director', 'manager')
    )
  );
