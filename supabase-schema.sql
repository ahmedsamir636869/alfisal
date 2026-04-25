-- ============================================================================
-- Alfisal CMS Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- ── Site Content Table ──────────────────────────────────────────────────────
-- Stores all text content blocks for the website
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'url', 'email', 'phone')),
  label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- ── Site Images Table ───────────────────────────────────────────────────────
-- Stores image references (URLs and metadata)
CREATE TABLE IF NOT EXISTS public.site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_site_content_section ON public.site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_images_section ON public.site_images(section);

-- ── Enable RLS ──────────────────────────────────────────────────────────────
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ────────────────────────────────────────────────────────────
-- Public read access (anyone can read content for the website)
CREATE POLICY "Allow public read on site_content"
  ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read on site_images"
  ON public.site_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert/update/delete (admin users)
CREATE POLICY "Allow authenticated insert on site_content"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on site_content"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on site_content"
  ON public.site_content
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on site_images"
  ON public.site_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on site_images"
  ON public.site_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on site_images"
  ON public.site_images
  FOR DELETE
  TO authenticated
  USING (true);

-- ── Storage Bucket ──────────────────────────────────────────────────────────
-- Create storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
CREATE POLICY "Allow public read on site-images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated upload on site-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated update on site-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated delete on site-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-images');
