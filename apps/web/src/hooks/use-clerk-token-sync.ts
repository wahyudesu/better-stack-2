"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores";

/**
 * Sync Clerk session token to auth store.
 * Token is used for server-side auth (server validates JWT and looks up API key from Convex).
 *
 * Handles race condition where getToken() returns null on first call because Clerk hasn't
 * fully loaded yet. Polls until token is available.
 */
export function useClerkTokenSync() {
	const { isLoaded, isSignedIn, getToken } = useAuth();
	const hasSynced = useRef(false);

	useEffect(() => {
		if (!isLoaded) return;

		// If signed out, clear token and reset sync state
		if (!isSignedIn) {
			useAuthStore.getState().setClerkToken(null);
			hasSynced.current = false;
			return;
		}

		// Poll until we get a valid token (handles Clerk loading race condition)
		const syncToken = async () => {
			try {
				const token = await getToken();
				if (token && token !== useAuthStore.getState().clerkToken) {
					useAuthStore.getState().setClerkToken(token);
					hasSynced.current = true;
				} else if (!token && !hasSynced.current) {
					// Token still null, Clerk might still be loading — retry
					setTimeout(syncToken, 100);
				}
			} catch {
				// getToken threw (e.g., network error) — retry after delay
				setTimeout(syncToken, 1000);
			}
		};

		syncToken();
	}, [isLoaded, isSignedIn, getToken]);
}
