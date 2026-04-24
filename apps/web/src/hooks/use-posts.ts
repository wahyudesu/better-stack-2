import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
