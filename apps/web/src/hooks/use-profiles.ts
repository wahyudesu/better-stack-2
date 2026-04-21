import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "@/lib/client";
import { useAppStore } from "@/stores";

export const profileKeys = {
	all: ["profiles"] as const,
	detail: (id: string) => ["profiles", id] as const,
};

/**
 * Hook to fetch all profiles
 */
export function useProfiles() {
	const { defaultProfileId, setDefaultProfileId } = useAppStore();

	const query = useQuery({
		queryKey: profileKeys.all,
		queryFn: async () => {
			const { data, error } = await api.getProfiles();
			if (error) throw error;
			return data;
		},
		enabled: true,
	});

	// Auto-set default profile if not set
	useEffect(() => {
		if (query.data?.profiles?.length && !defaultProfileId) {
			setDefaultProfileId(query.data.profiles[0]._id);
		}
	}, [query.data, defaultProfileId, setDefaultProfileId]);

	return query;
}

/**
 * Hook to get the current profile ID (from store or first profile)
 */
export function useCurrentProfileId(): string | undefined {
	const { defaultProfileId } = useAppStore();
	const { data } = useProfiles();
	return defaultProfileId || data?.profiles?.[0]?._id;
}

/**
 * Hook to fetch a single profile
 */
export function useProfile(profileId: string) {
	return useQuery({
		queryKey: profileKeys.detail(profileId),
		queryFn: async () => {
			const { data, error } = await api.getProfile(profileId);
			if (error) throw error;
			return data;
		},
		enabled: !!profileId,
	});
}

/**
 * Hook to create a profile
 */
export function useCreateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { name: string; description?: string }) => {
			const { data: profile, error } = await api.createProfile(data);
			if (error) throw error;
			return profile;
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

	return useMutation({
		mutationFn: async ({
			profileId,
			...data
		}: {
			profileId: string;
			name?: string;
			timezone?: string;
		}) => {
			const { data: profile, error } = await api.updateProfile(profileId, data);
			if (error) throw error;
			return profile;
		},
		onSuccess: (_, { profileId }) => {
			queryClient.invalidateQueries({ queryKey: profileKeys.all });
			queryClient.invalidateQueries({
				queryKey: profileKeys.detail(profileId),
			});
		},
	});
}
