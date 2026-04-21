import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";

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
			const { data, error } = await api.getUsageStats();
			if (error) throw error;
			return data;
		},
		enabled: true,
	});
}
