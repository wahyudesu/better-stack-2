/**
 * Zernio SDK factory
 *
 * Creates a Zernio SDK client with the user's API key from Supabase.
 * Works in browser context - apiKey is fetched from our API route which
 * uses Clerk auth server-side.
 */

import Zernio from "@zernio/node";

export interface ZernioClientOptions {
	apiKey: string;
}

let cachedClient: Zernio | null = null;
let cachedApiKey: string | null = null;

/**
 * Create a Zernio client with the user's API key.
 * Caches the client instance to avoid re-creation on every call.
 *
 * @param clerkUserId - The Clerk user ID
 * @param apiKey - Optional API key override (for direct passing)
 */
export async function createZernioClient(
	clerkUserId: string,
	apiKey?: string,
): Promise<Zernio> {
	// If apiKey provided directly, use it (skip Supabase lookup)
	if (apiKey) {
		if (cachedClient && cachedApiKey === apiKey) {
			return cachedClient;
		}
		cachedClient = new Zernio({ apiKey });
		cachedApiKey = apiKey;
		return cachedClient;
	}

	// Otherwise fetch from our API route (which uses Clerk server-side auth)
	const response = await fetch("/api/user");
	if (!response.ok) {
		throw new Error("Failed to fetch user data");
	}

	const data = (await response.json()) as { api_key?: string };
	if (!data.api_key) {
		throw new Error(
			"API key not configured. Please add your Zernio API key in settings.",
		);
	}

	if (cachedClient && cachedApiKey === data.api_key) {
		return cachedClient;
	}

	cachedClient = new Zernio({ apiKey: data.api_key });
	cachedApiKey = data.api_key;
	return cachedClient;
}

/**
 * Clear the cached Zernio client.
 * Call this on logout to ensure fresh state.
 */
export function clearZernioCache() {
	cachedClient = null;
	cachedApiKey = null;
}
