-- Migration 22: Finalize RLS and Drop Legacy Role Column

-- 1. Create a helper function to check roles (in case it wasn't created yet)
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM jsonb_array_elements_text(
      COALESCE(
        current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' -> 'roles',
        '[]'::jsonb
      )
    ) AS user_role
    WHERE user_role = role_name
  );
$$;

-- 2. DROP the legacy 'role' column with CASCADE.
ALTER TABLE public.users DROP COLUMN IF EXISTS role CASCADE;

-- 3. Recreate the essential policies using our new 'has_role()' function 

-- ==========================================
-- PROGRAMS
-- ==========================================
DROP POLICY IF EXISTS "Public read programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;

CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage programs" ON public.programs 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager'));

-- ==========================================
-- PAYMENTS
-- ==========================================
DROP POLICY IF EXISTS "Internal team can manage payments" ON public.payments;
CREATE POLICY "Internal team can manage payments" ON public.payments 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'));

-- ==========================================
-- EXPENSES
-- ==========================================
DROP POLICY IF EXISTS "Internal team can manage expenses" ON public.expenses;
CREATE POLICY "Internal team can manage expenses" ON public.expenses 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'));

-- ==========================================
-- TRANSACTION SUMMARY
-- ==========================================
DROP POLICY IF EXISTS "Internal team can manage transactions" ON public.transaction_summary;
CREATE POLICY "Internal team can manage transactions" ON public.transaction_summary 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'));

-- ==========================================
-- ATTENDANCE LOGS
-- ==========================================
DROP POLICY IF EXISTS "Internal team can manage attendance" ON public.attendance_logs;
DROP POLICY IF EXISTS "Teachers can manage attendance" ON public.attendance_logs;

CREATE POLICY "Internal team can manage attendance" ON public.attendance_logs 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'));

CREATE POLICY "Teachers can manage attendance" ON public.attendance_logs 
FOR ALL TO authenticated 
USING (public.has_role('Teacher'))
WITH CHECK (public.has_role('Teacher'));

-- ==========================================
-- LEGACY ATTENDANCE SUMMARIES
-- ==========================================
DROP POLICY IF EXISTS "Internal team can manage legacy attendance" ON public.legacy_attendance_summaries;
CREATE POLICY "Internal team can manage legacy attendance" ON public.legacy_attendance_summaries 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff'));

-- ==========================================
-- GALLERY ITEMS
-- ==========================================
DROP POLICY IF EXISTS "gallery_items_public_read" ON public.gallery_items;
DROP POLICY IF EXISTS "gallery_items_internal_all" ON public.gallery_items;

CREATE POLICY "gallery_items_public_read" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "gallery_items_internal_all" ON public.gallery_items 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'));

-- ==========================================
-- CLASS ACTIVITIES
-- ==========================================
DROP POLICY IF EXISTS "class_activities_read" ON public.class_activities;
DROP POLICY IF EXISTS "class_activities_internal_all" ON public.class_activities;

CREATE POLICY "class_activities_read" ON public.class_activities FOR SELECT USING (true);
CREATE POLICY "class_activities_internal_all" ON public.class_activities 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'));

-- ==========================================
-- CLASS DOCUMENTS
-- ==========================================
DROP POLICY IF EXISTS "class_documents_read" ON public.class_documents;
DROP POLICY IF EXISTS "class_documents_internal_all" ON public.class_documents;

CREATE POLICY "class_documents_read" ON public.class_documents FOR SELECT USING (true);
CREATE POLICY "class_documents_internal_all" ON public.class_documents 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'));

-- ==========================================
-- STORAGE (Supabase Storage)
-- ==========================================
DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_internal_all" ON storage.objects;

CREATE POLICY "storage_public_read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "storage_internal_all" ON storage.objects 
FOR ALL TO authenticated 
USING (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director') OR public.has_role('Manager') OR public.has_role('Staff') OR public.has_role('Teacher'));
