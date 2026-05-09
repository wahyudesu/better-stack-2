-- Migration: Add organization_memberships table for org-scoped RLS
-- Syncs from Clerk webhooks (organizationMembership.created/deleted)

-- Add unique constraint on organizations.clerk_org_id first (needed for upsert)
ALTER TABLE organizations ADD CONSTRAINT organizations_clerk_org_id_unique UNIQUE (clerk_org_id);

CREATE TABLE IF NOT EXISTS organization_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('org:admin', 'org:member')),
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  UNIQUE (clerk_org_id, clerk_user_id)
);

-- Index for fast lookups by org
CREATE INDEX idx_org_memberships_org_id
  ON organization_memberships(clerk_org_id);

-- Index for fast lookups by user
CREATE INDEX idx_org_memberships_user_id
  ON organization_memberships(clerk_user_id);

ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read memberships (needed for RLS joins)
CREATE POLICY "org_memberships_select" ON organization_memberships FOR SELECT
  TO authenticated
  USING (true);

-- Only admin key can insert/update/delete (webhook handlers use admin client)
CREATE POLICY "org_memberships_admin_modify" ON organization_memberships FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "org_memberships_admin_update" ON organization_memberships FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "org_memberships_admin_delete" ON organization_memberships FOR DELETE
  TO authenticated
  USING (true);
