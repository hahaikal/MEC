-- ============================================================
-- Parent Hub Gallery Items
-- ============================================================

-- 1. Create gallery_items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Public can read active items (for parent-hub pages)
CREATE POLICY "gallery_items_public_read" ON public.gallery_items
  FOR SELECT USING (is_active = true);

-- Authenticated users with admin/director role can do everything
CREATE POLICY "gallery_items_admin_all" ON public.gallery_items
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'director')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'director')
    )
  );

-- Teachers can read all items (for dashboard view)
CREATE POLICY "gallery_items_staff_read" ON public.gallery_items
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('teacher')
    )
  );

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_active ON public.gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON public.gallery_items(order_index);

-- 5. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('parent_hub_gallery', 'parent_hub_gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies
-- Public can read
CREATE POLICY "gallery_storage_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'parent_hub_gallery');

-- Admin/Director can upload
CREATE POLICY "gallery_storage_admin_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'parent_hub_gallery'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'director')
    )
  );

-- Admin/Director can update
CREATE POLICY "gallery_storage_admin_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'parent_hub_gallery'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'director')
    )
  );

-- Admin/Director can delete
CREATE POLICY "gallery_storage_admin_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'parent_hub_gallery'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'director')
    )
  );
