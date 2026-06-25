-- 1. Mengubah fungsi has_role agar mengecek tabel public.users secara langsung,
-- bukan dari sesi JWT yang bisa kedaluwarsa. SECURITY DEFINER digunakan agar fungsi ini 
-- bisa menembus RLS-nya sendiri tanpa error (infinite loop).
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER 
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role_name = ANY(roles)
  );
$$;

-- 2. Pastikan data 'roles' untuk admin dan user lama disinkronkan ke auth.users
-- (Sebagai backup ganda agar dashboard Next.js juga langsung tahu rolenya)
UPDATE auth.users au
SET raw_user_meta_data = jsonb_set(
  COALESCE(au.raw_user_meta_data, '{}'::jsonb),
  '{roles}',
  to_jsonb(pu.roles)
)
FROM public.users pu
WHERE au.id = pu.id;
