-- 1. Create the `classes` table
CREATE TABLE public.classes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying NOT NULL,
    program_id uuid,
    teacher_id uuid,
    capacity integer,
    target_meetings integer NOT NULL DEFAULT 15,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT classes_pkey PRIMARY KEY (id),
    CONSTRAINT classes_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id),
    CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id)
);

-- 2. Create the `class_enrollments` table
CREATE TABLE public.class_enrollments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now(),
    CONSTRAINT class_enrollments_pkey PRIMARY KEY (id),
    CONSTRAINT class_enrollments_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
    CONSTRAINT class_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE
);

-- 3. Create the `attendance_logs` table
CREATE TABLE public.attendance_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    date date NOT NULL DEFAULT CURRENT_DATE,
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status character varying NOT NULL CHECK (status::text = ANY (ARRAY['PRESENT'::character varying, 'SICK'::character varying, 'LEAVE'::character varying, 'ALPHA'::character varying]::text[])),
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT attendance_logs_pkey PRIMARY KEY (id),
    CONSTRAINT attendance_logs_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
    CONSTRAINT attendance_logs_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
    CONSTRAINT attendance_logs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);


-- 4. Data Migration: Migrate existing unique class_names from students to classes table
INSERT INTO public.classes (name, target_meetings)
SELECT DISTINCT class_name, 15
FROM public.students
WHERE class_name IS NOT NULL AND class_name != '';

-- 5. Data Migration: Enroll students in their respective classes
INSERT INTO public.class_enrollments (class_id, student_id)
SELECT c.id, s.id
FROM public.students s
JOIN public.classes c ON c.name = s.class_name
WHERE s.class_name IS NOT NULL AND s.class_name != '';


-- 6. Schema Adjustments: Drop class_name from students
ALTER TABLE public.students DROP COLUMN class_name;

-- 7. Schema Adjustments: Rename existing attendance_summaries to legacy_attendance_summaries
ALTER TABLE public.attendance_summaries RENAME TO legacy_attendance_summaries;



-- 8. Create dynamic view for attendance_summaries
CREATE VIEW public.attendance_summaries WITH (security_invoker = true) AS
SELECT
    ce.student_id,
    c.id AS class_id,
    c.name AS class_name,
    EXTRACT(MONTH FROM al.date) AS semester,
    EXTRACT(YEAR FROM al.date) AS year,
    c.target_meetings AS total_meetings,
    COUNT(CASE WHEN al.status = 'PRESENT' THEN 1 END) AS attended_meetings,
    COUNT(CASE WHEN al.status = 'SICK' THEN 1 END) AS sick,
    COUNT(CASE WHEN al.status = 'LEAVE' THEN 1 END) AS leave,
    COUNT(CASE WHEN al.status = 'ALPHA' THEN 1 END) AS alpha
FROM public.class_enrollments ce
JOIN public.classes c ON ce.class_id = c.id
LEFT JOIN public.attendance_logs al ON al.student_id = ce.student_id AND al.class_id = c.id
GROUP BY
    ce.student_id,
    c.id,
    c.name,
    EXTRACT(MONTH FROM al.date),
    EXTRACT(YEAR FROM al.date),
    c.target_meetings;


-- 9. Implement Role-Based Access Control (RLS)

-- Enable RLS on new and modified tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_summary ENABLE ROW LEVEL SECURITY;

-- Helper function to check role if needed or we can use direct auth.uid() joins

-- ==========================================
-- ADMIN & MANAGER POLICIES (Full Access)
-- ==========================================

-- Classes
CREATE POLICY admin_manager_all_classes ON public.classes
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Class Enrollments
CREATE POLICY admin_manager_all_enrollments ON public.class_enrollments
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Attendance Logs
CREATE POLICY admin_manager_all_attendance ON public.attendance_logs
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Students
CREATE POLICY admin_manager_all_students ON public.students
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Finance Tables (admin and manager only)
CREATE POLICY admin_manager_all_expenses ON public.expenses
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_manager_all_payments ON public.payments
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY admin_manager_all_transactions ON public.transaction_summary
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);


-- ==========================================
-- TEACHER POLICIES
-- Read-only for their own classes and enrolled students
-- No access to finance tables (handled by not creating a policy for them)
-- ==========================================

-- Teacher: Classes (Select only own classes)
CREATE POLICY teacher_select_own_classes ON public.classes
FOR SELECT USING (
  teacher_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- Teacher: Class Enrollments (Select only enrollments in their own classes)
CREATE POLICY teacher_select_own_enrollments ON public.class_enrollments
FOR SELECT USING (
  class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- Teacher: Students (Select only students enrolled in their own classes)
CREATE POLICY teacher_select_own_students ON public.students
FOR SELECT USING (
  id IN (
    SELECT student_id FROM public.class_enrollments ce
    JOIN public.classes c ON ce.class_id = c.id
    WHERE c.teacher_id = auth.uid()
  ) AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- Teacher: Attendance Logs (Select, Insert, Update own logs - typically they need to take attendance)
-- Note: Assuming teachers can write attendance for their classes
CREATE POLICY teacher_manage_own_attendance ON public.attendance_logs
FOR ALL USING (
  class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);


-- ==========================================
-- STAFF POLICIES
-- Read/Write (no delete) for academic tables
-- Open access to finance (for now, per instructions)
-- ==========================================

-- Staff: Classes (Select, Insert, Update)
CREATE POLICY staff_manage_classes ON public.classes
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager'))
);
-- Note: RLS 'FOR ALL' includes DELETE. To strictly forbid DELETE, we must specify policies separately.
DROP POLICY staff_manage_classes ON public.classes;
CREATE POLICY staff_select_classes ON public.classes FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_insert_classes ON public.classes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_update_classes ON public.classes FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));

-- Staff: Enrollments
CREATE POLICY staff_select_enrollments ON public.class_enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_insert_enrollments ON public.class_enrollments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_update_enrollments ON public.class_enrollments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));

-- Staff: Students
CREATE POLICY staff_select_students ON public.students FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_insert_students ON public.students FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_update_students ON public.students FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));

-- Staff: Attendance Logs
CREATE POLICY staff_select_attendance ON public.attendance_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_insert_attendance ON public.attendance_logs FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));
CREATE POLICY staff_update_attendance ON public.attendance_logs FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager')));

-- Staff: Finance Tables (Full Access for now per instructions)
CREATE POLICY staff_all_expenses ON public.expenses
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager'))
);

CREATE POLICY staff_all_payments ON public.payments
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager'))
);

CREATE POLICY staff_all_transactions ON public.transaction_summary
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('staff', 'manager'))
);
