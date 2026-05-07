import { useQueryClient } from "@tanstack/react-query";
import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import type { SocialAccount } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const accountKeys = {
	all: ["accounts"] as const,
	list: () => ["accounts", "list"] as const,
};

// Extended SocialAccount with Convex doc ID for internal use
interface ConvexSocialAccount extends SocialAccount {
	convexId?: string; // Convex document ID for mutations
}

// Convert Convex account to SocialAccount format (matches Zernio structure)
function convertToSocialAccount(account: any): ConvexSocialAccount {
	const isActive = account.status === "active";
	const createdAt = account.createdAt
		? new Date(account.createdAt).toISOString()
		: new Date(account.connectedAt).toISOString();

	return {
		_id: account.accountId, // Zernio's account _id for display
		convexId: account._id, // Convex document ID for mutations
		platform: account.platform,
		username: account.accountName || "",
		displayName: account.accountName || undefined,
		isActive,
		profilePicture: account.avatarUrl || undefined,
		profileId: "",
		createdAt,
		updatedAt: createdAt,
	};
}

// Sync staleness threshold: 2 minutes
const SYNC_STALE_MS = 2 * 60 * 1000;

/**
 * Hook to fetch all social accounts for current user from Convex
 * Auto-syncs from Zernio if data is stale (>2 min since last sync)
 */
export function useAccounts() {
	const apiKey = useAuthStore((s) => s.apiKey);
	const queryClient = useQueryClient();

	const convexAccounts = useQuery(api.socialAccounts.list);
	const userInfoQuery = useQuery(api.users.getUserInfo);
	const syncMutation = useAction(api.socialAccounts.syncFromZernio);

	// Trigger sync on mount - always sync if we have apiKey and accounts is empty
	useEffect(() => {
		if (!apiKey) {
			console.log("[useAccounts] No apiKey, skipping sync");
			return;
		}

		// Sync if: no userInfo yet (loading), OR stale (>2min), OR accounts empty
		const shouldSync =
			!userInfoQuery ||
			!userInfoQuery.lastSyncedAt ||
			Date.now() - userInfoQuery.lastSyncedAt > SYNC_STALE_MS ||
			(convexAccounts !== undefined && convexAccounts.length === 0);

		console.log("[useAccounts] sync check:", {
			hasApiKey: !!apiKey,
			userInfoQuery,
			convexAccountsLen: convexAccounts?.length,
			shouldSync,
		});

		if (shouldSync) {
			console.log("[useAccounts] Triggering sync from Zernio");
			syncMutation({}).catch((e) =>
				console.error("[useAccounts] Sync failed:", e),
			);
		}
	}, [apiKey, userInfoQuery, convexAccounts]);

	// Map Convex accounts to SocialAccount format
	const accounts = convexAccounts
		? convexAccounts.map(convertToSocialAccount)
		: [];

	return {
		data: { accounts },
		isLoading: convexAccounts === undefined && !!apiKey,
		error: null,
	};
}

/**
 * Hook to delete a social account
 */
export function useDeleteAccount() {
	const queryClient = useQueryClient();
	const deleteMutation = useMutation(api.socialAccounts.deleteAccount);

	return {
		mutateAsync: async (accountId: string) => {
			await deleteMutation({ accountId });
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
		},
		isPending: false,
	};
}

export function useAccountsHealth() {
	return { data: null };
}

export function useConnectAccount() {
	return {
		mutateAsync: async (_params: { platform: string }) => {
			return { authUrl: "" };
		},
	};
}
