// ============================================================
// Route Groups - Organized by domain
// ============================================================

// Core: profiles, accounts, connect, apiKeys, logs
export { createProfilesRoutes, type ProfilesRoutes } from './core/profiles'
export { createAccountsRoutes, type AccountsRoutes } from './core/accounts'
export { createConnectRoutes, type ConnectRoutes } from './core/connect'
export { createApiKeysRoutes, type ApiKeysRoutes } from './core/apiKeys'
export { createLogsRoutes, type LogsRoutes } from './core/logs'

// Content & Scheduling: posts, queue, media, validate
export { createPostsRoutes, type PostsRoutes } from './content/posts'
export { createQueueRoutes, type QueueRoutes } from './content/queue'
export { createMediaRoutes, type MediaRoutes } from './content/media'
export { createToolsRoutes, type ToolsRoutes } from './content/tools'

// Inbox: messages, comments, reviews, broadcasts, contacts, customFields, sequences, commentAutomations
export { createInboxRoutes, type InboxRoutes } from './inbox/inbox'
export { createBroadcastsRoutes, type BroadcastsRoutes } from './inbox/broadcasts'
export { createContactsRoutes, type ContactsRoutes } from './inbox/contacts'
export { createCustomFieldsRoutes, type CustomFieldsRoutes } from './inbox/customFields'
export { createSequencesRoutes, type SequencesRoutes } from './inbox/sequences'
export { createCommentAutomationsRoutes, type CommentAutomationsRoutes } from './inbox/commentAutomations'

// Analytics
export { createAnalyticsRoutes, type AnalyticsRoutes } from './analytics/analytics'

// Webhooks
export { createWebhooksRoutes, type WebhooksRoutes } from './webhooks/webhooks'

// Advertising
export { createAdsRoutes, type AdsRoutes } from './advertising/ads'
export { createAdAudiencesRoutes, type AdAudiencesRoutes } from './advertising/adAudiences'

// Platform APIs
export { createWhatsAppRoutes, type WhatsAppRoutes } from './platform/whatsapp'
export { createWhatsAppFlowsRoutes, type WhatsAppFlowsRoutes } from './platform/whatsappFlows'
export { createDiscordRoutes, type DiscordRoutes } from './platform/discord'

// Settings & Admin
export { createAccountGroupsRoutes, type AccountGroupsRoutes } from './admin/accountGroups'
export { createUsersRoutes, type UsersRoutes } from './admin/users'
export { createInvitesRoutes, type InvitesRoutes } from './admin/invites'
export { createUsageRoutes, type UsageRoutes } from './admin/usage'
