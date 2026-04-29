import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const usageKeys = {
	all: ["usage"] as const,
	stats: ["usage", "stats"] as const,
};

/**
 * Hook to fetch usage stats (limits and current usage)
 */
export function useUsageStats() {
	return useQuery({
		queryKey: usageKeys.stats,
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return {
					planName: "Unknown",
					usage: { uploads: 0, profiles: 0 },
					limits: { uploads: 0, profiles: 0 },
				};
			}
			const { data, error } = await api.getUsageStats();
			if (error) throw error;
			return data;
		},
		enabled: true,
	});
}
