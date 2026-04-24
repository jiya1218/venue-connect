ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0 NOT NULL;
CREATE OR REPLACE FUNCTION increment_seo_page_views(page_slug TEXT) RETURNS VOID AS $$ BEGIN UPDATE seo_pages SET view_count = view_count + 1, last_generated = NOW() WHERE slug = page_slug; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TABLE IF NOT EXISTS indexing_queue (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), url TEXT NOT NULL UNIQUE, slug TEXT NOT NULL, status TEXT DEFAULT 'pending', submitted_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS indexing_queue_status_idx ON indexing_queue(status);
ALTER TABLE indexing_queue ENABLE ROW LEVEL SECURITY;
GRANT EXECUTE ON FUNCTION increment_seo_page_views(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_seo_page_views(TEXT) TO authenticated;
