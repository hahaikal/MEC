-- Migration 20: Architecture Expansion

-- 1. Insert 'MEC PRESCHOOL' into programs
INSERT INTO public.programs (name, duration_months, price, is_active)
VALUES ('MEC PRESCHOOL', 12, 475000, true);

-- 2. Create class_teachers junction table
CREATE TABLE IF NOT EXISTS public.class_teachers (
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, teacher_id)
);

-- Enable RLS on class_teachers
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;

-- Class teachers policies
CREATE POLICY "class_teachers_select" ON public.class_teachers
  FOR SELECT USING (true);

CREATE POLICY "class_teachers_insert" ON public.class_teachers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'director', 'manager', 'staff')
    )
  );

CREATE POLICY "class_teachers_delete" ON public.class_teachers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'director', 'manager', 'staff')
    )
  );

-- 3. Migrate existing teacher_id data to class_teachers
INSERT INTO public.class_teachers (class_id, teacher_id)
SELECT id, teacher_id FROM public.classes WHERE teacher_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 4. Drop columns from classes
ALTER TABLE public.classes DROP COLUMN teacher_id;
ALTER TABLE public.classes DROP COLUMN target_meetings;

-- 5. Add columns to users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS staff_id text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS payday integer,
  ADD COLUMN IF NOT EXISTS roles text[];

-- Migrate existing role to roles array and format it properly
UPDATE public.users
SET roles = ARRAY[
  CASE 
    WHEN role = 'admin' THEN 'Admin'
    WHEN role = 'manager' THEN 'Manager'
    WHEN role = 'director' THEN 'Director'
    WHEN role = 'staff' THEN 'Staff'
    WHEN role = 'teacher' THEN 'Teacher'
    ELSE 'Staff'
  END
];

-- 6. Update Trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, roles, is_active)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email), 
    ARRAY['Admin'], -- Default role
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$;

-- 7. Drop the old role column
ALTER TABLE public.users DROP COLUMN role;

