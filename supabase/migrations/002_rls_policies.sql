-- Migration: Enable RLS on all tables
-- Run after 001_initial_schema.sql
-- Uses Clerk Supabase integration (auth.jwt()->>'sub')

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users: user can only see/edit own row via clerk_id
CREATE POLICY "users_owner_select" ON users FOR SELECT
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub')::text);

CREATE POLICY "users_owner_insert" ON users FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt()->>'sub')::text);

CREATE POLICY "users_owner_update" ON users FOR UPDATE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub')::text);

-- Social accounts: via user->clerk_id lookup
CREATE POLICY "social_accounts_owner_select" ON social_accounts FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "social_accounts_owner_insert" ON social_accounts FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "social_accounts_owner_delete" ON social_accounts FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

-- Posts: via user->clerk_id lookup
CREATE POLICY "posts_owner_select" ON posts FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "posts_owner_insert" ON posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "posts_owner_update" ON posts FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "posts_owner_delete" ON posts FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

-- Media: via user->clerk_id lookup
CREATE POLICY "media_owner_select" ON media FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "media_owner_insert" ON media FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

-- Organizations: via user->clerk_id lookup
CREATE POLICY "organizations_owner_select" ON organizations FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "organizations_owner_insert" ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "organizations_owner_update" ON organizations FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));

CREATE POLICY "organizations_owner_delete" ON organizations FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = (auth.jwt()->>'sub')::text));