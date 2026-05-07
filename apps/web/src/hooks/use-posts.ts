import { useQueryClient } from "@tanstack/react-query";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Post } from "@/lib/client";

export interface CreatePostBody {
	profileId: string;
	content: string;
	socialAccountIds: string[];
	scheduledAt?: string;
	media?: Array<{ url: string; type?: string; altText?: string }>;
	thread?: Array<{ text: string; media?: Array<{ url: string }> }>;
}

export const postKeys = {
	all: ["posts"] as const,
	list: () => ["posts", "list"] as const,
	detail: (postId: string) => ["posts", "detail", postId] as const,
	queue: () => ["posts", "queue"] as const,
};

// Convert Convex post to Post format
function convertToPost(post: any): Post {
	return {
		_id: post._id,
		text: post.text || post.content,
		platforms: post.platforms || [],
		status: post.status || "draft",
		scheduledAt: post.scheduledAt,
		publishedAt: post.publishedAt,
		media: post.mediaUrls?.map((url: string) => ({ url, type: "image" as const })),
		mediaItems: post.mediaUrls?.map((url: string) => ({ url })),
		profileId: "",
		socialAccountIds: post.accountIds || [],
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
	};
}

// Sync staleness threshold: 2 minutes
const SYNC_STALE_MS = 2 * 60 * 1000;

/**
 * Hook to fetch all posts from Convex
 */
export function usePosts() {
	const convexPosts = useQuery(api.posts.list);

	const posts = convexPosts ? convexPosts.map(convertToPost) : [];

	return {
		data: { posts },
		isLoading: convexPosts === undefined,
		error: null,
	};
}

/**
 * Hook to create a new post (writes to Zernio then stores in Convex)
 */
export function useCreatePost() {
	const queryClient = useQueryClient();
	const createAction = useAction(api.posts.createPostToZernio);

	return {
		mutateAsync: async (params: {
			text: string;
			platforms: string[];
			scheduledAt?: number;
			mediaUrls?: string[];
			socialAccountIds?: string[];
			profileId?: string;
		}) => {
			const result = await createAction({
				text: params.text,
				platforms: params.platforms,
				scheduledAt: params.scheduledAt,
				mediaUrls: params.mediaUrls || [],
				socialAccountIds: params.socialAccountIds || [],
				profileId: params.profileId,
			});
			queryClient.invalidateQueries({ queryKey: postKeys.all });
			return result;
		},
	};
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
	const queryClient = useQueryClient();
	const deleteMutation = useAction(api.posts.deletePostToZernio);

	return {
		mutateAsync: async (postId: string) => {
			await deleteMutation({ postId });
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
		mutate: async (postId: string, callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
			try {
				await deleteMutation({ postId });
				queryClient.invalidateQueries({ queryKey: postKeys.all });
				callbacks?.onSuccess?.();
			} catch (err) {
				callbacks?.onError?.(err as Error);
			}
		},
	};
}

// Placeholder
export function useQueue() {
	return { data: null };
}

export function useQueueSlots() {
	return { data: [] };
}

export function useEditPost() {
	return { mutateAsync: async () => {}, isPending: false, mutate: async () => {} };
}

export function useUpdatePost() {
	return {
		mutateAsync: async (params: object) => ({ success: true }),
		mutate: async (_params: object, callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
			callbacks?.onSuccess?.();
		},
		isPending: false,
	};
}

export function useRetryPost() {
	return {
		mutateAsync: async () => ({}),
		mutate: async (_id: string, callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
			callbacks?.onSuccess?.();
		},
		isPending: false,
	};
}

export function useUnpublishPost() {
	return {
		mutateAsync: async () => ({}),
		mutate: async (_id: string, callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void }) => {
			callbacks?.onSuccess?.();
		},
		isPending: false,
	};
}

// Sync hook - uses Convex action to fetch from Zernio
export function useSyncPosts() {
	const syncAction = useAction(api.posts.syncFromZernio);
	const userInfoQuery = useQuery(api.users.getUserInfo);

	const shouldSync =
		!userInfoQuery ||
		!userInfoQuery.lastSyncedAt ||
		Date.now() - userInfoQuery.lastSyncedAt > SYNC_STALE_MS;

	return {
		mutateAsync: async (_params?: object) => {
			if (!shouldSync) {
				console.log("[useSyncPosts] Data fresh, skipping sync");
				return { success: true, synced: 0 };
			}
			return syncAction({});
		},
		isPending: false,
	};
}