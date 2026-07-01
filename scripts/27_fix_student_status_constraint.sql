-- Skrip ini akan memperbaiki kendala yang menyebabkan status siswa tidak bisa diubah menjadi INACTIVE (Nonaktif)
-- Jalankan skrip ini pada menu SQL Editor di Supabase Anda

-- Hapus constraint lama
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_status_check;

-- Tambahkan constraint baru yang mengizinkan INACTIVE
ALTER TABLE public.students ADD CONSTRAINT students_status_check 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPOUT', 'ON_LEAVE', 'active', 'inactive', 'graduated', 'dropout', 'on_leave'));

-- Add weekly_schedule column to classes table
-- This column will store the weekly schedule as a JSON array of objects
-- Example format: 
-- [
--   {
--     "time": "08:00 - 08:30",
--     "Monday": "Arrival & Free Play",
--     "Tuesday": "Arrival & Free Play",
--     "Wednesday": "Arrival & Free Play",
--     "Thursday": "Arrival & Free Play",
--     "Friday": "Arrival & Free Play"
--   }
-- ]

ALTER TABLE classes ADD COLUMN IF NOT EXISTS weekly_schedule jsonb;
