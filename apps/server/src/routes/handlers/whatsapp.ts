/**
 * WhatsApp route handlers
 */
import type { Context } from 'hono'
import { createWhatsAppRoutes } from '../platform/whatsapp'
import { createWhatsAppFlowsRoutes } from '../platform/whatsappFlows'
import { createFetchFromHono } from '../adapters'

export function createWhatsAppHandlers() {
	return {
		// ============ TEMPLATES ============

		/** GET /v1/whatsapp/templates */
		listTemplates: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.listTemplates(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/templates/:templateName */
		getTemplate: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const templateName = c.req.param('templateName')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.getTemplate(accountId, templateName)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/templates */
		createTemplate: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.createTemplate(body.accountId || '', body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/whatsapp/templates/:templateName */
		updateTemplate: async (c: Context) => {
			const templateName = c.req.param('templateName')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.updateTemplate(body.accountId || '', templateName, { components: body.components })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/templates/:templateName */
		deleteTemplate: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const templateName = c.req.param('templateName')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.deleteTemplate(accountId, templateName)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ BUSINESS PROFILE ============

		/** GET /v1/whatsapp/business-profile */
		getBusinessProfile: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.getBusinessProfile(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/business-profile */
		updateBusinessProfile: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.updateBusinessProfile(body.accountId || '', body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/business-profile/photo */
		uploadBusinessProfilePhoto: async (c: Context) => {
			const body = await c.req.parseBody()
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const formData = new FormData()
			for (const [key, value] of Object.entries(body)) {
				if (value instanceof File) formData.append(key, value)
				else if (typeof value === 'string') formData.append(key, value)
			}

			const response = await fetch(`${baseUrl}/v1/whatsapp/business-profile/photo`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}` },
				body: formData,
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/whatsapp/business-profile/display-name */
		getDisplayNameStatus: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.getDisplayNameStatus(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/business-profile/display-name */
		updateDisplayName: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.updateDisplayName(body.accountId || '', body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ PHONE NUMBERS ============

		/** GET /v1/whatsapp/phone-numbers */
		listPhoneNumbers: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.listPhoneNumbers(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/phone-numbers/:phoneNumberId */
		getPhoneNumber: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const phoneNumberId = c.req.param('phoneNumberId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.getPhoneNumber(accountId, phoneNumberId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/phone-numbers/purchase */
		purchasePhoneNumber: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.purchasePhoneNumber(body.accountId || '', { number: body.number, category: body.category })
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/phone-numbers/:phoneNumberId */
		releasePhoneNumber: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const phoneNumberId = c.req.param('phoneNumberId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.releasePhoneNumber(accountId, phoneNumberId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ FLOWS ============

		/** GET /v1/whatsapp/flows */
		listFlows: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.list(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows */
		createFlow: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.create(body.accountId || '', body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/flows/:flowId */
		getFlow: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const flowId = c.req.param('flowId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.get(accountId, flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/whatsapp/flows/:flowId */
		updateFlow: async (c: Context) => {
			const flowId = c.req.param('flowId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.update(body.accountId || '', flowId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/flows/:flowId */
		deleteFlow: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const flowId = c.req.param('flowId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.delete(accountId, flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/flows/:flowId/json */
		getFlowJson: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const flowId = c.req.param('flowId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.getJson(accountId, flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/:flowId/json */
		uploadFlowJson: async (c: Context) => {
			const flowId = c.req.param('flowId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.uploadJson(body.accountId || '', flowId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/:flowId/publish */
		publishFlow: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const flowId = c.req.param('flowId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.publish(accountId, flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/:flowId/deprecate */
		deprecateFlow: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const flowId = c.req.param('flowId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.deprecate(accountId, flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/send */
		sendFlow: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppFlowsRoutes(fetch)
			try {
				const result = await routes.send(body.accountId || '', body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ WHATSAPP GROUPS ============

		/** GET /v1/whatsapp/wa-groups */
		listGroups: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.listGroups(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/wa-groups */
		createGroup: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.createGroup(body.accountId || '', body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/wa-groups/:groupId */
		getGroup: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.getGroup(accountId, groupId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/whatsapp/wa-groups/:groupId */
		updateGroup: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.updateGroup(body.accountId || '', groupId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/wa-groups/:groupId */
		deleteGroup: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.deleteGroup(accountId, groupId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/wa-groups/:groupId/participants */
		listParticipants: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/whatsapp/wa-groups/${groupId}/participants?accountId=${encodeURIComponent(accountId)}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/whatsapp/wa-groups/:groupId/participants */
		addParticipants: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.addParticipants(body.accountId || '', groupId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/wa-groups/:groupId/participants */
		removeParticipants: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.removeParticipants(body.accountId || '', groupId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/wa-groups/:groupId/invite-link */
		createInviteLink: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.createInviteLink(accountId, groupId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/wa-groups/:groupId/join-requests */
		listJoinRequests: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.listJoinRequests(accountId, groupId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/wa-groups/:groupId/join-requests */
		approveJoinRequests: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/whatsapp/wa-groups/${groupId}/join-requests/approve`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...body, accountId: body.accountId || c.req.query('accountId') }),
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		// ============ CONVERSIONS ============

		/** POST /v1/whatsapp/conversions */
		sendConversions: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWhatsAppRoutes(fetch)
			try {
				const result = await routes.sendConversions(body.accountId || '', { events: body.events || [] })
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}