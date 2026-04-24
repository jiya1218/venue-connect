-- Add missing RLS policies for seo_pages table
-- This fixes: "new row violates row-level security policy for table \"seo_pages\""

CREATE POLICY IF NOT EXISTS "public_insert_seo_pages" ON seo_pages
FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "public_update_seo_pages" ON seo_pages
FOR UPDATE USING (true) WITH CHECK (true);
