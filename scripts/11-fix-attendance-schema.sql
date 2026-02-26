-- Fix Attendance Schema for Class-based tracking
-- Replace program_id with class_name in attendance_summaries

-- 1. Drop dependent view FIRST
DROP VIEW IF EXISTS public.attendance_details_view;

-- 2. Add class_name column (TEXT to match students table)
ALTER TABLE public.attendance_summaries ADD COLUMN IF NOT EXISTS class_name TEXT;

-- 3. Populate class_name for existing rows (if any)
UPDATE public.attendance_summaries SET class_name = '' WHERE class_name IS NULL;

-- 4. Make class_name NOT NULL
ALTER TABLE public.attendance_summaries ALTER COLUMN class_name SET NOT NULL;

-- 5. Drop program_id dependency
ALTER TABLE public.attendance_summaries DROP CONSTRAINT IF EXISTS attendance_summaries_program_id_fkey;
ALTER TABLE public.attendance_summaries DROP COLUMN IF EXISTS program_id;

-- 6. Update Unique Constraint for Upsert
ALTER TABLE public.attendance_summaries DROP CONSTRAINT IF EXISTS unique_student_attendance_per_period;
ALTER TABLE public.attendance_summaries ADD CONSTRAINT unique_student_attendance_per_period UNIQUE (student_id, class_name, month, year);

-- 7. Recreate View with new schema
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
