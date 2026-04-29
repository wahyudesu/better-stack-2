import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const automationKeys = {
	sequences: (status?: string) => ["automation", "sequences", status] as const,
	sequence: (sequenceId: string) =>
		["automation", "sequence", sequenceId] as const,
	broadcasts: (accountId: string) =>
		["automation", "broadcasts", accountId] as const,
};

const STALE_TIME = 60 * 1000;

export function useSequences(status?: string) {
	return useQuery({
		queryKey: automationKeys.sequences(status),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return [];
			}
			const { data, error } = await api.listSequences({ status });
			if (error) throw error;
			return data?.sequences ?? [];
		},
		staleTime: STALE_TIME,
		enabled: true,
	});
}

export function useCreateSequence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: { name: string; steps: any[] }) => {
			const { data, error } = await api.createSequence(body);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
		},
	});
}

export function useUpdateSequence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			sequenceId,
			...body
		}: {
			sequenceId: string;
			name?: string;
			steps?: any[];
		}) => {
			const { data, error } = await api.updateSequence(sequenceId, body);
			if (error) throw error;
			return data;
		},
		onSuccess: (_, { sequenceId }) => {
			queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
			queryClient.invalidateQueries({
				queryKey: automationKeys.sequence(sequenceId),
			});
		},
	});
}

export function useDeleteSequence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sequenceId: string) => {
			const { error } = await api.deleteSequence(sequenceId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
		},
	});
}

export function useToggleSequence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			sequenceId,
			enabled,
		}: {
			sequenceId: string;
			enabled: boolean;
		}) => {
			if (enabled) {
				const { data, error } = await api.activateSequence(sequenceId);
				if (error) throw error;
				return data;
			} else {
				const { data, error } = await api.pauseSequence(sequenceId);
				if (error) throw error;
				return data;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
		},
	});
}

export function useBroadcasts(accountId: string) {
	return useQuery({
		queryKey: automationKeys.broadcasts(accountId),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return [];
			}
			const { data, error } = await api.listBroadcasts(accountId);
			if (error) throw error;
			return data?.broadcasts ?? [];
		},
		staleTime: STALE_TIME,
		enabled: !!accountId,
	});
}
