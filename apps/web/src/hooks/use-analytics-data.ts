import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useAuthStore } from "@/stores";

export interface AnalyticsFilters {
	accountId: string;
	platform?: string;
	startDate?: string;
	endDate?: string;
	metric?: string;
}

export const analyticsDataKeys = {
	overview: (filters: AnalyticsFilters) =>
		[
			"analytics",
			"overview",
			filters.accountId,
			filters.platform,
			filters.startDate,
			filters.endDate,
		] as const,
	dailyMetrics: (filters: AnalyticsFilters) =>
		[
			"analytics",
			"daily",
			filters.accountId,
			filters.metric,
			filters.startDate,
			filters.endDate,
		] as const,
	demographics: (accountId: string, platform: string) =>
		["analytics", "demographics", accountId, platform] as const,
	hourlyEngagement: (accountId: string) =>
		["analytics", "hourly", accountId] as const,
	weeklyPerformance: (accountId: string) =>
		["analytics", "weekly", accountId] as const,
	platformPerformance: (accountId: string) =>
		["analytics", "platform", accountId] as const,
	contentTypes: (accountId: string) =>
		["analytics", "content-types", accountId] as const,
	topPosts: (filters: AnalyticsFilters) =>
		[
			"analytics",
			"top-posts",
			filters.accountId,
			filters.startDate,
			filters.endDate,
		] as const,
};

const STALE_TIMES = {
	overview: 5 * 60 * 1000,
	dailyMetrics: 5 * 60 * 1000,
	demographics: 30 * 60 * 1000,
	hourlyEngagement: 15 * 60 * 1000,
	weeklyPerformance: 15 * 60 * 1000,
	platformPerformance: 10 * 60 * 1000,
	contentTypes: 15 * 60 * 1000,
	topPosts: 5 * 60 * 1000,
} as const;

const SYNC_INTERVALS = {
	overview: 5 * 60 * 1000,
	dailyMetrics: 5 * 60 * 1000,
	demographics: 0,
	hourlyEngagement: 0,
	weeklyPerformance: 0,
	platformPerformance: 0,
	contentTypes: 0,
	topPosts: 5 * 60 * 1000,
} as const;

interface UseAnalyticsOptions {
	staleOnly?: boolean;
}

export function useAnalyticsOverview(
	filters: AnalyticsFilters,
	options: UseAnalyticsOptions = {},
) {
	return useQuery({
		queryKey: analyticsDataKeys.overview(filters),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return null;
			}
			const { data, error } = await api.getAccountAnalytics({
				accountId: filters.accountId,
				startDate: filters.startDate,
				endDate: filters.endDate,
			});
			if (error) throw error;
			return data;
		},
		staleTime: STALE_TIMES.overview,
		refetchInterval: options.staleOnly ? undefined : SYNC_INTERVALS.overview,
		enabled: !!filters.accountId,
	});
}

export function useDailyMetrics(
	filters: AnalyticsFilters,
	options: UseAnalyticsOptions = {},
) {
	return useQuery({
		queryKey: analyticsDataKeys.dailyMetrics(filters),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return [];
			}
			const { data, error } = await api.getDailyMetrics({
				accountId: filters.accountId,
				metric: filters.metric,
				startDate: filters.startDate,
				endDate: filters.endDate,
			});
			if (error) throw error;
			return data?.metrics ?? [];
		},
		staleTime: STALE_TIMES.dailyMetrics,
		refetchInterval: options.staleOnly
			? undefined
			: SYNC_INTERVALS.dailyMetrics,
		enabled: !!filters.accountId,
	});
}

export function useInstagramDemographics(accountId: string) {
	return useQuery({
		queryKey: analyticsDataKeys.demographics(accountId, "instagram"),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return null;
			}
			const { data, error } = await api.getInstagramDemographics(accountId);
			if (error) throw error;
			return data;
		},
		staleTime: STALE_TIMES.demographics,
		refetchInterval: SYNC_INTERVALS.demographics,
		enabled: !!accountId,
	});
}

export function useBestTime(accountId: string) {
	return useQuery({
		queryKey: analyticsDataKeys.hourlyEngagement(accountId),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return null;
			}
			const { data, error } = await api.getBestTime(accountId);
			if (error) throw error;
			return data;
		},
		staleTime: STALE_TIMES.hourlyEngagement,
		refetchInterval: SYNC_INTERVALS.hourlyEngagement,
		enabled: !!accountId,
	});
}

export function useTopPosts(
	filters: AnalyticsFilters,
	options: UseAnalyticsOptions = {},
) {
	return useQuery({
		queryKey: analyticsDataKeys.topPosts(filters),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return null;
			}
			const { data, error } = await api.getPostTimeline({
				accountId: filters.accountId,
				startDate: filters.startDate,
				endDate: filters.endDate,
			});
			if (error) throw error;
			return data;
		},
		staleTime: STALE_TIMES.topPosts,
		refetchInterval: options.staleOnly ? undefined : SYNC_INTERVALS.topPosts,
		enabled: !!filters.accountId,
	});
}

export function useContentTypePerformance(accountId: string) {
	return useQuery({
		queryKey: analyticsDataKeys.contentTypes(accountId),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return null;
			}
			const { data, error } = await api.getContentDecay(accountId);
			if (error) throw error;
			return data;
		},
		staleTime: STALE_TIMES.contentTypes,
		refetchInterval: SYNC_INTERVALS.contentTypes,
		enabled: !!accountId,
	});
}
