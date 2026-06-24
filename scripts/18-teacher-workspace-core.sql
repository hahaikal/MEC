-- 18-teacher-workspace-core.sql

-- 1. Table for PDF Magazine and Lesson Plans
CREATE TABLE IF NOT EXISTS public.class_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    file_size_mb NUMERIC(5,2),
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('MAGAZINE', 'LESSON_PLAN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- 2. Enable RLS
ALTER TABLE public.class_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone (authenticated) can read documents
CREATE POLICY "Akses baca dokumen kelas" 
ON public.class_documents FOR SELECT 
USING (true);

-- Policy: Only class teacher or admins can insert
CREATE POLICY "Hanya pengajar kelas yang bisa mengunggah dokumen" 
ON public.class_documents FOR INSERT 
WITH CHECK (
    auth.uid() IN (
        SELECT teacher_id FROM public.classes WHERE id = class_id
    ) OR auth.uid() IN (
        SELECT id FROM public.users WHERE role IN ('admin', 'manager', 'director')
    )
);

-- Note: In a real environment, UPDATE and DELETE policies should also be added 
-- if document management includes editing/deleting features.
CREATE POLICY "Hanya pengajar kelas yang bisa mengubah dokumen" 
ON public.class_documents FOR UPDATE 
USING (
    auth.uid() IN (
        SELECT teacher_id FROM public.classes WHERE id = class_id
    ) OR auth.uid() IN (
        SELECT id FROM public.users WHERE role IN ('admin', 'manager', 'director')
    )
);

CREATE POLICY "Hanya pengajar kelas yang bisa menghapus dokumen" 
ON public.class_documents FOR DELETE 
USING (
    auth.uid() IN (
        SELECT teacher_id FROM public.classes WHERE id = class_id
    ) OR auth.uid() IN (
        SELECT id FROM public.users WHERE role IN ('admin', 'manager', 'director')
    )
);

-- 3. Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('parent_hub_magazines', 'parent_hub_magazines', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for parent_hub_magazines
CREATE POLICY "magazines_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'parent_hub_magazines');

CREATE POLICY "magazines_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'parent_hub_magazines'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "magazines_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'parent_hub_magazines'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "magazines_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'parent_hub_magazines'
    AND auth.role() = 'authenticated'
  );
