ALTER TABLE public.class_enrollments
ADD COLUMN IF NOT EXISTS base_fee numeric;

-- 2. Migrate existing fee data from students to class_enrollments
UPDATE public.class_enrollments ce
SET 
  base_fee = s.base_fee
FROM public.students s
WHERE ce.student_id = s.id;

-- 3. Function to merge duplicate students
DO $$
DECLARE
    r RECORD;
    primary_id UUID;
BEGIN
    -- Loop through each duplicate group (students with same name)
    FOR r IN (
        SELECT name, array_agg(id ORDER BY created_at ASC) as ids
        FROM public.students
        GROUP BY name
        HAVING count(id) > 1
    ) LOOP
        -- The first ID in the array is our primary record
        primary_id := r.ids[1];

        -- For all other IDs (duplicates)
        FOR i IN 2 .. array_length(r.ids, 1) LOOP
            
            -- Update class_enrollments
            UPDATE public.class_enrollments
            SET student_id = primary_id
            WHERE student_id = r.ids[i];

            -- Update payments
            UPDATE public.payments
            SET student_id = primary_id
            WHERE student_id = r.ids[i];

            -- Update attendance_logs
            UPDATE public.attendance_logs
            SET student_id = primary_id
            WHERE student_id = r.ids[i];

            -- Update legacy_attendance_summaries
            UPDATE public.legacy_attendance_summaries
            SET student_id = primary_id
            WHERE student_id = r.ids[i];

            -- Delete the duplicate student
            DELETE FROM public.students
            WHERE id = r.ids[i];

        END LOOP;
    END LOOP;
END $$;

-- 4. Remove the fee columns from students table
ALTER TABLE public.students 
DROP COLUMN IF EXISTS base_fee,
DROP COLUMN IF EXISTS discount;

-- 5. Add Unique constraint to student name
ALTER TABLE public.students 
ADD CONSTRAINT students_name_key UNIQUE (name);
