-- Add photo_url to students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS photo_url text;
