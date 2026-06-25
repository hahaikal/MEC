-- Migration 21: Update RLS Policies for Array Roles

-- 1. Create a helper function to check roles
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

-- Note: We drop the old get_auth_role to ensure we catch any dangling references (or we can leave it returning NULL).
-- Let's leave it for now but we will replace its usage.

-- ==========================================
-- USERS POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins and Directors full access users" ON public.users;
DROP POLICY IF EXISTS "Staff and Managers can view users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins and Directors full access users" ON public.users
FOR ALL TO authenticated
USING (public.has_role('Admin') OR public.has_role('Director'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director'));

CREATE POLICY "Staff and Managers can view users" ON public.users
FOR SELECT TO authenticated
USING (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'));


-- ==========================================
-- STUDENTS POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Admin and Directors full access students" ON public.students;
DROP POLICY IF EXISTS "Staff and Managers full access students" ON public.students;
DROP POLICY IF EXISTS "Teachers can view students" ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;

CREATE POLICY "Admin and Directors full access students" ON public.students
FOR ALL TO authenticated
USING (public.has_role('Admin') OR public.has_role('Director'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director'));

CREATE POLICY "Staff and Managers full access students" ON public.students
FOR ALL TO authenticated
USING (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'))
WITH CHECK (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'));

CREATE POLICY "Teachers can view students" ON public.students
FOR SELECT TO authenticated
USING (public.has_role('Teacher'));

CREATE POLICY "Parents can view their children" ON public.students
FOR SELECT TO authenticated
USING (parent_id = auth.uid());


-- ==========================================
-- CLASSES POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Admin and Directors full access classes" ON public.classes;
DROP POLICY IF EXISTS "Staff and Managers full access classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can view classes" ON public.classes;

CREATE POLICY "Admin and Directors full access classes" ON public.classes
FOR ALL TO authenticated
USING (public.has_role('Admin') OR public.has_role('Director'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director'));

CREATE POLICY "Staff and Managers full access classes" ON public.classes
FOR ALL TO authenticated
USING (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'))
WITH CHECK (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'));

CREATE POLICY "Teachers can view classes" ON public.classes
FOR SELECT TO authenticated
USING (public.has_role('Teacher'));


-- ==========================================
-- CLASS ENROLLMENTS POLICIES
-- ==========================================
DROP POLICY IF EXISTS "Admin and Directors full access enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Staff and Managers full access enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Teachers can view enrollments" ON public.class_enrollments;
DROP POLICY IF EXISTS "Parents can view children enrollments" ON public.class_enrollments;

CREATE POLICY "Admin and Directors full access enrollments" ON public.class_enrollments
FOR ALL TO authenticated
USING (public.has_role('Admin') OR public.has_role('Director'))
WITH CHECK (public.has_role('Admin') OR public.has_role('Director'));

CREATE POLICY "Staff and Managers full access enrollments" ON public.class_enrollments
FOR ALL TO authenticated
USING (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'))
WITH CHECK (public.has_role('Staff') OR public.has_role('Manager') OR public.has_role('Principal') OR public.has_role('Head of Department'));

CREATE POLICY "Teachers can view enrollments" ON public.class_enrollments
FOR SELECT TO authenticated
USING (public.has_role('Teacher'));

CREATE POLICY "Parents can view children enrollments" ON public.class_enrollments
FOR SELECT TO authenticated
USING (public.has_role('Parent') OR public.has_role('parent'));

-- Note: Other tables like attendance_logs, gallery_items, etc. might need updates if they rely on public.get_auth_role().
-- In this MVP, we will update them as needed. The most critical ones are covered here.
