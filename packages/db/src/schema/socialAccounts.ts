import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { users } from './users';

export const socialAccounts = pgTable('social_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  accountId: text('account_id').notNull(),
  accountName: text('account_name').notNull(),
  avatarUrl: text('avatar_url'),
  status: text('status', { enum: ['active', 'error', 'disconnected'] }).notNull().default('active'),
  connectedAt: bigint('connected_at', { mode: 'number' }).notNull(),
  tokens: text('tokens'),
});

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;