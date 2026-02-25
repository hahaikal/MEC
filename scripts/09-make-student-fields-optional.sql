-- Migration to make student fields optional
-- Only `name` and `base_fee` (as numeric NOT NULL DEFAULT 0) should remain strict.

-- Students Table Modifications
ALTER TABLE public.students ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN phone_number DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN parent_name DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN parent_phone DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN date_of_birth DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN address DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN place_of_birth DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN religion DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN school_origin DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN parent_occupation DROP NOT NULL;
ALTER TABLE public.students ALTER COLUMN class_name DROP NOT NULL;

-- Ensure base_fee has a default
ALTER TABLE public.students ALTER COLUMN base_fee SET DEFAULT 0;
ALTER TABLE public.students ALTER COLUMN base_fee SET NOT NULL;
