import { pgTable, uuid, text, bigint, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  apiKey: text('api_key'),
  email: text('email').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  lastSyncedAt: bigint('last_synced_at', { mode: 'number' }),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
}, (table) => ({
  clerkIdIdx: uniqueIndex('idx_users_clerk_id').on(table.clerkId),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;