-- Update Attendance Schema for Semester-based tracking

-- 1. Rename 'month' to 'semester' and add new columns
ALTER TABLE public.attendance_summaries RENAME COLUMN month TO semester;
ALTER TABLE public.attendance_summaries ADD COLUMN IF NOT EXISTS sick INT DEFAULT 0 NOT NULL;
ALTER TABLE public.attendance_summaries ADD COLUMN IF NOT EXISTS leave INT DEFAULT 0 NOT NULL;
ALTER TABLE public.attendance_summaries ADD COLUMN IF NOT EXISTS alpha INT DEFAULT 0 NOT NULL;

-- 2. Update Constraint
ALTER TABLE public.attendance_summaries DROP CONSTRAINT IF EXISTS unique_student_attendance_per_period;
ALTER TABLE public.attendance_summaries ADD CONSTRAINT unique_student_attendance_per_period UNIQUE (student_id, class_name, semester, year);

-- 3. Recreate View with new schema
DROP VIEW IF EXISTS public.attendance_details_view;
CREATE OR REPLACE VIEW public.attendance_details_view AS
SELECT
  a.id,
  a.student_id,
  s.name AS student_name,
  a.class_name,
  a.semester,
  a.year,
  a.total_meetings,
  a.sick,
  a.leave,
  a.alpha,
  (a.total_meetings - a.sick - a.leave - a.alpha) AS attended_meetings,
  CASE
    WHEN a.total_meetings > 0 THEN ((a.total_meetings - a.sick - a.leave - a.alpha)::numeric / a.total_meetings::numeric) * 100
    ELSE 0
  END as attendance_percentage,
  a.updated_at
FROM public.attendance_summaries a
JOIN public.students s ON a.student_id = s.id;
