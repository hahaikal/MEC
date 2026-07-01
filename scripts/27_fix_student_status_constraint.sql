-- Skrip ini akan memperbaiki kendala yang menyebabkan status siswa tidak bisa diubah menjadi INACTIVE (Nonaktif)
-- Jalankan skrip ini pada menu SQL Editor di Supabase Anda

-- Hapus constraint lama
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_status_check;

-- Tambahkan constraint baru yang mengizinkan INACTIVE
ALTER TABLE public.students ADD CONSTRAINT students_status_check 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPOUT', 'ON_LEAVE', 'active', 'inactive', 'graduated', 'dropout', 'on_leave'));
