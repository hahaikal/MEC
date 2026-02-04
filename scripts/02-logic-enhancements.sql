-- ==============================================================================
-- MEC FINANCE SYSTEM - LOGIC ENHANCEMENT MIGRATION (REVISED v2)
-- Author: Backend Engineer
-- Description: Integritas data, Kalkulasi Server-side, & Security RLS (Idempotent)
-- ==============================================================================

-- 1. LOGIC EXTENSION: Tambah billing_cycle_date pada students
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS billing_cycle_date INTEGER DEFAULT 10 
CHECK (billing_cycle_date BETWEEN 1 AND 28); 

-- 2. DATABASE CONSTRAINTS: Unique Program Enrollment
-- Memastikan siswa tidak bisa didaftarkan ke program yang sama dua kali
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_student_program_enrollment'
    ) THEN 
        ALTER TABLE student_programs
        ADD CONSTRAINT unique_student_program_enrollment UNIQUE (student_id, program_id);
    END IF; 
END $$;

-- 3. SECURITY (AUDIT TRAIL): Automasi created_by
-- Fungsi trigger untuk mengisi created_by dengan UID user yang sedang login
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  -- Cek jika created_by null, baru isi otomatis. 
  -- Ini memungkinkan override jika diperlukan, tapi defaultnya auth.uid()
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger pada tabel students (Hapus dulu jika ada untuk update)
DROP TRIGGER IF EXISTS trigger_set_created_by_students ON students;
CREATE TRIGGER trigger_set_created_by_students
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();

-- 4. API EFFICIENCY: Kalkulasi Outstanding (Sisa Tagihan) di Server
-- Menghindari perhitungan manual di Frontend.
CREATE OR REPLACE FUNCTION public.get_student_outstanding(student_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_program_cost DECIMAL := 0;
    total_paid DECIMAL := 0;
BEGIN
    -- Hitung total biaya program yang diambil siswa
    SELECT COALESCE(SUM(p.price), 0)
    INTO total_program_cost
    FROM student_programs sp
    JOIN programs p ON sp.program_id = p.id
    WHERE sp.student_id = student_uuid
    AND sp.status = 'active'; -- Hanya hitung program aktif

    -- Hitung total pembayaran yang sudah masuk (status 'completed')
    SELECT COALESCE(SUM(amount), 0)
    INTO total_paid
    FROM payments
    WHERE student_id = student_uuid
    AND payment_status = 'completed';

    -- Return selisih
    RETURN total_program_cost - total_paid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. SECURITY (RLS): Perketat Tabel Payments
-- Menggunakan tabel public.users yang SUDAH ADA (bukan user_roles baru)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Clean up policy lama agar tidak error "already exists"
DROP POLICY IF EXISTS "Payments visibility" ON payments;
DROP POLICY IF EXISTS "Staff can insert payments" ON payments;
DROP POLICY IF EXISTS "Staff can update payments" ON payments;
DROP POLICY IF EXISTS "Only Admin can delete payments" ON payments;

-- Policy 1: Read Access 
-- Admin, Staff, Manager bisa baca semua. Siswa baca punya sendiri.
CREATE POLICY "Payments visibility" ON payments
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role IN ('admin', 'staff', 'manager')
  ) 
  OR 
  student_id = auth.uid()
);

-- Policy 2: Write Access (Insert)
-- Hanya Admin, Staff, Manager
CREATE POLICY "Staff can insert payments" ON payments
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role IN ('admin', 'staff', 'manager')
  )
);

-- Policy 3: Write Access (Update)
-- Hanya Admin, Staff, Manager
CREATE POLICY "Staff can update payments" ON payments
FOR UPDATE USING (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role IN ('admin', 'staff', 'manager')
  )
);

-- Policy 4: Delete Access 
-- Hanya Admin
CREATE POLICY "Only Admin can delete payments" ON payments
FOR DELETE USING (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role = 'admin'
  )
);