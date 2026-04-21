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
import { createInboxRoutes, type InboxRoutes } from './routes/inbox/inbox'
import { createBroadcastsRoutes, type BroadcastsRoutes } from './routes/inbox/broadcasts'
import { createContactsRoutes, type ContactsRoutes } from './routes/inbox/contacts'
import { createCustomFieldsRoutes, type CustomFieldsRoutes } from './routes/inbox/customFields'
import { createSequencesRoutes, type SequencesRoutes } from './routes/inbox/sequences'
import { createCommentAutomationsRoutes, type CommentAutomationsRoutes } from './routes/inbox/commentAutomations'

// Analytics
import { createAnalyticsRoutes, type AnalyticsRoutes } from './routes/analytics/analytics'

// Webhooks
import { createWebhooksRoutes, type WebhooksRoutes } from './routes/webhooks/webhooks'

// Advertising
import { createAdsRoutes, type AdsRoutes } from './routes/advertising/ads'
import { createAdAudiencesRoutes, type AdAudiencesRoutes } from './routes/advertising/adAudiences'

// Platform APIs
import { createWhatsAppRoutes, type WhatsAppRoutes } from './routes/platform/whatsapp'
import { createWhatsAppFlowsRoutes, type WhatsAppFlowsRoutes } from './routes/platform/whatsappFlows'
import { createDiscordRoutes, type DiscordRoutes } from './routes/platform/discord'

// Settings & Admin
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

  // Route modules
  public readonly posts: PostsRoutes
  public readonly accounts: AccountsRoutes
  public readonly analytics: AnalyticsRoutes
  public readonly tools: ToolsRoutes
  public readonly inbox: InboxRoutes
  public readonly profiles: ProfilesRoutes
  public readonly users: UsersRoutes
  public readonly queue: QueueRoutes
  public readonly webhooks: WebhooksRoutes
  public readonly media: MediaRoutes
  public readonly usage: UsageRoutes
  public readonly connect: ConnectRoutes
  public readonly accountGroups: AccountGroupsRoutes
  public readonly apiKeys: ApiKeysRoutes
  public readonly invites: InvitesRoutes
  public readonly discord: DiscordRoutes
  public readonly logs: LogsRoutes
  public readonly whatsapp: WhatsAppRoutes
  public readonly whatsappFlows: WhatsAppFlowsRoutes
  public readonly contacts: ContactsRoutes
  public readonly customFields: CustomFieldsRoutes
  public readonly broadcasts: BroadcastsRoutes
  public readonly sequences: SequencesRoutes
  public readonly commentAutomations: CommentAutomationsRoutes
  public readonly ads: AdsRoutes
  public readonly adAudiences: AdAudiencesRoutes

  constructor(config: ZernioClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://zernio.com/api'

    // Initialize all routes with the fetch method
    const fetchMethod = this.fetch.bind(this)

    this.posts = createPostsRoutes(fetchMethod)
    this.accounts = createAccountsRoutes(fetchMethod)
    this.analytics = createAnalyticsRoutes(fetchMethod)
    this.tools = createToolsRoutes(fetchMethod)
    this.inbox = createInboxRoutes(fetchMethod)
    this.profiles = createProfilesRoutes(fetchMethod)
    this.users = createUsersRoutes(fetchMethod)
    this.queue = createQueueRoutes(fetchMethod)
    this.webhooks = createWebhooksRoutes(fetchMethod)
    this.media = createMediaRoutes(this.baseUrl, this.apiKey)
    this.usage = createUsageRoutes(fetchMethod)
    this.connect = createConnectRoutes(fetchMethod)
    this.accountGroups = createAccountGroupsRoutes(fetchMethod)
    this.apiKeys = createApiKeysRoutes(fetchMethod)
    this.invites = createInvitesRoutes(fetchMethod)
    this.discord = createDiscordRoutes(fetchMethod)
    this.logs = createLogsRoutes(fetchMethod)
    this.whatsapp = createWhatsAppRoutes(fetchMethod)
    this.whatsappFlows = createWhatsAppFlowsRoutes(fetchMethod)
    this.contacts = createContactsRoutes(fetchMethod)
    this.customFields = createCustomFieldsRoutes(fetchMethod)
    this.broadcasts = createBroadcastsRoutes(fetchMethod)
    this.sequences = createSequencesRoutes(fetchMethod)
    this.commentAutomations = createCommentAutomationsRoutes(fetchMethod)
    this.ads = createAdsRoutes(fetchMethod)
    this.adAudiences = createAdAudiencesRoutes(fetchMethod)
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
  PostsRoutes,
  AccountsRoutes,
  AnalyticsRoutes,
  ToolsRoutes,
  InboxRoutes,
  ProfilesRoutes,
  UsersRoutes,
  QueueRoutes,
  WebhooksRoutes,
  MediaRoutes,
  UsageRoutes,
  ConnectRoutes,
  AccountGroupsRoutes,
  ApiKeysRoutes,
  InvitesRoutes,
  DiscordRoutes,
  LogsRoutes,
  WhatsAppRoutes,
  WhatsAppFlowsRoutes,
  ContactsRoutes,
  CustomFieldsRoutes,
  BroadcastsRoutes,
  SequencesRoutes,
  CommentAutomationsRoutes,
  AdsRoutes,
  AdAudiencesRoutes,
}

export type { paths }
