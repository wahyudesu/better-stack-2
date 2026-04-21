import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useCurrentProfileId } from "./use-profiles";

export const queueKeys = {
	all: ["queue"] as const,
	upcoming: (profileId?: string) => ["queue", "upcoming", profileId] as const,
};

/**
 * Hook to fetch upcoming scheduled posts (queue)
 */
export function useQueue(profileId?: string) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: queueKeys.upcoming(targetProfileId),
		queryFn: async () => {
			const { data, error } = await api.getQueue(targetProfileId);
			if (error) throw error;
			return data;
		},
		enabled: !!targetProfileId,
	});
}
