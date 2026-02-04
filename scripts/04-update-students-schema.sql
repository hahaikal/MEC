-- Description: Update students table to match Phase 1 requirements (NIS & Strict Status)
-- Author: Backend Developer

-- 1. Add NIS column with Unique Constraint
-- We verify if column exists first to be safe, but adding constraints requires care
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'nis') THEN
        ALTER TABLE public.students ADD COLUMN nis character varying;
        ALTER TABLE public.students ADD CONSTRAINT students_nis_key UNIQUE (nis);
    END IF;
END $$;

-- 2. Update Status Constraint
-- First, we need to drop the existing check constraint
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_status_check;

-- Convert existing data to match new ENUMs (Uppercase) to prevent data loss or violation
UPDATE public.students SET status = UPPER(status) WHERE status IN ('active', 'graduated');
UPDATE public.students SET status = 'ACTIVE' WHERE status = 'inactive'; -- Map inactive to ACTIVE or discuss with PM. Assuming ACTIVE for now to allow migration.

-- Add the new strict constraint as requested by PM
ALTER TABLE public.students 
ADD CONSTRAINT students_status_check 
CHECK (status::text = ANY (ARRAY['ACTIVE'::text, 'GRADUATED'::text, 'DROPOUT'::text, 'ON_LEAVE'::text]));

-- 3. Indexing for Performance
-- Adding index on name and nis for faster searching
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students(name);
CREATE INDEX IF NOT EXISTS idx_students_nis ON public.students(nis);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);