import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'

// Route handlers - Core
import { createPostsHandlers } from './routes/handlers/posts'
import { createQueueHandlers } from './routes/handlers/queue'
import { createMediaHandlers } from './routes/handlers/media'
import { createToolsHandlers } from './routes/handlers/tools'
import { createSyncHandlers } from './routes/handlers/sync'
import { createProfilesHandlers } from './routes/handlers/profiles'
import { createAccountsHandlers } from './routes/handlers/accounts'
import { createConnectHandlers } from './routes/handlers/connect'
import { createApiKeysHandlers } from './routes/handlers/apiKeys'
import { createLogsHandlers } from './routes/handlers/logs'

// Route handlers - Inbox
import { createMessagesHandlers } from './routes/handlers/messages'
import { createCommentsHandlers } from './routes/handlers/comments'
import { createReviewsHandlers } from './routes/handlers/reviews'
import { createBroadcastsHandlers } from './routes/handlers/broadcasts'
import { createContactsHandlers } from './routes/handlers/contacts'
import { createCustomFieldsHandlers } from './routes/handlers/customFields'
import { createSequencesHandlers } from './routes/handlers/sequences'
import { createCommentAutomationsHandlers } from './routes/handlers/commentAutomations'

// Route handlers - Analytics & Webhooks
import { createAnalyticsHandlers } from './routes/handlers/analytics'
import { createWebhooksHandlers } from './routes/handlers/webhooks'

// Route handlers - Advertising
import { createAdsHandlers } from './routes/handlers/ads'
import { createAdCampaignsHandlers } from './routes/handlers/adCampaigns'
import { createAdAudiencesHandlers } from './routes/handlers/adAudiences'

// Route handlers - Platform APIs
import { createWhatsAppHandlers } from './routes/handlers/whatsapp'
import { createWhatsAppPhoneNumbersHandlers } from './routes/handlers/whatsappPhoneNumbers'
import { createWhatsAppFlowsHandlers } from './routes/handlers/whatsappFlows'
import { createGoogleBusinessHandlers } from './routes/handlers/googleBusiness'
// Discord routes are handled via accountSettings
import { createLinkedInMentionsHandlers } from './routes/handlers/linkedinMentions'
import { createRedditSearchHandlers } from './routes/handlers/redditSearch'
import { createTwitterEngagementHandlers } from './routes/handlers/twitter'

// Route handlers - Settings & Admin
import { createAccountSettingsHandlers } from './routes/handlers/accountSettings'
import { createAccountGroupsHandlers } from './routes/handlers/accountGroups'
import { createUsersHandlers } from './routes/handlers/users'
import { createInvitesHandlers } from './routes/handlers/invites'
import { createUsageHandlers } from './routes/handlers/usage'
import { createBillingHandlers } from './routes/handlers/billing'

// Cloudflare Worker environment bindings
export interface Env {
	ZERNIO_API_KEY: string
	API_BASE_URL?: string
	ASSETS: { fetch: typeof fetch }
}

// Hono context variables
interface Variables {
	userApiKey?: string
}

// Create Hono app with Worker types and context variables
const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// CORS middleware
app.use('/*', cors({
	origin: '*',
	allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}))

// Health check
app.get('/', async (c) => {
	return c.json({
		name: 'Zernio API Client',
		version: '1.0.0',
		status: 'healthy',
		timestamp: new Date().toISOString(),
	})
})

app.get('/health', async (c) => {
	return c.json({ status: 'ok' })
})

// Serve the OpenAPI spec
app.get('/zernio-api-openapi.yaml', async (c) => {
	const res = await c.env.ASSETS.fetch(new Request('http://localhost/zernio-api-openapi.yaml'))
	return res
})

// Scalar API docs
app.use('/docs', Scalar({ url: '/zernio-api-openapi.yaml' }))

// ============================================================
// Auth Middleware
// ============================================================
app.use('/v1/*', async (c, next) => {
	const apiKeyHeader = c.req.header('X-API-Key')
	if (apiKeyHeader) {
		c.set('userApiKey', apiKeyHeader)
		await next()
		return
	}

	const authHeader = c.req.header('Authorization')
	const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
	if (bearerToken) {
		c.set('userApiKey', bearerToken)
		await next()
		return
	}

	return c.json({ error: 'API key required. Pass via Authorization: Bearer sk_xxx or X-API-Key header' }, 401)
})

// ============================================================
// Instantiate all route handlers
// ============================================================
const postsHandlers = createPostsHandlers()
const queueHandlers = createQueueHandlers()
const mediaHandlers = createMediaHandlers()
const toolsHandlers = createToolsHandlers()
const syncHandlers = createSyncHandlers()
const profilesHandlers = createProfilesHandlers()
const accountsHandlers = createAccountsHandlers()
const connectHandlers = createConnectHandlers()
const apiKeysHandlers = createApiKeysHandlers()
const logsHandlers = createLogsHandlers()
const messagesHandlers = createMessagesHandlers()
const commentsHandlers = createCommentsHandlers()
const reviewsHandlers = createReviewsHandlers()
const broadcastsHandlers = createBroadcastsHandlers()
const contactsHandlers = createContactsHandlers()
const customFieldsHandlers = createCustomFieldsHandlers()
const sequencesHandlers = createSequencesHandlers()
const commentAutomationsHandlers = createCommentAutomationsHandlers()
const analyticsHandlers = createAnalyticsHandlers()
const webhooksHandlers = createWebhooksHandlers()
const adsHandlers = createAdsHandlers()
const adCampaignsHandlers = createAdCampaignsHandlers()
const adAudiencesHandlers = createAdAudiencesHandlers()
const whatsAppHandlers = createWhatsAppHandlers()
const whatsAppPhoneNumbersHandlers = createWhatsAppPhoneNumbersHandlers()
const whatsAppFlowsHandlers = createWhatsAppFlowsHandlers()
const googleBusinessHandlers = createGoogleBusinessHandlers()
// Note: Discord settings/channels handled via accountSettingsHandlers
const linkedInMentionsHandlers = createLinkedInMentionsHandlers()
const redditSearchHandlers = createRedditSearchHandlers()
const twitterHandlers = createTwitterEngagementHandlers()
const accountSettingsHandlers = createAccountSettingsHandlers()
const accountGroupsHandlers = createAccountGroupsHandlers()
const usersHandlers = createUsersHandlers()
const invitesHandlers = createInvitesHandlers()
const usageHandlers = createUsageHandlers()
const billingHandlers = createBillingHandlers()

// ============================================================
// Core Routes
// ============================================================
// Profiles
app.get('/v1/profiles', profilesHandlers.list)
app.post('/v1/profiles', profilesHandlers.create)
app.get('/v1/profiles/:profileId', profilesHandlers.get)
app.patch('/v1/profiles/:profileId', profilesHandlers.update)
app.delete('/v1/profiles/:profileId', profilesHandlers.delete)

// Accounts
app.get('/v1/accounts', accountsHandlers.list)
app.get('/v1/accounts/:accountId', accountsHandlers.get)
app.get('/v1/accounts/:accountId/health', accountsHandlers.health)
app.get('/v1/accounts/follower-stats', accountsHandlers.followerStats)
app.get('/v1/accounts/health', accountsHandlers.health)

// Account-specific endpoints
app.get('/v1/accounts/:accountId/tiktok/creator-info', accountsHandlers.tiktokCreatorInfo)
app.get('/v1/accounts/:accountId/facebook-page', accountsHandlers.getFacebookPage)
app.get('/v1/accounts/:accountId/linkedin-organizations', accountsHandlers.linkedinOrganizations)
app.get('/v1/accounts/:accountId/linkedin-aggregate-analytics', accountsHandlers.linkedinAggregateAnalytics)
app.get('/v1/accounts/:accountId/linkedin-post-analytics', accountsHandlers.linkedinPostAnalytics)
app.get('/v1/accounts/:accountId/linkedin-post-reactions', accountsHandlers.linkedinPostReactions)
app.get('/v1/accounts/:accountId/linkedin-organization', accountsHandlers.linkedinOrganization)
app.get('/v1/accounts/:accountId/linkedin-mentions', linkedInMentionsHandlers.list)
app.get('/v1/accounts/:accountId/pinterest-boards', accountsHandlers.pinterestBoards)
app.get('/v1/accounts/:accountId/youtube-playlists', accountsHandlers.youtubePlaylists)
app.get('/v1/accounts/:accountId/conversion-destinations', accountsHandlers.listConversionDestinations)

// GMB (Google Business)
app.get('/v1/accounts/:accountId/gmb-locations', googleBusinessHandlers.getLocations)
app.get('/v1/accounts/:accountId/gmb-reviews', googleBusinessHandlers.getReviews)
app.post('/v1/accounts/:accountId/gmb-reviews/batch', googleBusinessHandlers.batchReply)
app.get('/v1/accounts/:accountId/gmb-food-menus', googleBusinessHandlers.getFoodMenus)
app.put('/v1/accounts/:accountId/gmb-food-menus', googleBusinessHandlers.updateFoodMenus)
app.get('/v1/accounts/:accountId/gmb-location-details', googleBusinessHandlers.getLocationDetails)
app.put('/v1/accounts/:accountId/gmb-location-details', googleBusinessHandlers.updateLocationDetails)
app.get('/v1/accounts/:accountId/gmb-media', googleBusinessHandlers.getMedia)
app.post('/v1/accounts/:accountId/gmb-media', googleBusinessHandlers.createMedia)
app.delete('/v1/accounts/:accountId/gmb-media', googleBusinessHandlers.deleteMedia)
app.get('/v1/accounts/:accountId/gmb-attributes', googleBusinessHandlers.getAttributes)
app.put('/v1/accounts/:accountId/gmb-attributes', googleBusinessHandlers.updateAttributes)
app.get('/v1/accounts/:accountId/gmb-place-actions', googleBusinessHandlers.getPlaceActions)
app.post('/v1/accounts/:accountId/gmb-place-actions', googleBusinessHandlers.createPlaceAction)
app.put('/v1/accounts/:accountId/gmb-place-actions', googleBusinessHandlers.updatePlaceAction)
app.delete('/v1/accounts/:accountId/gmb-place-actions', googleBusinessHandlers.deletePlaceAction)
app.get('/v1/accounts/:accountId/gmb-services', googleBusinessHandlers.getServices)
app.put('/v1/accounts/:accountId/gmb-services', googleBusinessHandlers.updateServices)

// Account Settings
app.get('/v1/accounts/:accountId/messenger-menu', accountSettingsHandlers.getMessengerMenu)
app.put('/v1/accounts/:accountId/messenger-menu', accountSettingsHandlers.setMessengerMenu)
app.delete('/v1/accounts/:accountId/messenger-menu', accountSettingsHandlers.deleteMessengerMenu)
app.get('/v1/accounts/:accountId/instagram-ice-breakers', accountSettingsHandlers.getInstagramIceBreakers)
app.put('/v1/accounts/:accountId/instagram-ice-breakers', accountSettingsHandlers.setInstagramIceBreakers)
app.delete('/v1/accounts/:accountId/instagram-ice-breakers', accountSettingsHandlers.deleteInstagramIceBreakers)
app.get('/v1/accounts/:accountId/telegram-commands', accountSettingsHandlers.getTelegramCommands)
app.put('/v1/accounts/:accountId/telegram-commands', accountSettingsHandlers.setTelegramCommands)
app.delete('/v1/accounts/:accountId/telegram-commands', accountSettingsHandlers.deleteTelegramCommands)
app.get('/v1/accounts/:accountId/discord-settings', accountSettingsHandlers.getDiscordSettings)
app.put('/v1/accounts/:accountId/discord-settings', accountSettingsHandlers.updateDiscordSettings)
app.get('/v1/accounts/:accountId/discord-channels', accountSettingsHandlers.getDiscordChannels)

// Reddit
app.get('/v1/accounts/:accountId/reddit-subreddits', accountsHandlers.redditSubreddits)
app.get('/v1/accounts/:accountId/reddit-flairs', accountsHandlers.redditFlairs)

// Connect
app.get('/v1/connect/:platform', connectHandlers.connect)
app.get('/v1/connect/:platform/ads', connectHandlers.connectAds)
app.post('/v1/connect/facebook/select-page', connectHandlers.selectFacebookPage)
app.get('/v1/connect/googlebusiness/locations', connectHandlers.listGoogleBusinessLocations)
app.post('/v1/connect/googlebusiness/select-location', connectHandlers.selectGoogleBusinessLocation)
app.get('/v1/connect/linkedin/organizations', connectHandlers.listLinkedInOrganizations)
app.post('/v1/connect/linkedin/select-organization', connectHandlers.selectLinkedInOrganization)
app.get('/v1/connect/pinterest/boards', connectHandlers.listPinterestBoards)
app.post('/v1/connect/pinterest/select-board', connectHandlers.selectPinterestBoard)
app.get('/v1/connect/snapchat/profiles', connectHandlers.listSnapchatProfiles)
app.post('/v1/connect/snapchat/select-profile', connectHandlers.selectSnapchatProfile)
app.post('/v1/connect/bluesky/credentials', connectHandlers.connectBluesky)
app.post('/v1/connect/whatsapp/credentials', connectHandlers.connectWhatsApp)
app.get('/v1/connect/whatsapp/select-phone-number', connectHandlers.selectWhatsAppPhoneNumber)
app.post('/v1/connect/telegram', connectHandlers.initiateTelegram)
app.get('/v1/connect/telegram', connectHandlers.getTelegramStatus)
app.get('/v1/connect/tiktok-ads', connectHandlers.connectTiktokAds)
app.get('/v1/connect/pending-data', connectHandlers.getPendingData)

// API Keys
app.get('/v1/api-keys', apiKeysHandlers.list)
app.post('/v1/api-keys', apiKeysHandlers.create)
app.delete('/v1/api-keys/:keyId', apiKeysHandlers.delete)

// Logs
app.get('/v1/logs', logsHandlers.list)
app.get('/v1/webhooks/logs', logsHandlers.listWebhookLogs)

// ============================================================
// Content & Scheduling Routes
// ============================================================
// Posts
app.get('/v1/posts', postsHandlers.list)
app.post('/v1/posts', postsHandlers.create)
app.get('/v1/posts/:postId', postsHandlers.get)
app.put('/v1/posts/:postId', postsHandlers.update)
app.delete('/v1/posts/:postId', postsHandlers.delete)
app.post('/v1/posts/bulk-upload', postsHandlers.bulkUpload)
app.post('/v1/posts/:postId/edit', postsHandlers.edit)
app.patch('/v1/posts/:postId/update-metadata', postsHandlers.updateMetadata)
app.post('/v1/posts/:postId/retry', postsHandlers.retry)
app.post('/v1/posts/:postId/unpublish', postsHandlers.unpublish)
app.get('/v1/posts/:postId/logs', postsHandlers.getLogs)

// Queue
app.get('/v1/queue/slots', queueHandlers.listSlots)
app.post('/v1/queue/slots', queueHandlers.createSlot)
app.put('/v1/queue/slots', queueHandlers.updateSlot)
app.delete('/v1/queue/slots', queueHandlers.deleteSlot)
app.get('/v1/queue/preview', queueHandlers.preview)
app.get('/v1/queue/next-slot', queueHandlers.nextSlot)

// Media
app.post('/v1/media/presign', mediaHandlers.presign)
app.get('/v1/media/:mediaId', mediaHandlers.get)
app.post('/v1/media/upload', mediaHandlers.upload)
app.post('/v1/media/upload-direct', mediaHandlers.uploadDirect)

// Tools / Validate
app.get('/v1/tools/youtube/download', toolsHandlers.youtubeDownload)
app.get('/v1/tools/youtube/transcript', toolsHandlers.youtubeTranscript)
app.get('/v1/tools/instagram/download', toolsHandlers.instagramDownload)
app.post('/v1/tools/instagram/hashtag-checker', toolsHandlers.instagramHashtagChecker)
app.get('/v1/tools/tiktok/download', toolsHandlers.tiktokDownload)
app.get('/v1/tools/twitter/download', toolsHandlers.twitterDownload)
app.get('/v1/tools/facebook/download', toolsHandlers.facebookDownload)
app.get('/v1/tools/linkedin/download', toolsHandlers.linkedinDownload)
app.get('/v1/tools/bluesky/download', toolsHandlers.blueskyDownload)
app.post('/v1/tools/validate/post-length', toolsHandlers.validatePostLength)
app.post('/v1/tools/validate/post', toolsHandlers.validatePost)
app.post('/v1/tools/validate/media', toolsHandlers.validateMedia)
app.post('/v1/tools/validate/subreddit', toolsHandlers.validateSubreddit)

// Sync
app.post('/v1/sync/posts', syncHandlers.posts)
app.post('/v1/sync/accounts', syncHandlers.accounts)

// ============================================================
// Inbox Routes
// ============================================================
// Messages
app.get('/v1/inbox/messages', messagesHandlers.list)
app.post('/v1/inbox/messages', messagesHandlers.create)
app.get('/v1/inbox/messages/:conversationId', messagesHandlers.get)
app.put('/v1/inbox/messages/:conversationId', messagesHandlers.update)
app.get('/v1/inbox/messages/:conversationId/messages', messagesHandlers.getMessages)
app.post('/v1/inbox/messages/:conversationId/messages', messagesHandlers.send)
app.patch('/v1/inbox/messages/:conversationId/messages/:messageId', messagesHandlers.editMessage)
app.delete('/v1/inbox/messages/:conversationId/messages/:messageId', messagesHandlers.deleteMessage)
app.post('/v1/inbox/messages/:conversationId/messages/:messageId/reactions', messagesHandlers.addReaction)
app.delete('/v1/inbox/messages/:conversationId/messages/:messageId/reactions', messagesHandlers.removeReaction)
app.post('/v1/inbox/messages/:conversationId/typing', messagesHandlers.sendTyping)

// Comments
app.get('/v1/inbox/comments', commentsHandlers.list)
app.get('/v1/inbox/comments/:postId', commentsHandlers.get)
app.post('/v1/inbox/comments/:postId/:commentId/hide', commentsHandlers.hide)
app.delete('/v1/inbox/comments/:postId/:commentId/hide', commentsHandlers.unhide)
app.post('/v1/inbox/comments/:postId/:commentId/like', commentsHandlers.like)
app.delete('/v1/inbox/comments/:postId/:commentId/like', commentsHandlers.unlike)
app.post('/v1/inbox/comments/:postId/:commentId/private-reply', commentsHandlers.privateReply)
app.delete('/v1/inbox/comments/:postId', commentsHandlers.delete)

// Reviews
app.get('/v1/inbox/reviews', reviewsHandlers.list)
app.post('/v1/inbox/reviews/:reviewId/reply', reviewsHandlers.reply)
app.delete('/v1/inbox/reviews/:reviewId/reply', reviewsHandlers.deleteReply)

// Broadcasts
app.get('/v1/broadcasts', broadcastsHandlers.list)
app.post('/v1/broadcasts', broadcastsHandlers.create)
app.get('/v1/broadcasts/:broadcastId', broadcastsHandlers.get)
app.patch('/v1/broadcasts/:broadcastId', broadcastsHandlers.update)
app.delete('/v1/broadcasts/:broadcastId', broadcastsHandlers.delete)
app.post('/v1/broadcasts/:broadcastId/send', broadcastsHandlers.send)
app.post('/v1/broadcasts/:broadcastId/schedule', broadcastsHandlers.schedule)
app.post('/v1/broadcasts/:broadcastId/cancel', broadcastsHandlers.cancel)
app.get('/v1/broadcasts/:broadcastId/recipients', broadcastsHandlers.listRecipients)
app.post('/v1/broadcasts/:broadcastId/recipients', broadcastsHandlers.addRecipients)

// Contacts
app.get('/v1/contacts', contactsHandlers.list)
app.post('/v1/contacts', contactsHandlers.create)
app.get('/v1/contacts/:contactId', contactsHandlers.get)
app.patch('/v1/contacts/:contactId', contactsHandlers.update)
app.delete('/v1/contacts/:contactId', contactsHandlers.delete)
app.get('/v1/contacts/:contactId/channels', contactsHandlers.getChannels)
app.post('/v1/contacts/bulk', contactsHandlers.bulkCreate)
app.put('/v1/contacts/:contactId/fields/:slug', contactsHandlers.setField)
app.delete('/v1/contacts/:contactId/fields/:slug', contactsHandlers.clearField)

// Custom Fields
app.get('/v1/custom-fields', customFieldsHandlers.list)
app.post('/v1/custom-fields', customFieldsHandlers.create)
app.get('/v1/custom-fields/:fieldId', customFieldsHandlers.get)
app.patch('/v1/custom-fields/:fieldId', customFieldsHandlers.update)
app.delete('/v1/custom-fields/:fieldId', customFieldsHandlers.delete)

// Sequences
app.get('/v1/sequences', sequencesHandlers.list)
app.post('/v1/sequences', sequencesHandlers.create)
app.get('/v1/sequences/:sequenceId', sequencesHandlers.get)
app.patch('/v1/sequences/:sequenceId', sequencesHandlers.update)
app.delete('/v1/sequences/:sequenceId', sequencesHandlers.delete)
app.post('/v1/sequences/:sequenceId/activate', sequencesHandlers.activate)
app.post('/v1/sequences/:sequenceId/pause', sequencesHandlers.pause)
app.post('/v1/sequences/:sequenceId/enroll', sequencesHandlers.enroll)
app.post('/v1/sequences/:sequenceId/enroll/:contactId', sequencesHandlers.enrollContact)
app.delete('/v1/sequences/:sequenceId/enroll/:contactId', sequencesHandlers.unenroll)
app.get('/v1/sequences/:sequenceId/enrollments', sequencesHandlers.listEnrollments)

// Comment Automations
app.get('/v1/comment-automations', commentAutomationsHandlers.list)
app.post('/v1/comment-automations', commentAutomationsHandlers.create)
app.get('/v1/comment-automations/:automationId', commentAutomationsHandlers.get)
app.patch('/v1/comment-automations/:automationId', commentAutomationsHandlers.update)
app.delete('/v1/comment-automations/:automationId', commentAutomationsHandlers.delete)
app.get('/v1/comment-automations/:automationId/logs', commentAutomationsHandlers.getLogs)

// ============================================================
// Analytics Routes
// ============================================================
app.get('/v1/analytics', analyticsHandlers.get)
app.get('/v1/analytics/youtube/channel-insights', analyticsHandlers.youtubeChannelInsights)
app.get('/v1/analytics/youtube/daily-views', analyticsHandlers.youtubeDailyViews)
app.get('/v1/analytics/youtube/demographics', analyticsHandlers.youtubeDemographics)
app.get('/v1/analytics/facebook/page-insights', analyticsHandlers.facebookPageInsights)
app.get('/v1/analytics/instagram/account-insights', analyticsHandlers.instagramAccountInsights)
app.get('/v1/analytics/instagram/follower-history', analyticsHandlers.instagramFollowerHistory)
app.get('/v1/analytics/instagram/demographics', analyticsHandlers.instagramDemographics)
app.get('/v1/analytics/linkedin/org-aggregate-analytics', analyticsHandlers.linkedinOrgAggregateAnalytics)
app.get('/v1/analytics/tiktok/account-insights', analyticsHandlers.tiktokAccountInsights)
app.get('/v1/analytics/daily-metrics', analyticsHandlers.dailyMetrics)
app.get('/v1/analytics/best-time', analyticsHandlers.bestTime)
app.get('/v1/analytics/content-decay', analyticsHandlers.contentDecay)
app.get('/v1/analytics/posting-frequency', analyticsHandlers.postingFrequency)
app.get('/v1/analytics/post-timeline', analyticsHandlers.postTimeline)
app.get('/v1/analytics/googlebusiness/performance', analyticsHandlers.googlebusinessPerformance)
app.get('/v1/analytics/googlebusiness/search-keywords', analyticsHandlers.googlebusinessSearchKeywords)

// ============================================================
// Webhooks Routes
// ============================================================
app.get('/v1/webhooks/settings', webhooksHandlers.listSettings)
app.post('/v1/webhooks/settings', webhooksHandlers.createSetting)
app.get('/v1/webhooks/settings/:webhookId', webhooksHandlers.getSetting)
app.patch('/v1/webhooks/settings/:webhookId', webhooksHandlers.updateSetting)
app.delete('/v1/webhooks/settings/:webhookId', webhooksHandlers.deleteSetting)
app.post('/v1/webhooks/test', webhooksHandlers.test)

// ============================================================
// Advertising Routes
// ============================================================
app.get('/v1/ads/accounts', adsHandlers.listAccounts)
app.get('/v1/ads', adsHandlers.list)
app.get('/v1/ads/:adId', adsHandlers.get)
app.post('/v1/ads/create', adsHandlers.create)
app.patch('/v1/ads/:adId', adsHandlers.update)
app.delete('/v1/ads/:adId', adsHandlers.delete)
app.get('/v1/ads/:adId/analytics', adsHandlers.getAnalytics)
app.get('/v1/ads/:adId/comments', adsHandlers.getAdComments)
app.post('/v1/ads/boost', adsHandlers.boost)
app.get('/v1/ads/interests', adsHandlers.searchInterests)
app.post('/v1/ads/conversions', adsHandlers.sendConversions)
app.get('/v1/ads/tree', adsHandlers.getTree)
app.get('/v1/ads/targeting/search', adsHandlers.searchTargeting)
app.get('/v1/ads/business-centers', adsHandlers.listBusinessCenters)

// Ad Campaigns
app.get('/v1/ads/campaigns', adCampaignsHandlers.list)
app.get('/v1/ads/campaigns/:campaignId', adCampaignsHandlers.get)
app.post('/v1/ads/campaigns/:campaignId/status', adCampaignsHandlers.updateStatus)
app.post('/v1/ads/campaigns/:campaignId/duplicate', adCampaignsHandlers.duplicate)
app.post('/v1/ads/campaigns/bulk-status', adCampaignsHandlers.bulkUpdateStatus)
app.get('/v1/ads/ad-sets/:adSetId', adsHandlers.getAdSet)
app.post('/v1/ads/ad-sets/:adSetId/status', adsHandlers.updateAdSetStatus)

// Ad Audiences
app.get('/v1/ads/audiences', adAudiencesHandlers.list)
app.post('/v1/ads/audiences', adAudiencesHandlers.create)
app.get('/v1/ads/audiences/:audienceId', adAudiencesHandlers.get)
app.delete('/v1/ads/audiences/:audienceId', adAudiencesHandlers.delete)
app.get('/v1/ads/audiences/:audienceId/users', adAudiencesHandlers.listUsers)
app.post('/v1/ads/audiences/:audienceId/users', adAudiencesHandlers.addUsers)
app.get('/v1/ads/ctwa', adsHandlers.getCTWA)

// ============================================================
// Platform APIs - WhatsApp
// ============================================================
// WhatsApp Templates
app.get('/v1/whatsapp/templates', whatsAppHandlers.listTemplates)
app.post('/v1/whatsapp/templates', whatsAppHandlers.createTemplate)
app.get('/v1/whatsapp/templates/:templateName', whatsAppHandlers.getTemplate)
app.patch('/v1/whatsapp/templates/:templateName', whatsAppHandlers.updateTemplate)
app.delete('/v1/whatsapp/templates/:templateName', whatsAppHandlers.deleteTemplate)

// WhatsApp Business Profile
app.get('/v1/whatsapp/business-profile', whatsAppHandlers.getBusinessProfile)
app.post('/v1/whatsapp/business-profile', whatsAppHandlers.updateBusinessProfile)
app.post('/v1/whatsapp/business-profile/photo', whatsAppHandlers.uploadBusinessProfilePhoto)
app.get('/v1/whatsapp/business-profile/display-name', whatsAppHandlers.getDisplayNameStatus)
app.post('/v1/whatsapp/business-profile/display-name', whatsAppHandlers.updateDisplayName)

// WhatsApp Phone Numbers
app.get('/v1/whatsapp/phone-numbers', whatsAppPhoneNumbersHandlers.list)
app.get('/v1/whatsapp/phone-numbers/:phoneNumberId', whatsAppPhoneNumbersHandlers.get)
app.post('/v1/whatsapp/phone-numbers/purchase', whatsAppPhoneNumbersHandlers.purchase)
app.delete('/v1/whatsapp/phone-numbers/:phoneNumberId', whatsAppPhoneNumbersHandlers.release)

// WhatsApp Flows
app.get('/v1/whatsapp/flows', whatsAppFlowsHandlers.list)
app.post('/v1/whatsapp/flows', whatsAppFlowsHandlers.create)
app.get('/v1/whatsapp/flows/:flowId', whatsAppFlowsHandlers.get)
app.put('/v1/whatsapp/flows/:flowId', whatsAppFlowsHandlers.update)
app.delete('/v1/whatsapp/flows/:flowId', whatsAppFlowsHandlers.delete)
app.get('/v1/whatsapp/flows/:flowId/json', whatsAppFlowsHandlers.getJson)
app.post('/v1/whatsapp/flows/:flowId/json', whatsAppFlowsHandlers.uploadJson)
app.post('/v1/whatsapp/flows/:flowId/publish', whatsAppFlowsHandlers.publish)
app.post('/v1/whatsapp/flows/:flowId/deprecate', whatsAppFlowsHandlers.deprecate)
app.post('/v1/whatsapp/flows/send', whatsAppFlowsHandlers.send)

// WhatsApp Groups
app.get('/v1/whatsapp/wa-groups', whatsAppHandlers.listGroups)
app.post('/v1/whatsapp/wa-groups', whatsAppHandlers.createGroup)
app.get('/v1/whatsapp/wa-groups/:groupId', whatsAppHandlers.getGroup)
app.put('/v1/whatsapp/wa-groups/:groupId', whatsAppHandlers.updateGroup)
app.delete('/v1/whatsapp/wa-groups/:groupId', whatsAppHandlers.deleteGroup)
app.get('/v1/whatsapp/wa-groups/:groupId/participants', whatsAppHandlers.listParticipants)
app.post('/v1/whatsapp/wa-groups/:groupId/participants', whatsAppHandlers.addParticipants)
app.delete('/v1/whatsapp/wa-groups/:groupId/participants', whatsAppHandlers.removeParticipants)
app.post('/v1/whatsapp/wa-groups/:groupId/invite-link', whatsAppHandlers.createInviteLink)
app.get('/v1/whatsapp/wa-groups/:groupId/join-requests', whatsAppHandlers.listJoinRequests)
app.post('/v1/whatsapp/wa-groups/:groupId/join-requests', whatsAppHandlers.approveJoinRequests)

// WhatsApp Conversions
app.post('/v1/whatsapp/conversions', whatsAppHandlers.sendConversions)

// ============================================================
// Platform APIs - Other Platforms
// ============================================================
// Note: Discord settings/channels handled via accountSettingsHandlers under /v1/accounts/:accountId/discord-*

// Reddit Search
app.get('/v1/reddit/search', redditSearchHandlers.search)
app.get('/v1/reddit/feed', redditSearchHandlers.feed)

// Twitter Engagement
app.post('/v1/twitter/retweet', twitterHandlers.retweet)
app.delete('/v1/twitter/retweet', twitterHandlers.undoRetweet)
app.post('/v1/twitter/bookmark', twitterHandlers.bookmark)
app.delete('/v1/twitter/bookmark', twitterHandlers.removeBookmark)
app.post('/v1/twitter/follow', twitterHandlers.follow)
app.delete('/v1/twitter/follow', twitterHandlers.unfollow)

// ============================================================
// Settings & Admin Routes
// ============================================================
// Account Groups
app.get('/v1/account-groups', accountGroupsHandlers.list)
app.post('/v1/account-groups', accountGroupsHandlers.create)
app.get('/v1/account-groups/:groupId', accountGroupsHandlers.get)
app.patch('/v1/account-groups/:groupId', accountGroupsHandlers.update)
app.delete('/v1/account-groups/:groupId', accountGroupsHandlers.delete)

// Users
app.get('/v1/user', usersHandlers.get)
app.patch('/v1/user', usersHandlers.update)
app.get('/v1/users', usersHandlers.list)
app.get('/v1/users/:userId', usersHandlers.getById)
app.patch('/v1/users/:userId', usersHandlers.updateById)

// Invites
app.post('/v1/invite/tokens', invitesHandlers.createToken)
app.get('/v1/invite/tokens', invitesHandlers.listTokens)

// Usage Stats
app.get('/v1/usage-stats', usageHandlers.list)

// Billing
app.get('/v1/billing/x-pricing', billingHandlers.getPricing)

// Export for Cloudflare Workers
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return app.fetch(request, env, ctx)
	},
}

// Also export the AppType for client creation
export type AppType = typeof app