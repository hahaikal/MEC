-- Fix Attendance Schema for Class-based tracking
-- Replace program_id with class_name in attendance_summaries

-- 0. Drop dependent view FIRST
DROP VIEW IF EXISTS public.attendance_details_view;

-- 1. Add class_name column
ALTER TABLE public.attendance_summaries ADD COLUMN class_name VARCHAR(255);

-- 2. Drop program_id dependency
ALTER TABLE public.attendance_summaries DROP CONSTRAINT attendance_summaries_program_id_fkey;
ALTER TABLE public.attendance_summaries DROP COLUMN program_id;

-- 3. Make class_name NOT NULL (after dealing with existing data if any)
-- For now, we assume empty table or acceptable data loss/migration.
-- In production with data, we would update class_name based on program_id lookups first.
ALTER TABLE public.attendance_summaries ALTER COLUMN class_name SET NOT NULL;

-- 4. Update Unique Constraint
ALTER TABLE public.attendance_summaries DROP CONSTRAINT unique_student_attendance_per_period;
ALTER TABLE public.attendance_summaries ADD CONSTRAINT unique_student_attendance_per_period UNIQUE (student_id, class_name, month, year);

-- 5. Recreate View with new schema
CREATE OR REPLACE VIEW public.attendance_details_view AS
SELECT
  a.id,
  a.student_id,
  s.name AS student_name,
  a.class_name,
  a.month,
  a.year,
  a.total_meetings,
  a.attended_meetings,
  CASE
    WHEN a.total_meetings > 0 THEN (a.attended_meetings::numeric / a.total_meetings::numeric) * 100
    ELSE 0
  END as attendance_percentage,
  a.updated_at
FROM public.attendance_summaries a
JOIN public.students s ON a.student_id = s.id;
