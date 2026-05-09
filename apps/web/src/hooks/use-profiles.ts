import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useZernio } from "@/hooks/use-zernio";
import { sampleProfiles } from "@/lib/data/social-data";
import { getZernioErrorMessage } from "@/lib/zernio-error";
import { useAppStore } from "@/stores/app-store";

export const profileKeys = {
	all: ["profiles"] as const,
	detail: (id: string) => ["profiles", id] as const,
};

/**
 * Hook to fetch all profiles
 */
export function useProfiles() {
	const { zernio, loading, error } = useZernio();
	const { defaultProfileId, setDefaultProfileId } = useAppStore();

	const query = useQuery({
		queryKey: profileKeys.all,
		queryFn: async () => {
			if (loading || !zernio) {
				return { profiles: sampleProfiles };
			}
			const response = await zernio.profiles.listProfiles();
			if (!response.data) {
				throw new Error(getZernioErrorMessage(response.error));
			}
			const profiles = response.data.profiles ?? [];
			return { profiles };
		},
		enabled: true,
	});

	// Auto-set default profile if not set
	useEffect(() => {
		const profiles = query.data?.profiles;
		if (Array.isArray(profiles) && profiles.length && !defaultProfileId) {
			const firstProfile = profiles[0];
			setDefaultProfileId(
				(firstProfile as { _id?: string })._id ??
					(firstProfile as { id: string }).id,
			);
		}
	}, [query.data, defaultProfileId, setDefaultProfileId]);

	return {
		...query,
		isLoading: loading || query.isLoading,
		error: error || query.error,
	};
}

/**
 * Hook to get the current profile ID (from store or first profile)
 */
export function useCurrentProfileId(): string | undefined {
	const { defaultProfileId } = useAppStore();
	const { data } = useProfiles();
	const firstProfile = data?.profiles?.[0];
	if (!firstProfile) return undefined;
	return (
		defaultProfileId ??
		(firstProfile as { _id?: string })._id ??
		(firstProfile as { id: string }).id
	);
}

/**
 * Hook to fetch a single profile
 */
export function useProfile(profileId: string) {
	const { zernio } = useZernio();

	return useQuery({
		queryKey: profileKeys.detail(profileId),
		queryFn: async () => {
			if (!zernio) throw new Error("Zernio not initialized");
			const response = await zernio.profiles.getProfile({
				path: { profileId },
			});
			if (!response.data) {
				throw new Error(getZernioErrorMessage(response.error));
			}
			return response.data;
		},
		enabled: !!profileId && !zernio,
	});
}

/**
 * Hook to create a profile
 */
export function useCreateProfile() {
	const queryClient = useQueryClient();
	const { zernio } = useZernio();

	return useMutation({
		mutationFn: async (data: { name: string; description?: string }) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const response = await zernio.profiles.createProfile({ body: data });
			if (!response.data) {
				throw new Error(getZernioErrorMessage(response.error));
			}
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: profileKeys.all });
		},
	});
}

/**
 * Hook to update a profile
 */
export function useUpdateProfile() {
	const queryClient = useQueryClient();
	const { zernio } = useZernio();

	return useMutation({
		mutationFn: async ({
			profileId,
			...data
		}: {
			profileId: string;
			name?: string;
			timezone?: string;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const response = await zernio.profiles.updateProfile({
				path: { profileId },
				body: data,
			});
			if (!response.data) {
				throw new Error(getZernioErrorMessage(response.error));
			}
			return response.data;
		},
		onSuccess: (_, { profileId }) => {
			queryClient.invalidateQueries({ queryKey: profileKeys.all });
			queryClient.invalidateQueries({
				queryKey: profileKeys.detail(profileId),
			});
		},
	});
}
