-- 1. Buat Function untuk meng-handle user baru
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email), 
    'admin', -- Default role, bisa diubah nanti
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$;

-- 2. Hapus trigger lama jika ada untuk menghindari duplikat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Pasang Trigger ke tabel auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. BACKFILL: Masukkan user yang sudah terlanjur register tapi belum ada di public.users
INSERT INTO public.users (id, email, full_name, role, is_active)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email), 
  'admin', 
  true
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.users.id);

-- 5. Pastikan RLS Policies mengizinkan akses (Opsional tapi direkomendasikan)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Izinkan user melihat profil mereka sendiri
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Izinkan admin/staff melihat semua profil (untuk keperluan dashboard)
-- Asumsi sederhana: semua user yang login boleh melihat list user (sesuaikan dengan kebutuhan production nanti)
CREATE POLICY "Authenticated users can view all profiles" 
ON public.users FOR SELECT 
TO authenticated 
USING (true);

-- Izinkan Trigger (Service Role) melakukan insert (biasanya otomatis, tapi untuk kepastian)
CREATE POLICY "Service role can insert users" 
ON public.users FOR INSERT 
WITH CHECK (true);