/**
 * Account Settings routes
 * Platform-specific account settings (messenger menu, ice breakers, bot commands, etc.)
 */
export function createAccountSettingsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		// --- Facebook Messenger Menu ---
		/**
		 * Get Messenger persistent menu
		 */
		getMessengerMenu: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/messenger-menu`)
		},

		/**
		 * Set Messenger persistent menu
		 */
		setMessengerMenu: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/messenger-menu`, { method: 'PUT', body: data })
		},

		/**
		 * Delete Messenger persistent menu
		 */
		deleteMessengerMenu: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/messenger-menu`, { method: 'DELETE' })
		},

		// --- Instagram Ice Breakers ---
		/**
		 * Get Instagram ice breakers
		 */
		getInstagramIceBreakers: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/instagram-ice-breakers`)
		},

		/**
		 * Set Instagram ice breakers
		 */
		setInstagramIceBreakers: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/instagram-ice-breakers`, { method: 'PUT', body: data })
		},

		/**
		 * Delete Instagram ice breakers
		 */
		deleteInstagramIceBreakers: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/instagram-ice-breakers`, { method: 'DELETE' })
		},

		// --- Telegram Bot Commands ---
		/**
		 * Get Telegram bot commands
		 */
		getTelegramCommands: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/telegram-commands`)
		},

		/**
		 * Set Telegram bot commands
		 */
		setTelegramCommands: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/telegram-commands`, { method: 'PUT', body: data })
		},

		/**
		 * Delete Telegram bot commands
		 */
		deleteTelegramCommands: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/telegram-commands`, { method: 'DELETE' })
		},

		// --- Discord Settings ---
		/**
		 * Get Discord settings
		 */
		getDiscordSettings: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/discord-settings`)
		},

		/**
		 * Update Discord settings
		 */
		updateDiscordSettings: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/discord-settings`, { method: 'PUT', body: data })
		},

		/**
		 * Get Discord channels
		 */
		getDiscordChannels: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/discord-channels`)
		},
	}
}

export type AccountSettingsRoutes = ReturnType<typeof createAccountSettingsRoutes>