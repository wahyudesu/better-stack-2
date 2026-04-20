import { useQuery } from '@tanstack/react-query'
import { useZernio } from './use-zernio'
import { useCurrentProfileId } from './use-profiles'

export const queueKeys = {
	all: ['queue'] as const,
	upcoming: (profileId?: string) => ['queue', 'upcoming', profileId] as const,
}

/**
 * Hook to fetch upcoming scheduled posts (queue)
 */
export function useQueue(profileId?: string) {
	const zernio = useZernio()
	const currentProfileId = useCurrentProfileId()
	const targetProfileId = profileId || currentProfileId

	return useQuery({
		queryKey: queueKeys.upcoming(targetProfileId),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.queue.getUpcoming({
				query: { profileId: targetProfileId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio,
	})
}
