"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores";

/**
 * Sync Clerk user + org to Supabase backend via API routes.
 * Also loads Zernio apiKey from backend and sets in store.
 */
export function useClerkTokenSync() {
	const { user } = useUser();
	const { organization } = useOrganization();
	const loadedRef = useRef(false);

	// Sync user to Supabase via API
	useEffect(() => {
		if (!user) return;

		// Sync user to Supabase auth.users
		// Production: Clerk webhook handles this. Local dev: call sync endpoint.
		fetch("/api/auth/sync", { method: "POST" }).catch((err) => {
			console.error("[useClerkTokenSync] syncUser failed:", err);
		});

		// Sync org (if user is in one)
		if (organization) {
			fetch("/api/organizations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					orgName: organization.name,
					orgLogo: organization.imageUrl ?? undefined,
				}),
			}).catch((err) => {
				console.error("[useClerkTokenSync] syncOrganization failed:", err);
			});
		}

		// Load Zernio apiKey from backend and set in store
		// Use ref to avoid infinite loop from setApiKey dependency
		if (loadedRef.current) return;
		loadedRef.current = true;

		fetch("/api/user")
			.then((r) => r.json())
			.then((data: any) => {
				if (data.api_key) {
					useAuthStore.getState().setApiKey(data.api_key);
				}
			})
			.catch((err) => {
				console.error("[useClerkTokenSync] loadApiKey failed:", err);
			});
	}, [user, organization]);
}
