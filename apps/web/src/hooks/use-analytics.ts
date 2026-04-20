import { useQuery } from '@tanstack/react-query'
import { useZernio } from './use-zernio'

export const analyticsKeys = {
	all: ['analytics'] as const,
	post: (postId: string) => ['analytics', 'post', postId] as const,
}

/**
 * Hook to fetch analytics for a specific post
 */
export function usePostAnalytics(postId: string) {
	const zernio = useZernio()

	return useQuery({
		queryKey: analyticsKeys.post(postId),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.analytics.getPostAnalytics({
				query: { postId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio && !!postId,
	})
}
