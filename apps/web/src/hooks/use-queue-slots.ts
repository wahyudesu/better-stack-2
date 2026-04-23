import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { useCurrentProfileId } from "./use-profiles";

export const queueSlotKeys = {
	all: ["queueSlots"] as const,
	list: (profileId: string) => ["queueSlots", "list", profileId] as const,
	detail: (slotId: string) => ["queueSlots", "detail", slotId] as const,
	next: (profileId: string) => ["queueSlots", "next", profileId] as const,
};

/**
 * Hook to list queue slots
 */
export function useQueueSlots(profileId?: string) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: queueSlotKeys.list(targetProfileId!),
		queryFn: async () => {
			const { data, error } = await api.listQueueSlots(targetProfileId!);
			if (error) throw error;
			return data;
		},
		enabled: !!targetProfileId,
	});
}

/**
 * Hook to get next available queue slot
 */
export function useNextQueueSlot(profileId?: string) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: queueSlotKeys.next(targetProfileId!),
		queryFn: async () => {
			const { data, error } = await api.nextQueueSlot(targetProfileId!);
			if (error) throw error;
			return data;
		},
		enabled: !!targetProfileId,
	});
}

/**
 * Hook to preview queue schedule
 */
export function useQueuePreview(
	profileId?: string,
	params?: { startDate?: string; endDate?: string },
) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: [
			...queueSlotKeys.list(targetProfileId!),
			"preview",
			params,
		] as const,
		queryFn: async () => {
			const { data, error } = await api.previewQueue(targetProfileId!, params);
			if (error) throw error;
			return data;
		},
		enabled: !!targetProfileId,
	});
}

/**
 * Hook to create a queue slot
 */
export function useCreateQueueSlot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: {
			profileId: string;
			dayOfWeek?: number;
			time?: string;
			repeatEnabled?: boolean;
		}) => {
			const { data, error } = await api.createQueueSlot(body);
			if (error) throw error;
			return data;
		},
		onSuccess: (_, { profileId }) => {
			queryClient.invalidateQueries({
				queryKey: queueSlotKeys.list(profileId),
			});
		},
	});
}

/**
 * Hook to update a queue slot
 */
export function useUpdateQueueSlot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			slotId,
			...body
		}: {
			slotId: string;
			dayOfWeek?: number;
			time?: string;
			repeatEnabled?: boolean;
		}) => {
			const { data, error } = await api.updateQueueSlot(slotId, body);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queueSlotKeys.all });
		},
	});
}

/**
 * Hook to delete a queue slot
 */
export function useDeleteQueueSlot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (slotId: string) => {
			const { error } = await api.deleteQueueSlot(slotId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queueSlotKeys.all });
		},
	});
}
