DO $$
DECLARE
    target_date DATE;
    day_name TEXT;
    class_record RECORD;
    enrollment_record RECORD;
BEGIN
    -- Loop through each date from July 1, 2026 to July 5, 2026
    FOR target_date IN SELECT * FROM generate_series('2026-07-01'::date, '2026-07-05'::date, '1 day'::interval)
    LOOP
        -- Determine the day name (e.g., 'Monday', 'Tuesday')
        day_name := trim(to_char(target_date, 'Day'));
        
        -- Find all classes that have a schedule on this day
        FOR class_record IN 
            SELECT id, schedule_days 
            FROM public.classes 
            WHERE schedule_days IS NOT NULL 
              AND day_name = ANY (schedule_days)
        LOOP
            -- Find all active students enrolled in this class
            FOR enrollment_record IN
                SELECT ce.student_id
                FROM public.class_enrollments ce
                JOIN public.students s ON s.id = ce.student_id
                WHERE ce.class_id = class_record.id
                  AND (s.status = 'ACTIVE' OR s.status = 'active')
            LOOP
                -- Insert the HOLIDAY log, or update if it already exists
                INSERT INTO public.attendance_logs (class_id, student_id, date, status, created_at, updated_at)
                VALUES (class_record.id, enrollment_record.student_id, target_date, 'HOLIDAY', now(), now())
                ON CONFLICT (id) DO NOTHING; -- Assuming id is PK, but we don't have a unique constraint on (class_id, student_id, date)
                
                -- Since we might not have a UNIQUE constraint on (class_id, student_id, date), 
                -- it's safer to do an UPDATE first, and if not found, do an INSERT.
                UPDATE public.attendance_logs 
                SET status = 'HOLIDAY', updated_at = now()
                WHERE class_id = class_record.id 
                  AND student_id = enrollment_record.student_id 
                  AND date = target_date;
                
                IF NOT FOUND THEN
                    INSERT INTO public.attendance_logs (class_id, student_id, date, status)
                    VALUES (class_record.id, enrollment_record.student_id, target_date, 'HOLIDAY');
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
