import type { paths } from './types'

// Core: profiles, accounts, connect, apiKeys, logs
import { createProfilesRoutes, type ProfilesRoutes } from './routes/core/profiles'
import { createAccountsRoutes, type AccountsRoutes } from './routes/core/accounts'
import { createConnectRoutes, type ConnectRoutes } from './routes/core/connect'
import { createApiKeysRoutes, type ApiKeysRoutes } from './routes/core/apiKeys'
import { createLogsRoutes, type LogsRoutes } from './routes/core/logs'

// Content & Scheduling: posts, queue, media, tools
import { createPostsRoutes, type PostsRoutes } from './routes/content/posts'
import { createQueueRoutes, type QueueRoutes } from './routes/content/queue'
import { createMediaRoutes, type MediaRoutes } from './routes/content/media'
import { createToolsRoutes, type ToolsRoutes } from './routes/content/tools'

// Inbox: messages, comments, reviews, broadcasts, contacts, customFields, sequences, commentAutomations
import {
	createMessagesRoutes,
	type MessagesRoutes,
	createCommentsRoutes,
	type CommentsRoutes,
	createReviewsRoutes,
	type ReviewsRoutes,
	createBroadcastsRoutes,
	type BroadcastsRoutes,
	createContactsRoutes,
	type ContactsRoutes,
	createCustomFieldsRoutes,
	type CustomFieldsRoutes,
	createSequencesRoutes,
	type SequencesRoutes,
	createCommentAutomationsRoutes,
	type CommentAutomationsRoutes,
} from './routes/inbox'

// Analytics
import { createAnalyticsRoutes, type AnalyticsRoutes } from './routes/analytics/analytics'

// Webhooks
import { createWebhooksRoutes, type WebhooksRoutes } from './routes/webhooks/webhooks'

// Advertising
import { createAdsRoutes, type AdsRoutes } from './routes/advertising/ads'
import { createAdCampaignsRoutes, type AdCampaignsRoutes } from './routes/advertising/adCampaigns'
import { createAdAudiencesRoutes, type AdAudiencesRoutes } from './routes/advertising/adAudiences'

// Platform APIs
import { createWhatsAppRoutes, type WhatsAppRoutes } from './routes/platform/whatsapp'
import { createWhatsAppPhoneNumbersRoutes, type WhatsAppPhoneNumbersRoutes } from './routes/platform/whatsappPhoneNumbers'
import { createWhatsAppFlowsRoutes, type WhatsAppFlowsRoutes } from './routes/platform/whatsappFlows'
import { createGoogleBusinessRoutes, type GoogleBusinessRoutes } from './routes/platform/googleBusiness'
import { createDiscordRoutes, type DiscordRoutes } from './routes/platform/discord'
import { createLinkedInMentionsRoutes, type LinkedInMentionsRoutes } from './routes/platform/linkedinMentions'
import { createRedditSearchRoutes, type RedditSearchRoutes } from './routes/platform/redditSearch'
import { createTwitterEngagementRoutes, type TwitterEngagementRoutes } from './routes/platform/twitterEngagement'

// Settings & Admin
import { createAccountSettingsRoutes, type AccountSettingsRoutes } from './routes/admin/accountSettings'
import { createAccountGroupsRoutes, type AccountGroupsRoutes } from './routes/admin/accountGroups'
import { createUsersRoutes, type UsersRoutes } from './routes/admin/users'
import { createInvitesRoutes, type InvitesRoutes } from './routes/admin/invites'
import { createUsageRoutes, type UsageRoutes } from './routes/admin/usage'

export interface ZernioClientConfig {
	apiKey: string
	baseUrl?: string
}

type FetchOptions = {
	method?: string
	query?: Record<string, string | string[] | undefined>
	body?: any
}

/**
 * Zernio API Client
 *
 * A typed client for the Zernio Social Media API.
 * Provides methods for posts, accounts, analytics, and more.
 */
export class ZernioClient {
	private apiKey: string
	private baseUrl: string

	// Route modules - Core
	public readonly profiles: ProfilesRoutes
	public readonly accounts: AccountsRoutes
	public readonly connect: ConnectRoutes
	public readonly apiKeys: ApiKeysRoutes
	public readonly logs: LogsRoutes

	// Route modules - Content & Scheduling
	public readonly posts: PostsRoutes
	public readonly queue: QueueRoutes
	public readonly media: MediaRoutes
	public readonly tools: ToolsRoutes

	// Route modules - Inbox
	public readonly messages: MessagesRoutes
	public readonly comments: CommentsRoutes
	public readonly reviews: ReviewsRoutes
	public readonly broadcasts: BroadcastsRoutes
	public readonly contacts: ContactsRoutes
	public readonly customFields: CustomFieldsRoutes
	public readonly sequences: SequencesRoutes
	public readonly commentAutomations: CommentAutomationsRoutes

	// Route modules - Analytics & Webhooks
	public readonly analytics: AnalyticsRoutes
	public readonly webhooks: WebhooksRoutes

	// Route modules - Advertising
	public readonly ads: AdsRoutes
	public readonly adCampaigns: AdCampaignsRoutes
	public readonly adAudiences: AdAudiencesRoutes

	// Route modules - Platform APIs
	public readonly whatsapp: WhatsAppRoutes
	public readonly whatsappPhoneNumbers: WhatsAppPhoneNumbersRoutes
	public readonly whatsappFlows: WhatsAppFlowsRoutes
	public readonly googleBusiness: GoogleBusinessRoutes
	public readonly discord: DiscordRoutes
	public readonly linkedInMentions: LinkedInMentionsRoutes
	public readonly redditSearch: RedditSearchRoutes
	public readonly twitter: TwitterEngagementRoutes

	// Route modules - Settings & Admin
	public readonly accountSettings: AccountSettingsRoutes
	public readonly accountGroups: AccountGroupsRoutes
	public readonly users: UsersRoutes
	public readonly invites: InvitesRoutes
	public readonly usage: UsageRoutes

	constructor(config: ZernioClientConfig) {
		this.apiKey = config.apiKey
		this.baseUrl = config.baseUrl || 'https://zernio.com/api'

		// Initialize all routes with the fetch method
		const fetchMethod = this.fetch.bind(this)

		// Core
		this.profiles = createProfilesRoutes(fetchMethod)
		this.accounts = createAccountsRoutes(fetchMethod)
		this.connect = createConnectRoutes(fetchMethod)
		this.apiKeys = createApiKeysRoutes(fetchMethod)
		this.logs = createLogsRoutes(fetchMethod)

		// Content & Scheduling
		this.posts = createPostsRoutes(fetchMethod)
		this.queue = createQueueRoutes(fetchMethod)
		this.media = createMediaRoutes(this.baseUrl, this.apiKey)
		this.tools = createToolsRoutes(fetchMethod)

		// Inbox
		this.messages = createMessagesRoutes(fetchMethod)
		this.comments = createCommentsRoutes(fetchMethod)
		this.reviews = createReviewsRoutes(fetchMethod)
		this.broadcasts = createBroadcastsRoutes(fetchMethod)
		this.contacts = createContactsRoutes(fetchMethod)
		this.customFields = createCustomFieldsRoutes(fetchMethod)
		this.sequences = createSequencesRoutes(fetchMethod)
		this.commentAutomations = createCommentAutomationsRoutes(fetchMethod)

		// Analytics & Webhooks
		this.analytics = createAnalyticsRoutes(fetchMethod)
		this.webhooks = createWebhooksRoutes(fetchMethod)

		// Advertising
		this.ads = createAdsRoutes(fetchMethod)
		this.adCampaigns = createAdCampaignsRoutes(fetchMethod)
		this.adAudiences = createAdAudiencesRoutes(fetchMethod)

		// Platform APIs
		this.whatsapp = createWhatsAppRoutes(fetchMethod)
		this.whatsappPhoneNumbers = createWhatsAppPhoneNumbersRoutes(fetchMethod)
		this.whatsappFlows = createWhatsAppFlowsRoutes(fetchMethod)
		this.googleBusiness = createGoogleBusinessRoutes(fetchMethod)
		this.discord = createDiscordRoutes(fetchMethod)
		this.linkedInMentions = createLinkedInMentionsRoutes(fetchMethod)
		this.redditSearch = createRedditSearchRoutes(fetchMethod)
		this.twitter = createTwitterEngagementRoutes(fetchMethod)

		// Settings & Admin
		this.accountSettings = createAccountSettingsRoutes(fetchMethod)
		this.accountGroups = createAccountGroupsRoutes(fetchMethod)
		this.users = createUsersRoutes(fetchMethod)
		this.invites = createInvitesRoutes(fetchMethod)
		this.usage = createUsageRoutes(fetchMethod)
	}

	private async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
		const url = new URL(path, this.baseUrl)

		// Add query parameters
		if (options.query) {
			Object.entries(options.query).forEach(([key, value]) => {
				if (value === undefined) return
				if (Array.isArray(value)) {
					value.forEach(v => url.searchParams.append(key, v))
				} else {
					url.searchParams.set(key, value)
				}
			})
		}

		const headers: HeadersInit = {
			'Authorization': `Bearer ${this.apiKey}`,
			'Content-Type': 'application/json',
		}

		const response = await fetch(url.toString(), {
			method: options.method || 'GET',
			headers,
			body: options.body ? JSON.stringify(options.body) : undefined,
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: response.statusText }))
			const errorMessage = (error && typeof error === 'object' && 'error' in error)
				? error.error
				: (error && typeof error === 'object' && 'message' in error)
					? error.message
					: 'API request failed'
			throw new Error(String(errorMessage))
		}

		return response.json()
	}

	/**
	 * Get API base URL
	 */
	get url(): string {
		return this.baseUrl
	}
}

// Export all route types
export type {
	ProfilesRoutes,
	AccountsRoutes,
	ConnectRoutes,
	ApiKeysRoutes,
	LogsRoutes,
	PostsRoutes,
	QueueRoutes,
	MediaRoutes,
	ToolsRoutes,
	MessagesRoutes,
	CommentsRoutes,
	ReviewsRoutes,
	BroadcastsRoutes,
	ContactsRoutes,
	CustomFieldsRoutes,
	SequencesRoutes,
	CommentAutomationsRoutes,
	AnalyticsRoutes,
	WebhooksRoutes,
	AdsRoutes,
	AdCampaignsRoutes,
	AdAudiencesRoutes,
	WhatsAppRoutes,
	WhatsAppPhoneNumbersRoutes,
	WhatsAppFlowsRoutes,
	GoogleBusinessRoutes,
	DiscordRoutes,
	LinkedInMentionsRoutes,
	RedditSearchRoutes,
	TwitterEngagementRoutes,
	AccountSettingsRoutes,
	AccountGroupsRoutes,
	UsersRoutes,
	InvitesRoutes,
	UsageRoutes,
}

export type { paths }