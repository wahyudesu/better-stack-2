import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clerkOrgId: text('clerk_org_id'),
  clerkOrgSlug: text('clerk_org_slug'),
  clerkOrgRole: text('clerk_org_role'),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  isDefault: text('is_default').notNull().default('false'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;