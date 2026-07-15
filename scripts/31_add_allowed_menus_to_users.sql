-- 31_add_allowed_menus_to_users.sql
-- Add allowed_menus column to users table for granular RBAC

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS allowed_menus text[] DEFAULT '{}'::text[];

-- Set defaults for existing users
-- Menggunakan operator && (overlap) karena roles adalah sebuah array
UPDATE public.users
SET allowed_menus = ARRAY['/dashboard', '/dashboard/students', '/dashboard/attendance', '/dashboard/expenses', '/dashboard/reports', '/dashboard/classes', '/dashboard/users', '/dashboard/parent-hub-manager', '/dashboard/teacher-workspace', '/dashboard/settings']
WHERE (roles && ARRAY['Director', 'Admin', 'Manager', 'director', 'admin', 'manager']) 
AND (allowed_menus IS NULL OR array_length(allowed_menus, 1) IS NULL);

UPDATE public.users
SET allowed_menus = ARRAY['/dashboard', '/dashboard/attendance', '/dashboard/teacher-workspace', '/dashboard/settings']
WHERE (roles && ARRAY['Staff', 'Teacher', 'staff', 'teacher']) 
AND (allowed_menus IS NULL OR array_length(allowed_menus, 1) IS NULL);
