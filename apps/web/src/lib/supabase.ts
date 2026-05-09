import { auth } from "@clerk/nextjs/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client - uses admin key (bypasses RLS).
 * Auth handled by Clerk middleware, no need for RLS here.
 */
export function createServerSupabaseClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SECRET_KEY!,
	);
}

/**
 * Client-side Supabase client - requires access token from Clerk.
 * Used only in client components with valid Clerk session.
 */
export function createClerkSupabaseClient(accessToken: string | null) {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			async accessToken() {
				return accessToken;
			},
		},
	);
}

/**
 * Admin client for internal operations.
 * BYPASSES RLS - uses secret key (sb_secret_xxx).
 * Used for: webhook handlers, cron jobs, admin operations.
 */
export function createAdminClient(): SupabaseClient {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SECRET_KEY!,
	);
}
