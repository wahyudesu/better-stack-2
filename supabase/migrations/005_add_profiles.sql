-- Migration: Add profiles table for grouping social accounts
-- A profile belongs to a user (clerk_id) and groups multiple social accounts

CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL,
  zernio_profile_id TEXT,
  name TEXT NOT NULL DEFAULT 'Default Profile',
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

-- Add profile_id to social_accounts
ALTER TABLE social_accounts ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_profile_id ON social_accounts(profile_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_clerk_zernio ON profiles(clerk_id, zernio_profile_id) WHERE zernio_profile_id IS NOT NULL;

-- Ensure only one default profile per user
CREATE OR REPLACE FUNCTION ensure_single_default()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE profiles SET is_default = FALSE WHERE clerk_id = NEW.clerk_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_default_profile
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default();

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_owner_select" ON profiles FOR SELECT
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "profiles_owner_insert" ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "profiles_owner_delete" ON profiles FOR DELETE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));