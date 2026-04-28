"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";

/**
 * Sync Clerk session token to auth store.
 * Token is used for server-side auth (server validates JWT and looks up API key from Convex).
 */
export function useClerkTokenSync() {
	const { isLoaded, getToken } = useAuth();

	useEffect(() => {
		if (!isLoaded) return;

		// Get Clerk session token and sync to store
		getToken().then((token) => {
			if (token) {
				useAuthStore.getState().setClerkToken(token);
			}
		});
	}, [isLoaded, getToken]);
}
