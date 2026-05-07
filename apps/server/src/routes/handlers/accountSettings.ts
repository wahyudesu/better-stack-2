/**
 * Account Settings route handlers
 */
import type { Context } from 'hono'
import { createAccountSettingsRoutes } from '../admin/accountSettings'
import { createFetchFromHono } from '../adapters'

export function createAccountSettingsHandlers() {
	const getRoutes = (c: Context) => createAccountSettingsRoutes(createFetchFromHono(c))

	return {
		// Messenger Menu
		/** GET /v1/accounts/:accountId/messenger-menu */
		getMessengerMenu: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getMessengerMenu(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/messenger-menu */
		setMessengerMenu: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.setMessengerMenu(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/messenger-menu */
		deleteMessengerMenu: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.deleteMessengerMenu(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// Instagram Ice Breakers
		/** GET /v1/accounts/:accountId/instagram-ice-breakers */
		getInstagramIceBreakers: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getInstagramIceBreakers(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/instagram-ice-breakers */
		setInstagramIceBreakers: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.setInstagramIceBreakers(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/instagram-ice-breakers */
		deleteInstagramIceBreakers: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.deleteInstagramIceBreakers(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// Telegram Bot Commands
		/** GET /v1/accounts/:accountId/telegram-commands */
		getTelegramCommands: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getTelegramCommands(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/telegram-commands */
		setTelegramCommands: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.setTelegramCommands(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/telegram-commands */
		deleteTelegramCommands: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.deleteTelegramCommands(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// Discord Settings
		/** GET /v1/accounts/:accountId/discord-settings */
		getDiscordSettings: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getDiscordSettings(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/discord-settings */
		updateDiscordSettings: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.updateDiscordSettings(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/discord-channels */
		getDiscordChannels: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getDiscordChannels(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}