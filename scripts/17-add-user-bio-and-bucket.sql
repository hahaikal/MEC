-- 17-add-user-bio-and-bucket.sql
-- Add bio column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_pictures', 'profile_pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile_pictures
-- Public can read
CREATE POLICY "profile_pictures_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile_pictures');

-- Authenticated users can upload their own profile pictures
-- or admins can upload for anyone
CREATE POLICY "profile_pictures_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'profile_pictures'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "profile_pictures_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'profile_pictures'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "profile_pictures_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile_pictures'
    AND auth.role() = 'authenticated'
  );
