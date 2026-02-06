-- Migration: Remove classes table and embed class info into students table

BEGIN;

-- 1. Tambahkan kolom baru 'class_name' di tabel students
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS class_name text;

-- 2. (Opsional) Migrasikan data jika tabel classes masih ada isinya
-- Ini akan menyalin nama kelas dari tabel 'classes' ke kolom 'class_name' di 'students'
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'classes') THEN
        EXECUTE '
            UPDATE public.students s
            SET class_name = c.name
            FROM public.classes c
            WHERE s.class_id = c.id
        ';
    END IF;
END $$;

-- 3. Hapus Foreign Key constraint pada students
ALTER TABLE public.students 
DROP CONSTRAINT IF EXISTS students_class_id_fkey;

-- 4. Hapus kolom class_id yang lama dari students
ALTER TABLE public.students 
DROP COLUMN IF EXISTS class_id;

-- 5. Hapus tabel classes
DROP TABLE IF EXISTS public.classes;

COMMIT;