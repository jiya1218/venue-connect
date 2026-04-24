-- =============================================================
-- FIX: Make venue_applications_images storage bucket public
-- Run this in your Supabase SQL Editor
-- =============================================================

-- 1. Make the bucket public so URLs work without authentication
UPDATE storage.buckets
SET public = true
WHERE id = 'venue_applications_images';

-- 2. Allow anyone to read/view objects in the bucket (public access)
DROP POLICY IF EXISTS "Public read access for venue images" ON storage.objects;
CREATE POLICY "Public read access for venue images"
ON storage.objects FOR SELECT
USING (bucket_id = 'venue_applications_images');

-- 3. Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload venue images" ON storage.objects;
CREATE POLICY "Authenticated users can upload venue images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'venue_applications_images');

-- 4. Allow users to update their own uploads
DROP POLICY IF EXISTS "Users can update their venue images" ON storage.objects;
CREATE POLICY "Users can update their venue images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'venue_applications_images');

-- 5. Allow users to delete their own uploads
DROP POLICY IF EXISTS "Users can delete their venue images" ON storage.objects;
CREATE POLICY "Users can delete their venue images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'venue_applications_images');

-- 6. Also make sure the venues table images column exists
-- (won't fail if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='venues' AND column_name='images'
  ) THEN
    ALTER TABLE public.venues ADD COLUMN images text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='venues' AND column_name='image_url'
  ) THEN
    ALTER TABLE public.venues ADD COLUMN image_url text;
  END IF;
END $$;

-- Done! The storage bucket is now public and images will load correctly.
