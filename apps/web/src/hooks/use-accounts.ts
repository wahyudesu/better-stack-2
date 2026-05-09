import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SocialAccount } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const accountKeys = {
	all: ["accounts"] as const,
	list: () => ["accounts", "list"] as const,
};

interface ApiAccount extends SocialAccount {}

function convertToSocialAccount(account: any): ApiAccount {
	const isActive = account.status === "active";
	const createdAt = account.connectedAt
		? new Date(account.connectedAt).toISOString()
		: new Date().toISOString();

	return {
		_id: account.accountId,
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

async function fetchAccounts(): Promise<ApiAccount[]> {
	const res = await fetch("/api/social-accounts");
	if (!res.ok) throw new Error("Failed to fetch accounts");
	const data = await res.json();
	return Array.isArray(data) ? data.map(convertToSocialAccount) : [];
}

async function deleteAccount(accountId: string) {
	const res = await fetch("/api/social-accounts", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ accountId }),
	});
	if (!res.ok) throw new Error("Failed to delete account");
	return res.json();
}

/**
 * Hook to fetch all social accounts
 */
export function useAccounts() {
	const apiKey = useAuthStore((s) => s.apiKey);
	const _queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: accountKeys.list(),
		queryFn: fetchAccounts,
		enabled: !!apiKey,
	});

	// Trigger sync on mount if no apiKey
	useEffect(() => {
		if (!apiKey) return;
		// Sync if accounts empty
		if (data !== undefined && data.length === 0) {
			fetch("/api/zernio/sync", { method: "POST" }).catch((e) =>
				console.error("[useAccounts] Sync failed:", e),
			);
		}
	}, [apiKey, data]);

	return {
		data: { accounts: data ?? [] },
		isLoading,
		error,
	};
}

/**
 * Hook to delete a social account
 */
export function useDeleteAccount() {
	const queryClient = useQueryClient();

	return {
		mutateAsync: async (accountId: string) => {
			await deleteAccount(accountId);
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
		},
		isPending: false,
	};
}

/**
 * Stub hook - health check not implemented
 */
export function useAccountsHealth() {
	return { data: null };
}

/**
 * Hook to get or create a local profile for the current user
 */
export function useZernioProfile() {
	const apiKey = useAuthStore((s) => s.apiKey);

	return useQuery({
		queryKey: ["profiles"],
		enabled: !!apiKey,
		queryFn: async () => {
			// Get existing profiles
			const listRes = await fetch("/api/profiles");
			if (!listRes.ok) throw new Error("Failed to fetch profiles");
			const profiles = await listRes.json();

			// If we have one, return the default
			if (Array.isArray(profiles) && profiles.length > 0) {
				const defaultProfile =
					profiles.find((p: any) => p.is_default) || profiles[0];
				return defaultProfile as {
					id: string;
					name: string;
					zernio_profile_id: string | null;
				};
			}

			// Create a default profile
			const createRes = await fetch("/api/profiles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "Default Profile", is_default: true }),
			});
			if (!createRes.ok) throw new Error("Failed to create profile");
			return createRes.json() as Promise<{
				id: string;
				name: string;
				zernio_profile_id: string | null;
			}>;
		},
	});
}

/**
 * Hook to initiate OAuth connection for a social platform
 */
export function useConnectAccount() {
	const { data: profile, isLoading } = useZernioProfile();

	return {
		mutateAsync: async ({ platform }: { platform: string }) => {
			if (isLoading || !profile) {
				throw new Error("Profile not ready");
			}
			// Redirect to Zernio OAuth with profileId
			const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
			const redirectUrl = `${baseUrl}/callback`;
			window.location.href = `/api/zernio/connect?platform=${platform}&profileId=${profile.zernio_profile_id || profile.id}&redirect_url=${encodeURIComponent(redirectUrl)}`;
			return {
				authUrl: `/api/zernio/connect?platform=${platform}&profileId=${profile.zernio_profile_id || profile.id}&redirect_url=${encodeURIComponent(redirectUrl)}`,
			};
		},
		isPending: isLoading,
	};
}
