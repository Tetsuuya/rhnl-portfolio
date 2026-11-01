-- Security hardening for the portfolio database.
-- Run this once in your Supabase project's SQL Editor AFTER supabase_schema.sql.
-- It is safe to re-run.
--
-- BEFORE RUNNING:
--   1. Supabase Dashboard → Authentication → Sign In / Providers → turn OFF "Allow new users to sign up".
--   2. Supabase Dashboard → Authentication → Users → copy YOUR admin user's UID.
--   3. Paste that UID in step 1 below where it says PASTE-YOUR-ADMIN-USER-UID-HERE.

-- ============================================================
-- 1. Admin allow-list: only these users can change content or read messages
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- No policies on admin_users: nobody can read or edit it through the API.

INSERT INTO admin_users (user_id)
VALUES ('PASTE-YOUR-ADMIN-USER-UID-HERE')
ON CONFLICT (user_id) DO NOTHING;

-- SECURITY DEFINER lets the check read admin_users even though the table has no API policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================
-- 2. Replace "any logged-in user" write policies with admin-only ones
-- ============================================================

-- projects
DROP POLICY IF EXISTS "Allow authenticated insert on projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update on projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete on projects" ON projects;
DROP POLICY IF EXISTS "Admin insert on projects" ON projects;
DROP POLICY IF EXISTS "Admin update on projects" ON projects;
DROP POLICY IF EXISTS "Admin delete on projects" ON projects;
CREATE POLICY "Admin insert on projects" ON projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update on projects" ON projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete on projects" ON projects FOR DELETE TO authenticated USING (public.is_admin());

-- tech_stack
DROP POLICY IF EXISTS "Allow authenticated insert on tech_stack" ON tech_stack;
DROP POLICY IF EXISTS "Allow authenticated update on tech_stack" ON tech_stack;
DROP POLICY IF EXISTS "Allow authenticated delete on tech_stack" ON tech_stack;
DROP POLICY IF EXISTS "Admin insert on tech_stack" ON tech_stack;
DROP POLICY IF EXISTS "Admin update on tech_stack" ON tech_stack;
DROP POLICY IF EXISTS "Admin delete on tech_stack" ON tech_stack;
CREATE POLICY "Admin insert on tech_stack" ON tech_stack FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update on tech_stack" ON tech_stack FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete on tech_stack" ON tech_stack FOR DELETE TO authenticated USING (public.is_admin());

-- experience
DROP POLICY IF EXISTS "Allow authenticated insert on experience" ON experience;
DROP POLICY IF EXISTS "Allow authenticated update on experience" ON experience;
DROP POLICY IF EXISTS "Allow authenticated delete on experience" ON experience;
DROP POLICY IF EXISTS "Admin insert on experience" ON experience;
DROP POLICY IF EXISTS "Admin update on experience" ON experience;
DROP POLICY IF EXISTS "Admin delete on experience" ON experience;
CREATE POLICY "Admin insert on experience" ON experience FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update on experience" ON experience FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete on experience" ON experience FOR DELETE TO authenticated USING (public.is_admin());

-- contact_messages: anyone may submit, only the admin may read/update/delete
DROP POLICY IF EXISTS "Allow authenticated read on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated update on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated delete on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin read on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin update on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin delete on contact_messages" ON contact_messages;
CREATE POLICY "Admin read on contact_messages" ON contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin update on contact_messages" ON contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete on contact_messages" ON contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- Visitors can only create unread messages (they can't pre-mark them as read)
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON contact_messages;
CREATE POLICY "Allow public insert on contact_messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (read IS NOT TRUE);

-- storage: only the admin can upload, replace or delete project images
DROP POLICY IF EXISTS "Allow authenticated upload on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete on project-images" ON storage.objects;
CREATE POLICY "Admin upload on project-images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "Admin update on project-images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'project-images' AND public.is_admin());
CREATE POLICY "Admin delete on project-images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.is_admin());

-- SVG files can carry scripts, so only raster images may be uploaded
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'project-images';

-- ============================================================
-- 3. Contact form: input limits + anti-spam rate limit
-- ============================================================

-- Same limits as the form. NOT VALID skips checking existing rows, so old messages never block this.
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_name_length;
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_email_format;
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_subject_length;
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_message_length;
ALTER TABLE contact_messages ADD CONSTRAINT contact_name_length
  CHECK (char_length(btrim(name)) BETWEEN 2 AND 80) NOT VALID;
ALTER TABLE contact_messages ADD CONSTRAINT contact_email_format
  CHECK (char_length(email) <= 254 AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$') NOT VALID;
ALTER TABLE contact_messages ADD CONSTRAINT contact_subject_length
  CHECK (char_length(btrim(subject)) BETWEEN 3 AND 120) NOT VALID;
ALTER TABLE contact_messages ADD CONSTRAINT contact_message_length
  CHECK (char_length(btrim(message)) BETWEEN 10 AND 2000) NOT VALID;

-- Limits: 3 messages per email per hour, and 50 messages total per hour (stops floods with random emails)
CREATE OR REPLACE FUNCTION public.enforce_contact_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.created_at := NOW();  -- never trust a client-supplied timestamp
  NEW.read := FALSE;

  IF (
    SELECT COUNT(*) FROM contact_messages
    WHERE lower(email) = lower(NEW.email)
      AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 3 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  IF (
    SELECT COUNT(*) FROM contact_messages
    WHERE created_at > NOW() - INTERVAL '1 hour'
  ) >= 50 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_rate_limit ON contact_messages;
CREATE TRIGGER contact_rate_limit
  BEFORE INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_contact_rate_limit();

CREATE INDEX IF NOT EXISTS contact_messages_email_created_idx
  ON contact_messages (lower(email), created_at DESC);
