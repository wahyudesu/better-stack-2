-- Migration: Sync Clerk users to Supabase Auth
-- Optional: Only needed if using Supabase Auth for JWT validation
-- For app-level auth (x-clerk-user-id header), this function is not required
-- but is kept for potential future use cases

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION sync_clerk_user(
  p_clerk_id TEXT,
  p_email TEXT,
  p_full_name TEXT,
  p_avatar_url TEXT,
  p_action TEXT
)
RETURNS void AS $$
BEGIN
  IF p_action = 'upsert' THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      role,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data
    ) VALUES (
      p_clerk_id::uuid,
      '00000000-0000-0000-0000-000000000000'::uuid,
      p_email,
      'authenticated',
      crypt(random()::text, gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object(
        'clerk_id', p_clerk_id,
        'full_name', p_full_name,
        'avatar_url', p_avatar_url
      )
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      updated_at = now();
  ELSIF p_action = 'delete' THEN
    DELETE FROM auth.users WHERE id = p_clerk_id::uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sync_clerk_user TO authenticated;