import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

// List all posts for the current user
export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) return [];

		const posts = await ctx.db
			.query("posts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		return posts.map((post) => ({
			_id: post.externalPostId || post._id,
			convexId: post._id,
			text: post.text,
			platforms: post.platforms,
			status: post.status,
			scheduledAt: post.scheduledAt
				? new Date(post.scheduledAt).toISOString()
				: null,
			publishedAt: post.publishedAt
				? new Date(post.publishedAt).toISOString()
				: null,
			mediaUrls: post.mediaUrls,
			accountIds: post.accountIds,
			createdAt: new Date(post.createdAt).toISOString(),
			updatedAt: new Date(post.updatedAt).toISOString(),
		}));
	},
});

// Internal mutation to write posts to DB (called by action)
export const writePostsToDb = mutation({
	args: {
		posts: v.array(
			v.object({
				externalId: v.string(),
				text: v.string(),
				platforms: v.array(v.string()),
				status: v.string(),
				scheduledAt: v.optional(v.number()),
				publishedAt: v.optional(v.number()),
				mediaUrls: v.array(v.string()),
				accountIds: v.array(v.string()),
				createdAt: v.number(),
				updatedAt: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const existingPosts = await ctx.db
			.query("posts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		const existingByExternalId = new Map(
			existingPosts.map((p) => [p.externalPostId, p]),
		);

		const newExternalIds = new Set(args.posts.map((p) => p.externalId));

		for (const post of args.posts) {
			const existing = existingByExternalId.get(post.externalId);

			if (existing) {
				await ctx.db.patch(existing._id, {
					text: post.text,
					platforms: post.platforms,
					status: post.status as any,
					scheduledAt: post.scheduledAt,
					publishedAt: post.publishedAt,
					mediaUrls: post.mediaUrls,
					updatedAt: post.updatedAt,
				});
			} else {
				await ctx.db.insert("posts", {
					userId: user._id,
					accountIds: [], // placeholder
					externalPostId: post.externalId,
					text: post.text,
					mediaUrls: post.mediaUrls,
					platforms: post.platforms,
					status: post.status as any,
					scheduledAt: post.scheduledAt,
					publishedAt: post.publishedAt,
					createdAt: post.createdAt,
					updatedAt: post.updatedAt,
				});
			}
		}

		// Optionally mark posts not in Zernio as disconnected?
		// For now keep all local posts

		await ctx.db.patch(user._id, {
			lastSyncedAt: Date.now(),
			updatedAt: Date.now(),
		});

		return { success: true, synced: args.posts.length };
	},
});

// Action to sync posts from Zernio (can use fetch)
export const syncFromZernio = action({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		// Get apiKey via runQuery
		const userInfo: { apiKey: string | null } = await ctx.runQuery(
			api.users.getApiKeyByClerkId,
			{ clerkId: identity.tokenIdentifier },
		);

		if (!userInfo?.apiKey) throw new Error("API key not configured");

		const zernioResponse = await fetch(
			`${process.env.ZERNIO_API_URL || "https://api.zernio.com"}/v1/posts`,
			{
				headers: {
					Authorization: `Bearer ${userInfo.apiKey}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!zernioResponse.ok) {
			throw new Error("Failed to fetch posts from Zernio");
		}

		const { posts: zernioPosts } = (await zernioResponse.json()) as {
			posts: Array<{
				_id: string;
				text?: string;
				content?: string;
				platforms?: Array<{ platform: string }>;
				status?: string;
				scheduledAt?: string;
				publishedAt?: string;
				media?: Array<{ url: string }>;
				accountIds?: string[];
				createdAt?: string;
				updatedAt?: string;
			}>;
		};

		const posts = zernioPosts.map((zPost) => ({
			externalId: zPost._id,
			text: zPost.text || zPost.content || "",
			platforms: zPost.platforms?.map((p) => p.platform) || [],
			status: (zPost.status as string) || "draft",
			scheduledAt: zPost.scheduledAt
				? new Date(zPost.scheduledAt).getTime()
				: undefined,
			publishedAt: zPost.publishedAt
				? new Date(zPost.publishedAt).getTime()
				: undefined,
			mediaUrls: zPost.media?.map((m) => m.url) || [],
			accountIds: zPost.accountIds || [],
			createdAt: zPost.createdAt
				? new Date(zPost.createdAt).getTime()
				: Date.now(),
			updatedAt: zPost.updatedAt
				? new Date(zPost.updatedAt).getTime()
				: Date.now(),
		}));

		return ctx.runMutation(api.posts.writePostsToDb, { posts });
	},
});

// Create a new post - writes to Zernio then stores in Convex
export const createPostToZernio = action({
	args: {
		text: v.string(),
		platforms: v.array(v.string()),
		scheduledAt: v.optional(v.number()),
		mediaUrls: v.array(v.string()),
		socialAccountIds: v.array(v.string()),
		profileId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		// Get apiKey via runQuery
		const userInfo: { apiKey: string | null } = await ctx.runQuery(
			api.users.getApiKeyByClerkId,
			{ clerkId: identity.tokenIdentifier },
		);

		if (!userInfo?.apiKey) throw new Error("API key not configured");

		// Create post in Zernio
		const zernioResponse = await fetch(
			`${process.env.ZERNIO_API_URL || "https://api.zernio.com"}/v1/posts`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${userInfo.apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: args.text,
					socialAccountIds: args.socialAccountIds,
					scheduledAt: args.scheduledAt
						? new Date(args.scheduledAt).toISOString()
						: undefined,
					profileId: args.profileId || undefined,
				}),
			},
		);

		if (!zernioResponse.ok) {
			const errText = await zernioResponse.text();
			throw new Error(`Failed to create post in Zernio: ${errText}`);
		}

		const zernioPost = (await zernioResponse.json()) as {
			_id: string;
			status?: string;
			scheduledAt?: string;
			publishedAt?: string;
		};

		// Call mutation to write to Convex
		return ctx.runMutation(api.posts.writePostToConvex, {
			externalId: zernioPost._id,
			text: args.text,
			platforms: args.platforms,
			scheduledAt: args.scheduledAt,
			mediaUrls: args.mediaUrls,
			status: zernioPost.status || (args.scheduledAt ? "scheduled" : "published"),
			scheduledAtZernio: zernioPost.scheduledAt || undefined,
			publishedAtZernio: zernioPost.publishedAt || undefined,
		});
	},
});

// Internal mutation to create post in Convex (called by action)
export const writePostToConvex = mutation({
	args: {
		externalId: v.string(),
		text: v.string(),
		platforms: v.array(v.string()),
		scheduledAt: v.optional(v.number()),
		mediaUrls: v.array(v.string()),
		status: v.string(),
		scheduledAtZernio: v.optional(v.string()),
		publishedAtZernio: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const now = Date.now();
		const postId = await ctx.db.insert("posts", {
			userId: user._id,
			externalPostId: args.externalId,
			text: args.text,
			mediaUrls: args.mediaUrls,
			platforms: args.platforms,
			accountIds: [],
			status: args.status as any,
			scheduledAt: args.scheduledAtZernio
				? new Date(args.scheduledAtZernio).getTime()
				: args.scheduledAt,
			publishedAt: args.publishedAtZernio
				? new Date(args.publishedAtZernio).getTime()
				: undefined,
			createdAt: now,
			updatedAt: now,
		});

		return { postId, externalId: args.externalId };
	},
});

// Delete a post - removes from Zernio then from Convex
export const deletePostToZernio = action({
	args: { postId: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		// Get apiKey via runQuery
		const userInfo: { apiKey: string | null } = await ctx.runQuery(
			api.users.getApiKeyByClerkId,
			{ clerkId: identity.tokenIdentifier },
		);

		if (!userInfo?.apiKey) throw new Error("API key not configured");

		// Delete from Zernio
		const zernioResponse = await fetch(
			`${process.env.ZERNIO_API_URL || "https://api.zernio.com"}/v1/posts/${args.postId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${userInfo.apiKey}`,
				},
			},
		);

		// Call mutation to delete from Convex
		return ctx.runMutation(api.posts.deletePostFromConvex, {
			externalPostId: args.postId,
		});
	},
});

// Internal mutation to delete post from Convex (called by action)
export const deletePostFromConvex = mutation({
	args: { externalPostId: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const existingPosts = await ctx.db
			.query("posts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();
		const localPost = existingPosts.find((p) => p.externalPostId === args.externalPostId);

		if (localPost) {
			await ctx.db.delete(localPost._id);
		}

		return { success: true };
	},
});
