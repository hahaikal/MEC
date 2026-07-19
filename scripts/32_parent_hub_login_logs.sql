-- Migration: Create parent_hub_login_logs table
-- This table stores login history for the parent-hub portal

CREATE TABLE IF NOT EXISTS public.parent_hub_login_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student_name VARCHAR(255),
  login_type VARCHAR(20) DEFAULT 'student', -- 'student' or 'staff'
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- for staff login
  logged_in_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries on the monitoring page
CREATE INDEX IF NOT EXISTS idx_parent_hub_login_logs_logged_in_at 
  ON public.parent_hub_login_logs(logged_in_at DESC);

CREATE INDEX IF NOT EXISTS idx_parent_hub_login_logs_student_id 
  ON public.parent_hub_login_logs(student_id);

-- RLS: Allow authenticated users (staff) to read login logs
ALTER TABLE public.parent_hub_login_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read on parent_hub_login_logs" ON public.parent_hub_login_logs;
CREATE POLICY "Allow authenticated read on parent_hub_login_logs"
  ON public.parent_hub_login_logs
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow service role insert on parent_hub_login_logs" ON public.parent_hub_login_logs;
CREATE POLICY "Allow service role insert on parent_hub_login_logs"
  ON public.parent_hub_login_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also allow service role full access (for server actions)
DROP POLICY IF EXISTS "Allow service_role full access on parent_hub_login_logs" ON public.parent_hub_login_logs;
CREATE POLICY "Allow service_role full access on parent_hub_login_logs"
  ON public.parent_hub_login_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
