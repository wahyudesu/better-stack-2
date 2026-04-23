import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SocialAccount } from "@/lib/client";
import { api } from "@/lib/client";
import { useCurrentProfileId } from "./use-profiles";

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

/**
 * Hook to fetch all accounts for a profile
 */
export function useAccounts(profileId?: string) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: accountKeys.list(targetProfileId || ""),
		queryFn: async () => {
			const { data, error } = await api.getAccounts(targetProfileId);
			if (error) throw error;
			return data;
		},
		enabled: !!targetProfileId,
	});
}

/**
 * Hook to fetch account health status
 */
export function useAccountsHealth(profileId?: string) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: accountKeys.health(targetProfileId || ""),
		queryFn: async () => {
			const { data, error } = await api.getAccountsHealth(targetProfileId);
			if (error) throw error;
			return data ?? [];
		},
		enabled: !!targetProfileId,
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
			const { data, error } = await api.getConnectUrl(
				platform,
				targetProfileId,
				redirectUrl,
				true,
			);
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

/**
 * Hook to fetch usage stats
 */
export function useUsageStats() {
	return useQuery({
		queryKey: ["usage", "stats"],
		queryFn: async () => {
			const { data, error } = await api.getUsageStats();
			if (error) throw error;
			return data;
		},
	});
}
