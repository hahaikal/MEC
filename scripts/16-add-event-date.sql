-- 16-add-event-date.sql
-- Add event_date column to gallery_items table

ALTER TABLE public.gallery_items
ADD COLUMN IF NOT EXISTS event_date DATE;

CREATE INDEX IF NOT EXISTS idx_gallery_items_event_date ON public.gallery_items(event_date);
