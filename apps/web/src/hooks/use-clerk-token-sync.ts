"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useAuthStore } from "@/stores";

/**
 * Sync Clerk user + org to Convex and load API key from Convex.
 * API key is stored in Convex users table after Zernio OAuth.
 */
export function useClerkTokenSync() {
	const { user } = useUser();
	const { organization } = useOrganization();
	const setApiKey = useAuthStore((s) => s.setApiKey);

	// Mutations
	const ensureUser = useMutation(api.users.ensureUser);
	const syncOrganization = useMutation(api.organizations.syncFromClerk);

	// Query to get API key from Convex
	const storedApiKey = useQuery(api.users.getApiKey);

	useEffect(() => {
		if (!user) return;

		// Sync user to Convex
		ensureUser({
			email: user?.emailAddresses?.[0]?.emailAddress ?? "",
			displayName: user?.fullName ?? user?.firstName ?? "",
			avatarUrl: user?.imageUrl ?? undefined,
		}).catch((err) => {
			console.error("[useClerkTokenSync] ensureUser failed:", err);
		});

		// Sync org (if user is in one)
		if (organization) {
			syncOrganization({
				orgName: organization.name,
				orgLogo: organization.imageUrl ?? undefined,
			}).catch((err) => {
				console.error("[useClerkTokenSync] syncOrganization failed:", err);
			});
		}
	}, [user, organization, ensureUser, syncOrganization]);

	// Load API key from Convex into auth store
	useEffect(() => {
		if (storedApiKey) {
			setApiKey(storedApiKey);
		}
	}, [storedApiKey, setApiKey]);
}
