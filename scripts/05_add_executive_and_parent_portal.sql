-- 1. Update users table role constraint
-- Drop existing constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint including 'director' and 'parent'
ALTER TABLE public.users ADD CONSTRAINT users_role_check
CHECK (role::text = ANY (ARRAY['admin'::character varying, 'staff'::character varying, 'manager'::character varying, 'teacher'::character varying, 'director'::character varying, 'parent'::character varying]::text[]));

-- 2. Add parent_id to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.users(id);

-- 3. Create notification_logs table
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    recipient character varying NOT NULL,
    type character varying NOT NULL CHECK (type::text = ANY (ARRAY['WHATSAPP'::character varying, 'EMAIL'::character varying]::text[])),
    message text NOT NULL,
    status character varying NOT NULL DEFAULT 'MOCKED_SENT'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_logs_pkey PRIMARY KEY (id)
);

-- 4. Set up RLS for Parent Portal

-- Students: Parents can only see their own children
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
TO authenticated
USING (
  parent_id = auth.uid()
);

-- Attendance Logs: Parents can only see attendance for their own children
DROP POLICY IF EXISTS "Parents can view their children's attendance" ON public.attendance_logs;
CREATE POLICY "Parents can view their children's attendance"
ON public.attendance_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students
    WHERE students.id = attendance_logs.student_id
    AND students.parent_id = auth.uid()
  )
);

-- Payments: Parents can only see payments for their own children
DROP POLICY IF EXISTS "Parents can view their children's payments" ON public.payments;
CREATE POLICY "Parents can view their children's payments"
ON public.payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students
    WHERE students.id = payments.student_id
    AND students.parent_id = auth.uid()
  )
);

-- Class Enrollments: Parents can see their children's enrollments
DROP POLICY IF EXISTS "Parents can view their children's enrollments" ON public.class_enrollments;
CREATE POLICY "Parents can view their children's enrollments"
ON public.class_enrollments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students
    WHERE students.id = class_enrollments.student_id
    AND students.parent_id = auth.uid()
  )
);
