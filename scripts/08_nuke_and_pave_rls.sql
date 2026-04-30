-- ==========================================
-- STEP 1: NUKE (Sapu Bersih Semua Policy)
-- ==========================================

-- Tabel public.users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins and Directors can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins and Directors can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins and Directors can update users" ON public.users;
DROP POLICY IF EXISTS "Admins and Directors can delete users" ON public.users;
DROP POLICY IF EXISTS "Everyone can view users" ON public.users;

-- Tabel public.students
DROP POLICY IF EXISTS "Staff can view students" ON public.students;
DROP POLICY IF EXISTS "Staff can insert students" ON public.students;
DROP POLICY IF EXISTS "Staff can update students" ON public.students;
DROP POLICY IF EXISTS admin_manager_all_students ON public.students;
DROP POLICY IF EXISTS teacher_select_own_students ON public.students;
DROP POLICY IF EXISTS staff_select_students ON public.students;
DROP POLICY IF EXISTS staff_insert_students ON public.students;
DROP POLICY IF EXISTS staff_update_students ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
DROP POLICY IF EXISTS "Admin and Directors can do everything" ON public.students;
DROP POLICY IF EXISTS "Staff and Managers can select, insert, update" ON public.students;
DROP POLICY IF EXISTS "Teachers can view their own students" ON public.students;

-- Tabel public.classes
DROP POLICY IF EXISTS "Staff can view classes" ON public.classes;
DROP POLICY IF EXISTS "Staff can manage classes" ON public.classes;
DROP POLICY IF EXISTS "admin_manager_all_classes" ON public.classes;
DROP POLICY IF EXISTS "teacher_select_own_classes" ON public.classes;

-- Tabel public.class_enrollments
DROP POLICY IF EXISTS "admin_manager_all_enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "teacher_select_own_enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Parents can view their children's enrollments" ON public.class_enrollments;


-- ==========================================
-- STEP 2: PAVE (Murni JWT Claims)
-- ==========================================

-- pastikan fungsi JWT claim kita aktif
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role', '');
$$;

-- -------------------------
-- POLICIES: USERS
-- -------------------------
-- User bisa melihat data dirinya sendiri (wajib untuk login flow dan UI profile)
CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT TO authenticated USING (auth.uid() = id);

-- Admin & Director bisa full akses
CREATE POLICY "Admins and Directors full access users" ON public.users
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('admin', 'director'))
WITH CHECK (public.get_auth_role() IN ('admin', 'director'));

-- Staff/Manager butuh melihat tabel users untuk assign guru ke kelas atau membuat user baru?
-- (Jika dibutuhkan, buka akses select, jika tidak biarkan terbatas)
CREATE POLICY "Staff and Managers can view users" ON public.users
FOR SELECT TO authenticated
USING (public.get_auth_role() IN ('staff', 'manager'));


-- -------------------------
-- POLICIES: STUDENTS
-- -------------------------
CREATE POLICY "Admin and Directors full access students" ON public.students
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('admin', 'director'))
WITH CHECK (public.get_auth_role() IN ('admin', 'director'));

CREATE POLICY "Staff and Managers full access students" ON public.students
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('staff', 'manager'))
WITH CHECK (public.get_auth_role() IN ('staff', 'manager'));

-- Guru HANYA melihat murid-murid. Untuk MVP, daripada RLS join tabel rumit dan rekursif,
-- biarkan Guru bisa melihat tabel student, tapi filter di level UI/API, ATAU:
CREATE POLICY "Teachers can view students" ON public.students
FOR SELECT TO authenticated
USING (public.get_auth_role() = 'teacher');

-- Parent HANYA melihat anaknya
CREATE POLICY "Parents can view their children" ON public.students
FOR SELECT TO authenticated
USING (parent_id = auth.uid());


-- -------------------------
-- POLICIES: CLASSES
-- -------------------------
CREATE POLICY "Admin and Directors full access classes" ON public.classes
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('admin', 'director'))
WITH CHECK (public.get_auth_role() IN ('admin', 'director'));

CREATE POLICY "Staff and Managers full access classes" ON public.classes
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('staff', 'manager'))
WITH CHECK (public.get_auth_role() IN ('staff', 'manager'));

CREATE POLICY "Teachers can view classes" ON public.classes
FOR SELECT TO authenticated
USING (public.get_auth_role() = 'teacher');


-- -------------------------
-- POLICIES: CLASS_ENROLLMENTS
-- -------------------------
CREATE POLICY "Admin and Directors full access enrollments" ON public.class_enrollments
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('admin', 'director'))
WITH CHECK (public.get_auth_role() IN ('admin', 'director'));

CREATE POLICY "Staff and Managers full access enrollments" ON public.class_enrollments
FOR ALL TO authenticated
USING (public.get_auth_role() IN ('staff', 'manager'))
WITH CHECK (public.get_auth_role() IN ('staff', 'manager'));

CREATE POLICY "Teachers can view enrollments" ON public.class_enrollments
FOR SELECT TO authenticated
USING (public.get_auth_role() = 'teacher');

CREATE POLICY "Parents can view children enrollments" ON public.class_enrollments
FOR SELECT TO authenticated
USING (public.get_auth_role() = 'parent');
