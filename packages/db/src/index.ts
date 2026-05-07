import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const adminDb = drizzle(
  createClient(supabaseUrl, supabaseServiceKey, {
    dbParams: { schema: 'public' },
  }),
  { schema }
);

export function createUserClient(accessToken: string) {
  return createClient(supabaseUrl, accessToken, {
    auth: { persistSession: false },
  });
}

export { type User, type NewUser } from './schema/users';
export { type SocialAccount, type NewSocialAccount } from './schema/socialAccounts';
export { type Post, type NewPost } from './schema/posts';
export { type Media, type NewMedia } from './schema/media';
export { type Organization, type NewOrganization } from './schema/organizations';