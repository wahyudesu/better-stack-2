import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useZernio } from './use-zernio'
import { useAppStore } from '@/stores'
import { useEffect } from 'react'
import type { Profile } from '@/lib/client'

export const profileKeys = {
	all: ['profiles'] as const,
	detail: (id: string) => ['profiles', id] as const,
}

/**
 * Hook to fetch all profiles
 */
export function useProfiles() {
	const zernio = useZernio()
	const { defaultProfileId, setDefaultProfileId } = useAppStore()

	const query = useQuery({
		queryKey: profileKeys.all,
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.profiles.listProfiles()
			if (error) throw error
			return data
		},
		enabled: !!zernio,
	})

	// Auto-set default profile if not set
	useEffect(() => {
		if (query.data?.profiles?.length && !defaultProfileId) {
			setDefaultProfileId(query.data.profiles[0]._id)
		}
	}, [query.data, defaultProfileId, setDefaultProfileId])

	return query
}

/**
 * Hook to get the current profile ID (from store or first profile)
 */
export function useCurrentProfileId(): string | undefined {
	const { defaultProfileId } = useAppStore()
	const { data } = useProfiles()
	return defaultProfileId || data?.profiles?.[0]?._id
}

/**
 * Hook to fetch a single profile
 */
export function useProfile(profileId: string) {
	const zernio = useZernio()

	return useQuery({
		queryKey: profileKeys.detail(profileId),
		queryFn: async () => {
			if (!zernio) throw new Error('Not authenticated')
			const { data, error } = await zernio.profiles.getProfile({
				path: { profileId },
			})
			if (error) throw error
			return data
		},
		enabled: !!zernio && !!profileId,
	})
}

/**
 * Hook to create a profile
 */
export function useCreateProfile() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: { name: string; description?: string }) => {
			if (!zernio) throw new Error('Not authenticated')
			const { data: profile, error } = await zernio.profiles.createProfile({
				body: data,
			})
			if (error) throw error
			return profile
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: profileKeys.all })
		},
	})
}

/**
 * Hook to update a profile
 */
export function useUpdateProfile() {
	const zernio = useZernio()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			profileId,
			...data
		}: {
			profileId: string
			name?: string
			timezone?: string
		}) => {
			if (!zernio) throw new Error('Not authenticated')
			const { data: profile, error } = await zernio.profiles.updateProfile({
				path: { profileId },
				body: data,
			})
			if (error) throw error
			return profile
		},
		onSuccess: (_, { profileId }) => {
			queryClient.invalidateQueries({ queryKey: profileKeys.all })
			queryClient.invalidateQueries({ queryKey: profileKeys.detail(profileId) })
		},
	})
}
