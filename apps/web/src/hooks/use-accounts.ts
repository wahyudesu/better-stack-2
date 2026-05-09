import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Zernio } from "@zernio/node";
import { useZernio } from "@/hooks/use-zernio";
import type { SocialAccount } from "@/lib/client";
import { getZernioErrorMessage } from "@/lib/zernio-error";

export const accountKeys = {
	all: ["accounts"] as const,
	list: () => ["accounts", "list"] as const,
};

function convertToSocialAccount(account: {
	_id?: string;
	id?: string;
	platform: string;
	username?: string;
	displayName?: string;
	isActive?: boolean;
	profilePicture?: string;
	profileId?: { _id?: string };
	connectedAt?: string;
}): SocialAccount {
	const createdAt = account.connectedAt || new Date().toISOString();
	return {
		_id: account._id ?? account.id ?? "",
		platform: account.platform,
		username: account.username ?? "",
		displayName: account.displayName,
		isActive: account.isActive ?? true,
		profilePicture: account.profilePicture ?? undefined,
		profileId: account.profileId?._id ?? "",
		createdAt,
		updatedAt: createdAt,
	};
}

async function fetchAccounts(
	zernio: InstanceType<typeof Zernio>,
): Promise<SocialAccount[]> {
	const response = await zernio.accounts.listAccounts();
	if (!response.data) {
		throw new Error(getZernioErrorMessage(response.error));
	}
	return (
		response.data.accounts?.map((account: any) =>
			convertToSocialAccount(account),
		) ?? []
	);
}

async function deleteAccount(
	zernio: InstanceType<typeof Zernio>,
	accountId: string,
) {
	const response = await zernio.accounts.deleteAccount({ path: { accountId } });
	if (!response.data && response.error) {
		throw new Error(getZernioErrorMessage(response.error));
	}
	return response.data;
}

/**
 * Hook to fetch all social accounts
 */
export function useAccounts() {
	const { zernio, loading, error } = useZernio();

	const query = useQuery({
		queryKey: accountKeys.list(),
		queryFn: async () => {
			if (!zernio) return [];
			return fetchAccounts(zernio);
		},
		enabled: !loading && !!zernio,
	});

	return {
		data: { accounts: query.data ?? [] },
		isLoading: loading || query.isFetching,
		error: error || query.error,
	};
}

/**
 * Hook to delete a social account
 */
export function useDeleteAccount() {
	const queryClient = useQueryClient();
	const { zernio } = useZernio();

	return {
		mutateAsync: async (accountId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			await deleteAccount(zernio, accountId);
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
	const { zernio } = useZernio();

	return useQuery({
		queryKey: ["profiles"],
		enabled: !!zernio,
		queryFn: async () => {
			if (!zernio) throw new Error("Zernio not initialized");

			// Get existing profiles
			const listRes = await zernio.profiles.listProfiles();
			if (!listRes.data) throw new Error(getZernioErrorMessage(listRes.error));
			const profiles = listRes.data;

			// If we have one, return the default
			if (Array.isArray(profiles) && profiles.length > 0) {
				const defaultProfile =
					(profiles as Array<{ is_default?: boolean }>).find(
						(p) => p.is_default,
					) || profiles[0];
				return defaultProfile as {
					_id: string;
					name: string;
					is_default?: boolean;
				};
			}

			// Create a default profile
			const createRes = await zernio.profiles.createProfile({
				body: { name: "Default Profile" },
			});
			if (!createRes.data)
				throw new Error(getZernioErrorMessage(createRes.error));
			return createRes.data as {
				_id: string;
				name: string;
				is_default?: boolean;
			};
		},
	});
}

/**
 * Hook to initiate OAuth connection for a social platform
 */
export function useConnectAccount() {
	const { data: profile, isLoading } = useZernioProfile();

	return {
		mutateAsync: async ({
			platform,
			profileId,
		}: {
			platform: string;
			profileId?: string | null;
		}) => {
			if (isLoading || !profile) {
				throw new Error("Profile not ready");
			}

			// Build connect URL with proper profile IDs
			const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
			const redirectUrl = `${baseUrl}/callback`;
			const params = new URLSearchParams({
				platform,
				profileId: (profile as { _id?: string })._id ?? profile._id,
				redirect_url: redirectUrl,
			});
			const connectUrl = `/api/zernio/connect?${params.toString()}`;
			window.location.href = connectUrl;
			return { authUrl: connectUrl };
		},
		isPending: isLoading,
	};
}
