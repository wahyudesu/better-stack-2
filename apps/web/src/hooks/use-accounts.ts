import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SocialAccount } from "@/lib/client";
import { api } from "@/lib/client";
import { useCurrentProfileId } from "./use-profiles";
import { useAuthStore } from "@/stores";

export const accountKeys = {
	all: ["accounts"] as const,
	list: (profileId: string) => ["accounts", "list", profileId] as const,
	health: (profileId: string) => ["accounts", "health", profileId] as const,
	detail: (accountId: string) => ["accounts", "detail", accountId] as const,
};

export interface AccountHealth {
	accountId: string;
	isHealthy: boolean;
	error?: string;
}

// Convert Zernio account to client.ts SocialAccount format
function convertToSocialAccount(account: any): SocialAccount {
	return {
		_id: account._id,
		platform: account.platform,
		username: account.username || account.displayName || "",
		displayName: account.displayName || account.username,
		isActive: account.isActive ?? true,
		profilePicture: account.profilePicture,
		profileId: account.profileId || "",
		createdAt: account.createdAt || new Date().toISOString(),
		updatedAt: account.updatedAt || new Date().toISOString(),
	};
}

/**
 * Hook to fetch all accounts for current user
 */
export function useAccounts(_profileId?: string) {
	return useQuery({
		queryKey: accountKeys.list("local"),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return { accounts: [] };
			}
			const { data, error } = await api.getAccounts();
			if (error) throw error;
			return { accounts: data?.accounts || [] };
		},
		enabled: true,
	});
}

/**
 * Hook to fetch account health status
 */
export function useAccountsHealth(_profileId?: string) {
	return useQuery({
		queryKey: accountKeys.health(_profileId || ""),
		queryFn: async () => {
			return null;
		},
		enabled: false,
	});
}

/**
 * Hook to start OAuth connection flow
 */
export function useConnectAccount() {
	const currentProfileId = useCurrentProfileId();

	return useMutation({
		mutationFn: async ({ platform }: { platform: string }) => {
			const targetProfileId = currentProfileId;
			if (!targetProfileId) throw new Error("No profile selected");

			const redirectUrl = `${window.location.origin}/callback`;
			const { data, error } = await api.getConnectUrl({
				platform,
				profileId: targetProfileId,
			});
			if (error) throw error;
			return data;
		},
	});
}

/**
 * Hook to delete/disconnect an account
 */
export function useDeleteAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (accountId: string) => {
			const { error } = await api.deleteAccount(accountId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
		},
	});
}

/**
 * Hook to get accounts grouped by platform
 */
export function useAccountsByPlatform(profileId?: string) {
	const { data, ...rest } = useAccounts(profileId);

	const accountsByPlatform = data?.accounts?.reduce(
		(acc: Record<string, SocialAccount[]>, account: SocialAccount) => {
			const platform = account.platform;
			if (!acc[platform]) acc[platform] = [];
			acc[platform].push(account);
			return acc;
		},
		{} as Record<string, SocialAccount[]>,
	);

	return { data: accountsByPlatform, accounts: data?.accounts, ...rest };
}
