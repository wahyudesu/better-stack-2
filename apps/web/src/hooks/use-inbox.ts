import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getMockMessages,
	mockComments,
	mockConversations,
	mockReviews,
} from "@/data/inbox-mock";
import { api } from "@/lib/client";
import { useAuthStore } from "@/stores";

export const inboxKeys = {
	conversations: (accountId?: string, platform?: string) =>
		["inbox", "conversations", accountId, platform] as const,
	conversation: (conversationId: string) =>
		["inbox", "conversation", conversationId] as const,
	messages: (conversationId: string, page?: number) =>
		["inbox", "messages", conversationId, page] as const,
	comments: (accountId?: string) => ["inbox", "comments", accountId] as const,
	reviews: (accountId?: string) => ["inbox", "reviews", accountId] as const,
};

const STALE_TIME = 30 * 1000;
const POLLING_INTERVAL = 15 * 1000;
const STALE_TIME_SLOW = 5 * 60 * 1000;

export function useConversations(accountId?: string, platform?: string) {
	return useQuery({
		queryKey: inboxKeys.conversations(accountId, platform),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return mockConversations;
			}
			const { data, error } = await api.listConversations({
				accountId,
				platform,
				limit: 50,
			});
			if (error) throw error;
			return data?.conversations ?? [];
		},
		staleTime: STALE_TIME,
		refetchInterval: POLLING_INTERVAL,
		enabled: true,
	});
}

export function useConversation(conversationId: string | null) {
	return useQuery({
		queryKey: inboxKeys.conversation(conversationId ?? ""),
		queryFn: async () => {
			if (!conversationId) return null;
			const { data, error } = await api.getConversation(conversationId);
			if (error) throw error;
			return data;
		},
		staleTime: STALE_TIME,
		enabled: !!conversationId,
	});
}

export function useMessages(conversationId: string | null) {
	return useQuery({
		queryKey: inboxKeys.messages(conversationId ?? ""),
		queryFn: async () => {
			if (!conversationId) return [];
			if (!useAuthStore.getState().clerkToken) {
				return getMockMessages(conversationId);
			}
			const { data, error } = await api.listMessages(conversationId, {
				limit: 50,
			});
			if (error) throw error;
			return data?.messages ?? [];
		},
		staleTime: STALE_TIME,
		refetchInterval: POLLING_INTERVAL,
		enabled: !!conversationId,
	});
}

export function useSendMessage(conversationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (text: string) => {
			const { data, error } = await api.sendMessage(conversationId, { text });
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: inboxKeys.messages(conversationId),
			});
		},
	});
}

export function useMarkAsRead(conversationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { error } = await api.markAsRead(conversationId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: inboxKeys.conversations(),
			});
		},
	});
}

export function useComments(accountId?: string) {
	return useQuery({
		queryKey: inboxKeys.comments(accountId),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return mockComments;
			}
			const { data, error } = await api.listComments({ accountId });
			if (error) throw error;
			return data?.comments ?? [];
		},
		staleTime: STALE_TIME_SLOW,
		enabled: true,
	});
}

export function useHideComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			commentId,
		}: {
			postId: string;
			commentId: string;
		}) => {
			const { error } = await api.hideComment(postId, commentId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: inboxKeys.comments() });
		},
	});
}

export function usePrivateReply() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			commentId,
			text,
		}: {
			postId: string;
			commentId: string;
			text: string;
		}) => {
			const { data, error } = await api.privateReply(postId, commentId, {
				text,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: inboxKeys.comments() });
		},
	});
}

export function useReviews(accountId?: string) {
	return useQuery({
		queryKey: inboxKeys.reviews(accountId),
		queryFn: async () => {
			if (!useAuthStore.getState().clerkToken) {
				return mockReviews;
			}
			const { data, error } = await api.listReviews({ accountId });
			if (error) throw error;
			return data?.reviews ?? [];
		},
		staleTime: STALE_TIME_SLOW,
		enabled: true,
	});
}
