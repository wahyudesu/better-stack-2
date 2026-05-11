import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useZernio } from "@/hooks/use-zernio";
import type { Post } from "@/lib/client";
import { getZernioErrorMessage } from "@/lib/zernio-error";

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

// Convert API post to Post format
function convertToPost(post: any): Post {
	// Zernio uses scheduledFor, local uses scheduledAt
	const scheduledAt =
		(post.scheduledFor ?? post.scheduledAt)
			? new Date(post.scheduledFor ?? post.scheduledAt).toISOString()
			: undefined;

	return {
		_id: post.id ?? post._id,
		text: post.text || post.content,
		platforms: post.platforms || [],
		status: post.status || "draft",
		scheduledAt,
		publishedAt: post.publishedAt
			? new Date(post.publishedAt).toISOString()
			: undefined,
		media: post.mediaUrls?.map((url: string) => ({
			url,
			type: "image" as const,
		})),
		mediaItems: post.mediaUrls?.map((url: string) => ({ url })),
		profileId: post.profileId ?? "",
		socialAccountIds: post.accountIds || [],
		createdAt: post.createdAt
			? new Date(post.createdAt).toISOString()
			: new Date().toISOString(),
		updatedAt: post.updatedAt
			? new Date(post.updatedAt).toISOString()
			: new Date().toISOString(),
	};
}

async function fetchPosts(zernio: any): Promise<Post[]> {
	const response = await zernio.posts.listPosts({ query: { limit: 50 } });
	if (!response.data) {
		throw new Error(getZernioErrorMessage(response.error));
	}
	const posts = response.data.posts ?? response.data.data ?? [];
	return posts.map(convertToPost);
}

async function createPost(
	zernio: any,
	body: {
		text: string;
		platforms: string[];
		scheduledAt?: number;
		mediaUrls?: string[];
		socialAccountIds?: string[];
		profileId?: string;
	},
) {
	const response = await zernio.posts.createPost({
		body: {
			content: body.text,
			platforms: body.platforms.map((p) => ({ platform: p, accountId: "" })),
			scheduledAt: body.scheduledAt
				? new Date(body.scheduledAt).toISOString()
				: undefined,
			socialAccountIds: body.socialAccountIds,
			profileId: body.profileId,
		},
	});
	if (!response.data) {
		throw new Error(getZernioErrorMessage(response.error));
	}
	return response.data;
}

async function deletePost(zernio: any, postId: string) {
	const response = await zernio.posts.deletePost({ path: { postId } });
	if (response.error) {
		throw new Error(getZernioErrorMessage(response.error));
	}
	return response.data;
}

/**
 * Hook to fetch all posts
 */
export function usePosts() {
	const { zernio, loading, error } = useZernio();

	const query = useQuery({
		queryKey: postKeys.list(),
		queryFn: async () => {
			if (!zernio) return [];
			return fetchPosts(zernio);
		},
		enabled: !loading && !!zernio,
	});

	return {
		data: { posts: query.data ?? [] },
		isLoading: loading || query.isFetching,
		error: error || query.error,
	};
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
	const queryClient = useQueryClient();
	const { zernio } = useZernio();

	return {
		mutateAsync: async (params: {
			text: string;
			platforms: string[];
			scheduledAt?: number;
			mediaUrls?: string[];
			socialAccountIds?: string[];
			profileId?: string;
		}) => {
			if (!zernio) throw new Error("Zernio not initialized");
			const result = await createPost(zernio, params);
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
	const { zernio } = useZernio();

	return useMutation({
		mutationFn: async (postId: string) => {
			if (!zernio) throw new Error("Zernio not initialized");
			await deletePost(zernio, postId);
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

// Sync hook - fetches from Zernio directly
export function useSyncPosts() {
	const queryClient = useQueryClient();
	const { zernio } = useZernio();

	return {
		mutateAsync: async (_params?: object) => {
			if (!zernio) {
				// Not initialized yet - skip silently
				return { synced: false };
			}
			// Sync is handled by fetching latest data
			queryClient.invalidateQueries({ queryKey: postKeys.all });
			return { synced: true };
		},
		isPending: false,
	};
}

// Edit hook - stub implementation
export function useEditPost() {
	return {
		mutate: async (
			_postId: string,
			_callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
		) => {
			try {
				_callbacks?.onSuccess?.();
			} catch (err) {
				_callbacks?.onError?.(err as Error);
			}
		},
	};
}

// Update hook - stub implementation
export function useUpdatePost() {
	return {
		mutate: async (
			params: { postId: string; scheduledAt?: string },
			callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
		) => {
			try {
				console.log("updatePost stub:", params);
				callbacks?.onSuccess?.();
			} catch (err) {
				callbacks?.onError?.(err as Error);
			}
		},
	};
}

// Retry hook - stub implementation
export function useRetryPost() {
	const { zernio } = useZernio();

	return {
		mutate: async (
			postId: string,
			callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
		) => {
			try {
				if (!zernio) throw new Error("Zernio not initialized");
				await zernio.posts.retryPost({ path: { postId } });
				callbacks?.onSuccess?.();
			} catch (err) {
				callbacks?.onError?.(err as Error);
			}
		},
	};
}

// Unpublish hook - stub implementation
export function useUnpublishPost() {
	return useMutation({
		mutationFn: async (postId: string) => {
			// Stub - actual implementation would call zernio.posts.unpublishPost
			console.log("Unpublish post:", postId);
		},
	});
}
