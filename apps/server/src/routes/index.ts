// ============================================================
// Route Groups - Organized by domain (per Zernio API docs)
// ============================================================

// ============ Core ============
export { createProfilesRoutes, type ProfilesRoutes } from './core/profiles'
export { createAccountsRoutes, type AccountsRoutes } from './core/accounts'
export { createConnectRoutes, type ConnectRoutes } from './core/connect'
export { createApiKeysRoutes, type ApiKeysRoutes } from './core/apiKeys'
export { createLogsRoutes, type LogsRoutes } from './core/logs'

// ============ Content & Scheduling ============
export { createPostsRoutes, type PostsRoutes } from './content/posts'
export { createQueueRoutes, type QueueRoutes } from './content/queue'
export { createMediaRoutes, type MediaRoutes } from './content/media'
export { createToolsRoutes, type ToolsRoutes } from './content/tools'

// ============ Inbox ============
export {
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
} from './inbox'

// ============ Analytics ============
export { createAnalyticsRoutes, type AnalyticsRoutes } from './analytics/analytics'

// ============ Webhooks ============
export { createWebhooksRoutes, type WebhooksRoutes } from './webhooks/webhooks'

// ============ Advertising ============
export { createAdsRoutes, type AdsRoutes } from './advertising/ads'
export { createAdCampaignsRoutes, type AdCampaignsRoutes } from './advertising/adCampaigns'
export { createAdAudiencesRoutes, type AdAudiencesRoutes } from './advertising/adAudiences'

// ============ Platform APIs ============
export { createWhatsAppRoutes, type WhatsAppRoutes } from './platform/whatsapp'
export { createWhatsAppPhoneNumbersRoutes, type WhatsAppPhoneNumbersRoutes } from './platform/whatsappPhoneNumbers'
export { createWhatsAppFlowsRoutes, type WhatsAppFlowsRoutes } from './platform/whatsappFlows'
export { createGoogleBusinessRoutes, type GoogleBusinessRoutes } from './platform/googleBusiness'
export { createDiscordRoutes, type DiscordRoutes } from './platform/discord'
export { createLinkedInMentionsRoutes, type LinkedInMentionsRoutes } from './platform/linkedinMentions'
export { createRedditSearchRoutes, type RedditSearchRoutes } from './platform/redditSearch'
export { createTwitterEngagementRoutes, type TwitterEngagementRoutes } from './platform/twitterEngagement'

// ============ Settings & Admin ============
export { createAccountSettingsRoutes, type AccountSettingsRoutes } from './admin/accountSettings'
export { createAccountGroupsRoutes, type AccountGroupsRoutes } from './admin/accountGroups'
export { createUsersRoutes, type UsersRoutes } from './admin/users'
export { createInvitesRoutes, type InvitesRoutes } from './admin/invites'
export { createUsageRoutes, type UsageRoutes } from './admin/usage'