import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// Clerk token provider for server-side Supabase client
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const token = await auth().getToken();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return token;
      },
    }
  );
}

// For client-side usage (in API routes with auth)
export function createClerkSupabaseClient(sessionToken: string | null): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return sessionToken;
      },
    }
  );
}

// Admin client for internal operations (bypasses RLS)
export function createAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}