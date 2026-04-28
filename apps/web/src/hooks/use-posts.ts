import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConvexAuth, useMutation as useConvexMutation } from "convex/react";
import { api as convexApi } from "@/convex/_generated/api";
import { api } from "@/lib/client";
import { useCurrentProfileId } from "./use-profiles";

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
	list: (profileId?: string) => ["posts", "list", profileId] as const,
	detail: (postId: string) => ["posts", "detail", postId] as const,
	queue: (profileId?: string) => ["posts", "queue", profileId] as const,
};

/**
 * Hook to fetch posts
 */
export function usePosts(profileId?: string) {
	const currentProfileId = useCurrentProfileId();
	const targetProfileId = profileId || currentProfileId;

	return useQuery({
		queryKey: postKeys.list(targetProfileId),
		queryFn: async () => {
			const { data, error } = await api.getPosts({
				profileId: targetProfileId,
			});
			if (error) throw error;
			return data;
		},
		enabled: !!targetProfileId,
	});
}

/**
 * Hook to fetch a single post
 */
export function usePost(postId: string) {
	return useQuery({
		queryKey: postKeys.detail(postId),
		queryFn: async () => {
			const { data, error } = await api.getPost(postId);
			if (error) throw error;
			return data;
		},
		enabled: !!postId,
	});
}

/**
 * Hook to create a post
 */
export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postData: CreatePostBody) => {
			const { data, error } = await api.createPost(postData);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

/**
 * Hook to update a post
 */
export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			...data
		}: {
			postId: string;
			text?: string;
			scheduledAt?: string;
			media?: Array<{ url: string; type?: string; altText?: string }>;
		}) => {
			const { data: post, error } = await api.updatePost(postId, data);
			if (error) throw error;
			return post;
		},
		onSuccess: (_, { postId }) => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
		},
	});
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId: string) => {
			const { error } = await api.deletePost(postId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

/**
 * Hook to retry a failed post
 */
export function useRetryPost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId: string) => {
			const { data, error } = await api.retryPost(postId);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

/**
 * Hook to unpublish a post
 */
export function useUnpublishPost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId: string) => {
			const { data, error } = await api.unpublishPost(postId);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

/**
 * Hook to bulk upload posts from CSV URL
 */
export function useBulkUploadPost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			csvUrl,
			profileId,
		}: {
			csvUrl: string;
			profileId?: string;
		}) => {
			const { data, error } = await api.bulkUploadPost({ csvUrl, profileId });
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

/**
 * Hook to edit a published post
 */
export function useEditPost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			...data
		}: {
			postId: string;
			text?: string;
			media?: Array<{ url: string; type?: string }>;
		}) => {
			const { data: post, error } = await api.editPost(postId, data);
			if (error) throw error;
			return post;
		},
		onSuccess: (_, { postId }) => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
		},
	});
}

/**
 * Hook to update post metadata
 */
export function useUpdatePostMetadata() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			postId,
			metadata,
		}: {
			postId: string;
			metadata?: object;
		}) => {
			const { data, error } = await api.updatePostMetadata(postId, {
				metadata,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: (_, { postId }) => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
		},
	});
}

/**
 * Hook to get logs for a post
 */
export function usePostLogs(postId: string) {
	return useQuery({
		queryKey: ["posts", "logs", postId] as const,
		queryFn: async () => {
			const { data, error } = await api.getPostLogs(postId);
			if (error) throw error;
			return data;
		},
		enabled: !!postId,
	});
}

/**
 * Hook to sync posts from the server and update Convex storage
 * Call this on app load or when you want to refresh post data
 */
export function useSyncPosts() {
	const queryClient = useQueryClient();
	const { isAuthenticated } = useConvexAuth();
	const internalSyncPosts = useConvexMutation(convexApi.data.syncPosts);

	return useMutation({
		mutationFn: async (params?: { profileId?: string; since?: string }) => {
			if (!isAuthenticated) {
				throw new Error("Not authenticated");
			}
			// Fetch raw posts from Zernio via server
			const { data, error } = await api.syncPosts(params);
			if (error) throw error;

			const posts = data?.posts ?? [];
			if (posts.length === 0) {
				return { synced: 0, errors: [] };
			}

			// Transform Zernio posts to Convex format
			// The internalSyncPosts expects: { posts: [...] }
			const convexPosts = posts.map((post: any) => ({
				_id: post._id,
				text: post.text || post.content || "",
				profileId: post.profileId || "",
				socialAccountIds: post.socialAccountIds || [], // Convex will resolve these
				scheduledAt: post.scheduledAt
					? new Date(post.scheduledAt).getTime()
					: undefined,
				publishedAt: post.publishedAt
					? new Date(post.publishedAt).getTime()
					: undefined,
				media: (post.media || post.mediaItems || []).map(
					(m: any) => m.url || m,
				),
				status: post.status || "draft",
				createdAt: post.createdAt
					? new Date(post.createdAt).getTime()
					: Date.now(),
				updatedAt: post.updatedAt
					? new Date(post.updatedAt).getTime()
					: Date.now(),
			}));

			// Batch sync - send all posts at once
			try {
				await internalSyncPosts({ posts: convexPosts });
			} catch (err) {
				return {
					synced: 0,
					errors: [
						`Batch sync failed: ${err instanceof Error ? err.message : String(err)}`,
					],
				};
			}

			return { synced: posts.length, errors: [] };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

/**
 * Hook to sync accounts from the server and update Convex storage
 */
export function useSyncAccounts() {
	const queryClient = useQueryClient();
	const { isAuthenticated } = useConvexAuth();
	const internalSyncAccounts = useConvexMutation(
		convexApi.data.syncAccounts,
	);

	return useMutation({
		mutationFn: async (params?: { profileId?: string }) => {
			if (!isAuthenticated) {
				throw new Error("Not authenticated");
			}
			// Fetch raw accounts from Zernio via server
			const { data, error } = await api.syncAccounts(params);
			if (error) throw error;

			const accounts = data?.accounts ?? [];
			if (accounts.length === 0) {
				return { synced: 0, errors: [] };
			}

			// Transform Zernio accounts to Convex format
			const convexAccounts = accounts.map((account: any) => ({
				_id: account._id,
				platform: account.platform,
				username: account.username || "",
				displayName: account.displayName || account.username || "",
				isActive: account.isActive ?? true,
				profilePicture:
					account.profilePicture || account.avatarUrl || undefined,
				profileId: account.profileId || "",
				createdAt: account.createdAt
					? new Date(account.createdAt).getTime()
					: Date.now(),
				updatedAt: account.updatedAt
					? new Date(account.updatedAt).getTime()
					: Date.now(),
			}));

			// Batch sync - send all accounts at once
			// Note: internalSyncAccounts requires userId as well
			try {
				await internalSyncAccounts({ accounts: convexAccounts });
			} catch (err) {
				return {
					synced: 0,
					errors: [
						`Batch sync failed: ${err instanceof Error ? err.message : String(err)}`,
					],
				};
			}

			return { synced: accounts.length, errors: [] };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["socialAccounts"] });
		},
	});
}
