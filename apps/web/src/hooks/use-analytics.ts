import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const analyticsKeys = {
	all: ["analytics"] as const,
	post: (postId: string) => ["analytics", "post", postId] as const,
};

/**
 * Hook to fetch analytics for a specific post
 */
export function usePostAnalytics(postId: string) {
	return useQuery({
		queryKey: analyticsKeys.post(postId),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return null;
			}
			const { data, error } = await api.getPostAnalytics(postId);
			if (error) throw error;
			return data;
		},
		enabled: !!postId,
	});
}
