-- 1. Pastikan tabel class_teachers ada
CREATE TABLE IF NOT EXISTS public.class_teachers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT class_teachers_pkey PRIMARY KEY (id),
  CONSTRAINT class_teachers_unique UNIQUE(class_id, teacher_id)
);

-- 2. Pastikan RLS class_teachers ada
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "class_teachers_select" ON public.class_teachers;
DROP POLICY IF EXISTS "class_teachers_insert" ON public.class_teachers;
DROP POLICY IF EXISTS "class_teachers_delete" ON public.class_teachers;

CREATE POLICY "class_teachers_select" ON public.class_teachers FOR SELECT USING (true);
CREATE POLICY "class_teachers_insert" ON public.class_teachers FOR INSERT WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager'));
CREATE POLICY "class_teachers_delete" ON public.class_teachers FOR DELETE USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager'));

-- 3. Pindahkan data lama jika kolom teacher_id di tabel classes MASIH ADA
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='classes' AND column_name='teacher_id') THEN
    EXECUTE 'INSERT INTO public.class_teachers (class_id, teacher_id) SELECT id, teacher_id FROM public.classes WHERE teacher_id IS NOT NULL ON CONFLICT DO NOTHING';
    EXECUTE 'ALTER TABLE public.classes DROP COLUMN teacher_id';
  END IF;
END
$$;

-- 4. Paksa Supabase API (PostgREST) untuk memuat ulang Schema Cache-nya!
-- Langkah ini krusial agar Next.js mengenali kolom `roles` dan tabel `class_teachers`
NOTIFY pgrst, 'reload schema';
