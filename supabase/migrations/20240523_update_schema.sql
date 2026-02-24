
-- Students Table Modifications
ALTER TABLE public.students
  DROP COLUMN nis,
  DROP COLUMN class_year,
  DROP COLUMN billing_cycle_date,
  -- status is still useful for tracking even if we delete rows, but user requested removing input.
  -- We can keep the column but drop the check constraint or just ignore it in the UI.
  -- Adding new columns
  ADD COLUMN place_of_birth character varying,
  ADD COLUMN gender character varying CHECK (gender IN ('MALE', 'FEMALE')),
  ADD COLUMN religion character varying,
  ADD COLUMN school_origin character varying,
  ADD COLUMN parent_occupation character varying,
  -- enrollment_date already exists which covers 'joined_at', but user specified 'catat tanggal berapa dia di tambahkan'
  -- created_at handles the exact timestamp of record creation.
  -- 'kelas apa saat masuk' -> 'class_name' already exists and can be used for current class.
  -- If history is needed, a separate table is better, but for now we'll assume class_name is the entry class.
  ADD COLUMN discount numeric DEFAULT 0;

-- Payments Table Modifications
ALTER TABLE public.payments
  ADD COLUMN discount_amount numeric DEFAULT 0;

-- Optional: If status check constraint is annoying
ALTER TABLE public.students DROP CONSTRAINT students_status_check;
ALTER TABLE public.students ADD CONSTRAINT students_status_check CHECK (status IN ('ACTIVE', 'INACTIVE'));
