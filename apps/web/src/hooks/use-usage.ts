import { useQuery } from '@tanstack/react-query'
import { useZernio } from './use-zernio'

export const usageKeys = {
	all: ['usage'] as const,
	stats: ['usage', 'stats'] as const,
}

/**
 * Hook to fetch usage stats (limits and current usage)
 */
export function useUsageStats() {
	const zernio = useZernio()

	return useQuery({
		queryKey: usageKeys.stats,
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.usage.getUsageStats()
			if (error) throw error
			return data
		},
		enabled: !!zernio,
	})
}
