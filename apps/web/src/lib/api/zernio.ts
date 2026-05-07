import { adminDb } from '@/lib/db';
import { posts, socialAccounts, users } from '@db/schema';
import { eq } from 'drizzle-orm';

const ZERNIO_API_URL = process.env.ZERNIO_API_URL!;

interface ZernioPost {
  externalId: string;
  text: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: number;
  publishedAt?: number;
  mediaUrls: string[];
  createdAt: number;
  updatedAt: number;
}

interface ZernioAccount {
  externalId: string;
  platform: string;
  accountName: string;
  avatarUrl?: string;
  status: 'active' | 'error' | 'disconnected';
  connectedAt: number;
}

async function getUserApiKey(clerkUserId: string): Promise<string | null> {
  const result = await adminDb.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });
  return result?.apiKey ?? null;
}

async function getUserId(clerkUserId: string): Promise<string | null> {
  const result = await adminDb.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });
  return result?.id ?? null;
}

export async function syncFromZernio(clerkUserId: string) {
  const apiKey = await getUserApiKey(clerkUserId);
  if (!apiKey) throw new Error('No API key configured');

  const userId = await getUserId(clerkUserId);
  if (!userId) throw new Error('User not found');

  const [zernioPosts, zernioAccounts] = await Promise.all([
    fetch(`${ZERNIO_API_URL}/posts`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => r.json() as Promise<ZernioPost[]>),
    fetch(`${ZERNIO_API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => r.json() as Promise<ZernioAccount[]>),
  ]);

  // Upsert posts
  for (const post of zernioPosts) {
    await adminDb
      .insert(posts)
      .values({
        userId,
        externalPostId: post.externalId,
        text: post.text,
        platforms: post.platforms,
        status: post.status,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt,
        mediaUrls: post.mediaUrls,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
      .onConflictDoUpdate({
        target: posts.externalPostId,
        set: {
          text: post.text,
          platforms: post.platforms,
          status: post.status,
          scheduledAt: post.scheduledAt,
          publishedAt: post.publishedAt,
          mediaUrls: post.mediaUrls,
          updatedAt: post.updatedAt,
        },
      });
  }

  // Upsert accounts
  for (const account of zernioAccounts) {
    await adminDb
      .insert(socialAccounts)
      .values({
        userId,
        platform: account.platform,
        accountId: account.externalId,
        accountName: account.accountName,
        avatarUrl: account.avatarUrl,
        status: account.status,
        connectedAt: account.connectedAt,
      })
      .onConflictDoUpdate({
        target: [socialAccounts.userId, socialAccounts.platform, socialAccounts.accountId],
        set: {
          accountName: account.accountName,
          avatarUrl: account.avatarUrl,
          status: account.status,
        },
      });
  }

  return { success: true, synced: zernioPosts.length + zernioAccounts.length };
}
