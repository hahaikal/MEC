-- MEC Finance System - Attendance System
-- Phase 2: Attendance Tracking

-- Create attendance_summaries table
CREATE TABLE IF NOT EXISTS public.attendance_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  total_meetings INTEGER NOT NULL DEFAULT 0,
  attended_meetings INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints
  CONSTRAINT check_attendance_validity CHECK (attended_meetings <= total_meetings),
  CONSTRAINT unique_student_attendance_per_period UNIQUE (student_id, program_id, month, year)
);

-- Enable RLS
ALTER TABLE public.attendance_summaries ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_attendance_student_id ON public.attendance_summaries(student_id);
CREATE INDEX idx_attendance_program_id ON public.attendance_summaries(program_id);
CREATE INDEX idx_attendance_period ON public.attendance_summaries(month, year);

-- RLS Policies
-- Allow Staff, Managers, Admins, Teachers to VIEW
CREATE POLICY "Staff can view attendance" ON public.attendance_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff', 'manager', 'teacher')
    )
  );

-- Allow Staff, Managers, Admins, Teachers to INSERT
CREATE POLICY "Staff can insert attendance" ON public.attendance_summaries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff', 'manager', 'teacher')
    )
  );

-- Allow Staff, Managers, Admins, Teachers to UPDATE
CREATE POLICY "Staff can update attendance" ON public.attendance_summaries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff', 'manager', 'teacher')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff', 'manager', 'teacher')
    )
  );

-- Create View for easier fetching (Joined Data)
CREATE OR REPLACE VIEW public.attendance_details_view AS
SELECT
  a.id,
  a.student_id,
  s.name AS student_name,
  a.program_id,
  p.name AS program_name,
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
JOIN public.students s ON a.student_id = s.id
JOIN public.programs p ON a.program_id = p.id;

-- Grant permissions (if needed, though RLS usually handles it in Supabase)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_summaries TO authenticated;
GRANT SELECT ON public.attendance_details_view TO authenticated;
