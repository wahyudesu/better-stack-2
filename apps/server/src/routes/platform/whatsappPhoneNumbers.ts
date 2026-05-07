/**
 * WhatsApp Phone Numbers routes
 * Manage WhatsApp Business phone numbers
 */
export function createWhatsAppPhoneNumbersRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List phone numbers
		 */
		list: (params?: { accountId?: string }) => {
			return fetch<any>('/v1/whatsapp/phone-numbers', { query: params })
		},

		/**
		 * Get phone number details
		 */
		get: (phoneNumberId: string) => {
			return fetch<any>(`/v1/whatsapp/phone-numbers/${phoneNumberId}`)
		},

		/**
		 * Purchase a new phone number
		 */
		purchase: (data: { accountId: string; countryCode: string; category?: string }) => {
			return fetch<any>('/v1/whatsapp/phone-numbers/purchase', { method: 'POST', body: data })
		},

		/**
		 * Release a phone number
		 */
		release: (phoneNumberId: string) => {
			return fetch<any>(`/v1/whatsapp/phone-numbers/${phoneNumberId}`, { method: 'DELETE' })
		},
	}
}

export type WhatsAppPhoneNumbersRoutes = ReturnType<typeof createWhatsAppPhoneNumbersRoutes>