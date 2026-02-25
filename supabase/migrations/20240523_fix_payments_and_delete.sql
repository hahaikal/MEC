
-- Fix Payments Table for Monthly SPP
ALTER TABLE public.payments
  ALTER COLUMN program_id DROP NOT NULL, -- Allow payments without a specific "program" (e.g. general tuition)
  ADD COLUMN month integer, -- Add specific month column (0-11)
  ADD COLUMN year integer;  -- Add specific year column

-- Add ON DELETE CASCADE to allow hard deletion of students
ALTER TABLE public.payments
  DROP CONSTRAINT payments_student_id_fkey,
  ADD CONSTRAINT payments_student_id_fkey
    FOREIGN KEY (student_id)
    REFERENCES public.students(id)
    ON DELETE CASCADE;

-- Also need to handle other dependent tables if they exist and block deletion
ALTER TABLE public.student_programs
  DROP CONSTRAINT student_programs_student_id_fkey,
  ADD CONSTRAINT student_programs_student_id_fkey
    FOREIGN KEY (student_id)
    REFERENCES public.students(id)
    ON DELETE CASCADE;

ALTER TABLE public.student_discounts
  DROP CONSTRAINT student_discounts_student_fkey,
  ADD CONSTRAINT student_discounts_student_fkey
    FOREIGN KEY (student_id)
    REFERENCES public.students(id)
    ON DELETE CASCADE;
