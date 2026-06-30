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
