/**
 * Inbox route index
 * All inbox-related routes: messages, comments, reviews, broadcasts, contacts, custom fields, sequences, comment automations
 */

// Messages (Conversations & DMs)
export { createMessagesRoutes, type MessagesRoutes } from './messages'

// Comments
export { createCommentsRoutes, type CommentsRoutes } from './comments'

// Reviews
export { createReviewsRoutes, type ReviewsRoutes } from './reviews'

// Broadcasts
export { createBroadcastsRoutes, type BroadcastsRoutes } from './broadcasts'

// Contacts
export { createContactsRoutes, type ContactsRoutes } from './contacts'

// Custom Fields
export { createCustomFieldsRoutes, type CustomFieldsRoutes } from './customFields'

// Sequences
export { createSequencesRoutes, type SequencesRoutes } from './sequences'

// Comment Automations
export { createCommentAutomationsRoutes, type CommentAutomationsRoutes } from './commentAutomations'