import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  externalPostId: text('external_post_id'),
  text: text('text').notNull().default(''),
  mediaUrls: text('media_urls').array().notNull().default([]),
  platforms: text('platforms').array().notNull().default([]),
  status: text('status', { enum: ['draft', 'scheduled', 'published', 'failed'] }).notNull().default('draft'),
  scheduledAt: bigint('scheduled_at', { mode: 'number' }),
  publishedAt: bigint('published_at', { mode: 'number' }),
  platformPostIds: text('platform_post_ids'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;