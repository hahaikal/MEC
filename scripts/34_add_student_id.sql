-- 1. Add column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS student_id_code TEXT UNIQUE;

-- 2. Create Sequence for auto-incrementing the ID suffix
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1;

-- 3. Backfill existing students with generated IDs (MEC-{YYYY}-{SEQ})
DO $$
DECLARE
    r RECORD;
    enroll_year TEXT;
BEGIN
    FOR r IN 
        SELECT id, created_at 
        FROM public.students 
        WHERE student_id_code IS NULL 
        ORDER BY created_at ASC
    LOOP
        enroll_year := to_char(extract(year from r.created_at), 'FM9999');
        
        UPDATE public.students 
        SET student_id_code = 'MEC-' || enroll_year || '-' || to_char(nextval('student_id_seq'), 'FM0000')
        WHERE id = r.id;
    END LOOP;
END $$;

-- 4. Create trigger function to auto-generate for new students
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TRIGGER AS $$
DECLARE
    enroll_year TEXT;
BEGIN
    IF NEW.student_id_code IS NULL THEN
        IF NEW.created_at IS NOT NULL THEN
            enroll_year := to_char(extract(year from NEW.created_at), 'FM9999');
        ELSE
            enroll_year := to_char(extract(year from CURRENT_TIMESTAMP), 'FM9999');
        END IF;
        
        NEW.student_id_code := 'MEC-' || enroll_year || '-' || to_char(nextval('student_id_seq'), 'FM0000');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach Trigger
DROP TRIGGER IF EXISTS trg_generate_student_id ON public.students;
CREATE TRIGGER trg_generate_student_id
BEFORE INSERT ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.generate_student_id();

-- Refresh schema cache if using PostgREST
NOTIFY pgrst, 'reload schema';
