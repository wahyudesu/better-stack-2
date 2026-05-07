/**
 * LinkedIn Mentions routes
 * Track and manage LinkedIn company mentions
 */
export function createLinkedInMentionsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * Get LinkedIn mentions for an account
		 */
		list: (accountId: string, params?: { limit?: number; cursor?: string }) => {
			return fetch<any>(`/v1/accounts/${accountId}/linkedin-mentions`, { query: params })
		},
	}
}

export type LinkedInMentionsRoutes = ReturnType<typeof createLinkedInMentionsRoutes>