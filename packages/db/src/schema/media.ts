import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  storageId: text('storage_id').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  url: text('url').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;