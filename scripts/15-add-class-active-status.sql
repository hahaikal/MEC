-- 15-add-class-active-status.sql
-- Add is_active column to classes table

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_classes_is_active ON public.classes(is_active);
