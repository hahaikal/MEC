-- Add new columns for parents
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS father_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS mother_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS father_occupation VARCHAR(255),
ADD COLUMN IF NOT EXISTS mother_occupation VARCHAR(255);

-- Drop old columns
ALTER TABLE public.students DROP COLUMN IF EXISTS email;
ALTER TABLE public.students DROP COLUMN IF EXISTS parent_name;
ALTER TABLE public.students DROP COLUMN IF EXISTS parent_occupation;

-- Update base_fee default
ALTER TABLE public.students ALTER COLUMN base_fee SET DEFAULT 375000;

-- Update base fee for all existing students
UPDATE public.students
SET base_fee = 375000;

ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS joined_since_class character varying(100) NULL;
