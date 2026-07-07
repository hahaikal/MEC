-- Drop the existing constraint
ALTER TABLE public.attendance_logs 
DROP CONSTRAINT IF EXISTS attendance_logs_status_check;

-- Add the new constraint with HOLIDAY included
ALTER TABLE public.attendance_logs 
ADD CONSTRAINT attendance_logs_status_check 
CHECK (status::text = ANY (ARRAY['PRESENT'::character varying, 'SICK'::character varying, 'LEAVE'::character varying, 'ALPHA'::character varying, 'HOLIDAY'::character varying]::text[]));
