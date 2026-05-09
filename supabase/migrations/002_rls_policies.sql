-- Migration: RLS policies using Clerk JWT (auth.jwt()->>'sub')
-- Follows official Clerk+Supabase integration docs
-- Clerk as third-party auth provider must be enabled in Supabase dashboard

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- User settings
CREATE POLICY "user_settings_owner_select" ON user_settings FOR SELECT
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "user_settings_owner_insert" ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "user_settings_owner_update" ON user_settings FOR UPDATE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

-- Social accounts
CREATE POLICY "social_accounts_owner_select" ON social_accounts FOR SELECT
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "social_accounts_owner_insert" ON social_accounts FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "social_accounts_owner_delete" ON social_accounts FOR DELETE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

-- Posts
CREATE POLICY "posts_owner_select" ON posts FOR SELECT
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "posts_owner_insert" ON posts FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "posts_owner_update" ON posts FOR UPDATE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "posts_owner_delete" ON posts FOR DELETE
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

-- Media
CREATE POLICY "media_owner_select" ON media FOR SELECT
  TO authenticated
  USING (clerk_id = (auth.jwt()->>'sub'));

CREATE POLICY "media_owner_insert" ON media FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt()->>'sub'));

-- Organizations: user must be a member of the org (via membership table)
-- This replaces the old clerk_id = jwt.sub check which only worked for personal orgs
CREATE POLICY "organizations_member_select" ON organizations FOR SELECT
  TO authenticated
  USING (
    clerk_org_id IN (
      SELECT DISTINCT clerk_org_id
      FROM organization_memberships
      WHERE clerk_user_id = (auth.jwt()->>'sub')
    )
  );

CREATE POLICY "organizations_member_insert" ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Webhooks handle via admin client; allow for now

CREATE POLICY "organizations_member_update" ON organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_memberships om
      WHERE om.clerk_org_id = organizations.clerk_org_id
      AND om.clerk_user_id = (auth.jwt()->>'sub')
      AND om.role = 'org:admin'
    )
  );

CREATE POLICY "organizations_member_delete" ON organizations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_memberships om
      WHERE om.clerk_org_id = organizations.clerk_org_id
      AND om.clerk_user_id = (auth.jwt()->>'sub')
      AND om.role = 'org:admin'
    )
  );