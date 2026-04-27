-- Add fee_per_meeting to classes
ALTER TABLE public.classes ADD COLUMN fee_per_meeting numeric NOT NULL DEFAULT 0;

-- Optional: Clean up legacy columns from students table
-- ALTER TABLE public.students DROP COLUMN base_fee;
-- ALTER TABLE public.students DROP COLUMN discount;
