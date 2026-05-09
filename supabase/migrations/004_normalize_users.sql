-- Migration: Normalize users table with FK relationships
-- 1. Create users table ( Clerk ID as PK)
-- 2. Add user_id FK to child tables
-- 3. Remove duplicate clerk_id columns

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Add user_id FK to user_settings
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS user_id UUID;
UPDATE user_settings SET user_id = (
  SELECT id FROM users WHERE users.clerk_id = user_settings.clerk_id
);
ALTER TABLE user_settings ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_settings ADD CONSTRAINT fk_user_settings_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_settings DROP COLUMN IF EXISTS clerk_id;

-- Add user_id FK to social_accounts
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS user_id UUID;
UPDATE social_accounts SET user_id = (
  SELECT id FROM users WHERE users.clerk_id = social_accounts.clerk_id
);
ALTER TABLE social_accounts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE social_accounts ADD CONSTRAINT fk_social_accounts_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE social_accounts DROP COLUMN IF EXISTS clerk_id;

-- Add user_id FK to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID;
UPDATE posts SET user_id = (
  SELECT id FROM users WHERE users.clerk_id = posts.clerk_id
);
ALTER TABLE posts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE posts ADD CONSTRAINT fk_posts_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE posts DROP COLUMN IF EXISTS clerk_id;

-- Add user_id FK to media
ALTER TABLE media ADD COLUMN IF NOT EXISTS user_id UUID;
UPDATE media SET user_id = (
  SELECT id FROM users WHERE users.clerk_id = media.clerk_id
);
ALTER TABLE media ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE media ADD CONSTRAINT fk_media_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE media DROP COLUMN IF EXISTS clerk_id;

-- Update RLS policies to use user_id instead of clerk_id
DROP POLICY IF EXISTS user_settings_owner_select ON user_settings;
DROP POLICY IF EXISTS user_settings_owner_insert ON user_settings;
DROP POLICY IF EXISTS user_settings_owner_update ON user_settings;

CREATE POLICY "user_settings_owner_select" ON user_settings FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "user_settings_owner_insert" ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "user_settings_owner_update" ON user_settings FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS social_accounts_owner_select ON social_accounts;
DROP POLICY IF EXISTS social_accounts_owner_insert ON social_accounts;
DROP POLICY IF EXISTS social_accounts_owner_delete ON social_accounts;

CREATE POLICY "social_accounts_owner_select" ON social_accounts FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "social_accounts_owner_insert" ON social_accounts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "social_accounts_owner_delete" ON social_accounts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS posts_owner_select ON posts;
DROP POLICY IF EXISTS posts_owner_insert ON posts;
DROP POLICY IF EXISTS posts_owner_update ON posts;
DROP POLICY IF EXISTS posts_owner_delete ON posts;

CREATE POLICY "posts_owner_select" ON posts FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "posts_owner_insert" ON posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "posts_owner_update" ON posts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "posts_owner_delete" ON posts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS media_owner_select ON media;
DROP POLICY IF EXISTS media_owner_insert ON media;

CREATE POLICY "media_owner_select" ON media FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "media_owner_insert" ON media FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));
