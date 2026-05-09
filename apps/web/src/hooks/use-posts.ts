import { useQuery, useQueryClient } from "@tanstack/react-query";
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

// Convert API post to Post format
function convertToPost(post: any): Post {
	return {
		_id: post.id,
		text: post.text || post.content,
		platforms: post.platforms || [],
		status: post.status || "draft",
		scheduledAt: post.scheduledAt
			? new Date(post.scheduledAt).toISOString()
			: undefined,
		publishedAt: post.publishedAt
			? new Date(post.publishedAt).toISOString()
			: undefined,
		media: post.mediaUrls?.map((url: string) => ({
			url,
			type: "image" as const,
		})),
		mediaItems: post.mediaUrls?.map((url: string) => ({ url })),
		profileId: "",
		socialAccountIds: post.accountIds || [],
		createdAt: post.createdAt
			? new Date(post.createdAt).toISOString()
			: new Date().toISOString(),
		updatedAt: post.updatedAt
			? new Date(post.updatedAt).toISOString()
			: new Date().toISOString(),
	};
}

async function fetchPosts(): Promise<Post[]> {
	const res = await fetch("/api/posts");
	if (!res.ok) throw new Error("Failed to fetch posts");
	const data = await res.json();
	return Array.isArray(data) ? data.map(convertToPost) : [];
}

async function createPost(body: {
	text: string;
	platforms: string[];
	scheduledAt?: number;
	mediaUrls?: string[];
	socialAccountIds?: string[];
	profileId?: string;
}) {
	const res = await fetch("/api/posts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error("Failed to create post");
	return res.json();
}

async function deletePost(postId: string) {
	const res = await fetch("/api/posts", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ postId }),
	});
	if (!res.ok) throw new Error("Failed to delete post");
	return res.json();
}

/**
 * Hook to fetch all posts
 */
export function usePosts() {
	const { data, isLoading, error } = useQuery({
		queryKey: postKeys.list(),
		queryFn: fetchPosts,
	});

	return {
		data: { posts: data ?? [] },
		isLoading,
		error,
	};
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
	const queryClient = useQueryClient();

	return {
		mutateAsync: async (params: {
			text: string;
			platforms: string[];
			scheduledAt?: number;
			mediaUrls?: string[];
			socialAccountIds?: string[];
			profileId?: string;
		}) => {
			const result = await createPost(params);
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

	return {
		mutateAsync: async (postId: string) => {
			await deletePost(postId);
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
		mutate: async (
			postId: string,
			callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
		) => {
			try {
				await deletePost(postId);
				queryClient.invalidateQueries({ queryKey: postKeys.all });
				callbacks?.onSuccess?.();
			} catch (err) {
				callbacks?.onError?.(err as Error);
			}
		},
	};
}

// Sync hook - fetches from Zernio via API route
export function useSyncPosts() {
	const queryClient = useQueryClient();

	return {
		mutateAsync: async (_params?: object) => {
			const res = await fetch("/api/zernio/sync", { method: "POST" });
			if (!res.ok) throw new Error("Sync failed");
			const result = await res.json();
			queryClient.invalidateQueries({ queryKey: postKeys.all });
			return result;
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
				// Stub: would call PATCH /api/posts
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
	return {
		mutate: async (
			postId: string,
			callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
		) => {
			try {
				// Stub: would call POST /api/posts/retry
				console.log("retryPost stub:", postId);
				callbacks?.onSuccess?.();
			} catch (err) {
				callbacks?.onError?.(err as Error);
			}
		},
	};
}

// Unpublish hook - stub implementation
export function useUnpublishPost() {
	return {
		mutate: async (
			postId: string,
			callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
		) => {
			try {
				// Stub: would call POST /api/posts/unpublish
				console.log("unpublishPost stub:", postId);
				callbacks?.onSuccess?.();
			} catch (err) {
				callbacks?.onError?.(err as Error);
			}
		},
	};
}
