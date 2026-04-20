import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useZernio } from './use-zernio'
import { useCurrentProfileId } from './use-profiles'
import type { SocialAccount } from '@/lib/client'

export const accountKeys = {
	all: ['accounts'] as const,
	list: (profileId: string) => ['accounts', 'list', profileId] as const,
	health: (profileId: string) => ['accounts', 'health', profileId] as const,
	detail: (accountId: string) => ['accounts', 'detail', accountId] as const,
}

export interface AccountHealth {
	accountId: string
	isHealthy: boolean
	error?: string
}

/**
 * Hook to fetch all accounts for a profile
 */
export function useAccounts(profileId?: string) {
	const zernio = useZernio()
	const currentProfileId = useCurrentProfileId()
	const targetProfileId = profileId || currentProfileId

	return useQuery({
		queryKey: accountKeys.list(targetProfileId || ''),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.accounts.listAccounts({
				query: { profileId: targetProfileId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio && !!targetProfileId,
	})
}

/**
 * Hook to fetch account health status
 */
export function useAccountsHealth(profileId?: string) {
	const zernio = useZernio()
	const currentProfileId = useCurrentProfileId()
	const targetProfileId = profileId || currentProfileId

	return useQuery({
		queryKey: accountKeys.health(targetProfileId || ''),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.accounts.getAllAccountsHealth({
				query: { profileId: targetProfileId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio && !!targetProfileId,
	})
}

/**
 * Hook to start OAuth connection flow
 */
export function useConnectAccount() {
	const zernio = useZernio()
	const currentProfileId = useCurrentProfileId()

	return useMutation({
		mutationFn: async ({ platform }: { platform: string }) => {
			if (!zernio) throw new Error('Not authenticated')
			const targetProfileId = currentProfileId
			if (!targetProfileId) throw new Error('No profile selected')

			const redirectUrl = `${window.location.origin}/callback`
			const { data, error } = await zernio.connect.getConnectUrl({
				path: { platform },
				query: {
					profileId: targetProfileId,
					redirect_url: redirectUrl,
					headless: true,
				},
			})
			if (error) throw error
			return data
		},
	})
}

/**
 * Hook to delete/disconnect an account
 */
export function useDeleteAccount() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (accountId: string) => {
			if (!zernio) throw new Error('Not authenticated')
			const { error } = await zernio.accounts.deleteAccount({
				path: { accountId },
			})
			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all })
		},
	})
}

/**
 * Hook to get accounts grouped by platform
 */
export function useAccountsByPlatform(profileId?: string) {
	const { data, ...rest } = useAccounts(profileId)

	const accountsByPlatform = data?.accounts?.reduce(
		(acc: Record<string, SocialAccount[]>, account: SocialAccount) => {
			const platform = account.platform
			if (!acc[platform]) acc[platform] = []
			acc[platform].push(account)
			return acc
		},
		{} as Record<string, SocialAccount[]>
	)

	return { data: accountsByPlatform, accounts: data?.accounts, ...rest }
}
