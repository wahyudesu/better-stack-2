ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_owner" ON users FOR ALL
  USING (clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text);

CREATE POLICY "social_accounts_owner" ON social_accounts FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text));

CREATE POLICY "posts_owner" ON posts FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text));

CREATE POLICY "media_owner" ON media FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text));

CREATE POLICY "organizations_owner" ON organizations FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text));