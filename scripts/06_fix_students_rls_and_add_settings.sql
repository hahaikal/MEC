-- Drop ALL existing policies on students to start fresh
DROP POLICY IF EXISTS admin_manager_all_students ON public.students;
DROP POLICY IF EXISTS teacher_select_own_students ON public.students;
DROP POLICY IF EXISTS staff_select_students ON public.students;
DROP POLICY IF EXISTS staff_insert_students ON public.students;
DROP POLICY IF EXISTS staff_update_students ON public.students;
DROP POLICY IF EXISTS "Staff can view students" ON public.students;
DROP POLICY IF EXISTS "Staff can insert students" ON public.students;
DROP POLICY IF EXISTS "Staff can update students" ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;

-- The infinite recursion occurs because:
-- A policy on `students` queries `users` to check role.
-- But maybe a policy on `users` queries `students`?
-- Or `users` policy queries `users` (e.g. `Admins can view all users` checks `SELECT id FROM public.users WHERE role = 'admin'`).
-- Ah! `Admins can view all users` has `auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')`. This causes recursion on the users table!
-- When `students` policy runs, it queries `users`. Querying `users` triggers `Users can view own profile` OR `Admins can view all users`.
-- `Admins can view all users` queries `users` again, which triggers `Admins can view all users`, leading to infinite recursion!

-- Fix recursion on users table first!
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    -- Direct lookup without subquerying the same table if possible, or using a security definer function.
    -- To avoid recursion in Postgres RLS, we can do this:
    (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) IN ('admin', 'director')
  );

-- Re-create students policies using safer queries
CREATE POLICY "Admin and Directors can do everything" ON public.students
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) IN ('admin', 'director')
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) IN ('admin', 'director')
);

CREATE POLICY "Staff and Managers can select, insert, update" ON public.students
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) IN ('staff', 'manager')
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) IN ('staff', 'manager')
);

CREATE POLICY "Teachers can view their own students" ON public.students
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) = 'teacher' AND
  EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    JOIN public.classes c ON ce.class_id = c.id
    WHERE ce.student_id = students.id AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Parents can view their children" ON public.students
FOR SELECT
TO authenticated
USING (
  parent_id = auth.uid()
);


-- Also fix other user policies to avoid infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Actually, the issue with `(SELECT role FROM public.users WHERE id = auth.uid())` inside a policy on `public.users` can STILL cause recursion if we evaluate it while checking rows in `public.users`.
-- Best practice for Supabase role checking: Create a function that runs with SECURITY DEFINER.

-- Drop the bad policy we just made above in the same script to replace it with the better function approach:
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create helper function for auth
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role::text FROM public.users WHERE id = auth.uid();
$$;

-- Now use the function which avoids triggering RLS recursion
CREATE POLICY "Admins and Directors can view all users" ON public.users
  FOR SELECT USING (
    public.get_auth_role() IN ('admin', 'director')
  );

CREATE POLICY "Admins and Directors can insert users" ON public.users
  FOR INSERT WITH CHECK (
    public.get_auth_role() IN ('admin', 'director')
  );

CREATE POLICY "Admins and Directors can update users" ON public.users
  FOR UPDATE USING (
    public.get_auth_role() IN ('admin', 'director')
  );

CREATE POLICY "Admins and Directors can delete users" ON public.users
  FOR DELETE USING (
    public.get_auth_role() IN ('admin', 'director')
  );

-- Update student policies to use the function too
DROP POLICY IF EXISTS "Admin and Directors can do everything" ON public.students;
CREATE POLICY "Admin and Directors can do everything" ON public.students
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('admin', 'director'))
WITH CHECK (public.get_auth_role() IN ('admin', 'director'));

DROP POLICY IF EXISTS "Staff and Managers can select, insert, update" ON public.students;
CREATE POLICY "Staff and Managers can select, insert, update" ON public.students
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('staff', 'manager'))
WITH CHECK (public.get_auth_role() IN ('staff', 'manager'));

DROP POLICY IF EXISTS "Teachers can view their own students" ON public.students;
CREATE POLICY "Teachers can view their own students" ON public.students
FOR SELECT TO authenticated
USING (
  public.get_auth_role() = 'teacher' AND
  EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    JOIN public.classes c ON ce.class_id = c.id
    WHERE ce.student_id = students.id AND c.teacher_id = auth.uid()
  )
);

-- Add system settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    setting_key character varying NOT NULL UNIQUE,
    setting_value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid REFERENCES public.users(id),
    CONSTRAINT system_settings_pkey PRIMARY KEY (id)
);

-- RLS for system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read system settings" ON public.system_settings
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins and Directors can update system settings" ON public.system_settings
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('admin', 'director'))
WITH CHECK (public.get_auth_role() IN ('admin', 'director'));

-- Insert some default settings if they don't exist
INSERT INTO public.system_settings (setting_key, setting_value)
VALUES
  ('schoolName', '"Sekolah Menengah Atas XYZ"'),
  ('schoolEmail', '"admin@sekolah.id"'),
  ('schoolPhone', '"+62 812 3456 7890"'),
  ('currency', '"IDR"'),
  ('timezone', '"Asia/Jakarta"'),
  ('language', '"id"'),
  ('sppAmount', '500000'),
  ('dueDate', '10'),
  ('theme', '"light"'),
  ('emailNotification', 'true'),
  ('paymentReminder', 'true'),
  ('monthlyReport', 'true'),
  ('backupEnabled', 'true')
ON CONFLICT (setting_key) DO NOTHING;
