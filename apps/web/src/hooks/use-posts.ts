import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useZernio } from './use-zernio'
import { useCurrentProfileId } from './use-profiles'
import type { Post } from '@/lib/client'
import type { CreatePostBody } from './use-zernio'

export const postKeys = {
	all: ['posts'] as const,
	list: (profileId?: string) => ['posts', 'list', profileId] as const,
	detail: (postId: string) => ['posts', 'detail', postId] as const,
	queue: (profileId?: string) => ['posts', 'queue', profileId] as const,
}

/**
 * Hook to fetch posts
 */
export function usePosts(profileId?: string) {
	const zernio = useZernio()
	const currentProfileId = useCurrentProfileId()
	const targetProfileId = profileId || currentProfileId

	return useQuery({
		queryKey: postKeys.list(targetProfileId),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.posts.listPosts({
				query: { profileId: targetProfileId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio,
	})
}

/**
 * Hook to fetch a single post
 */
export function usePost(postId: string) {
	const zernio = useZernio()

	return useQuery({
		queryKey: postKeys.detail(postId),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.posts.getPost({
				path: { postId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio && !!postId,
	})
}

/**
 * Hook to create a post
 */
export function useCreatePost() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (postData: CreatePostBody) => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.posts.createPost({
				body: postData,
			})
			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all })
		},
	})
}

/**
 * Hook to update a post
 */
export function useUpdatePost() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			postId,
			...data
		}: {
			postId: string
			text?: string
			scheduledAt?: string
			media?: Array<{ url: string; type?: string; altText?: string }>
		}) => {
			if (!zernio) throw new Error('Not authenticated')
			const { data: post, error } = await zernio.posts.updatePost({
				path: { postId },
				body: data,
			})
			if (error) throw error
			return post
		},
		onSuccess: (_, { postId }) => {
			queryClient.invalidateQueries({ queryKey: postKeys.all })
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
		},
	})
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (postId: string) => {
			if (!zernio) throw new Error('Not authenticated')
			const { error } = await zernio.posts.deletePost({
				path: { postId },
			})
			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all })
		},
	})
}

/**
 * Hook to retry a failed post
 */
export function useRetryPost() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (postId: string) => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.posts.retryPost({
				path: { postId },
			})
			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all })
		},
	})
}

/**
 * Hook to unpublish a post
 */
export function useUnpublishPost() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (postId: string) => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.posts.unpublishPost({
				path: { postId },
			})
			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all })
		},
	})
}
