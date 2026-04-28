import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// --- Internal mutations for server-side sync (no auth required) ---

export const internalAddSocialAccount = internalMutation({
	args: {
		userId: v.id("users"),
		platform: v.string(),
		accountId: v.string(),
		accountName: v.string(),
		avatarUrl: v.optional(v.string()),
		tokens: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("socialAccounts", {
			userId: args.userId,
			platform: args.platform,
			accountId: args.accountId,
			accountName: args.accountName,
			avatarUrl: args.avatarUrl ?? undefined,
			status: "active",
			connectedAt: Date.now(),
			tokens: args.tokens ?? undefined,
		});
	},
});

export const internalUpdateAccountStatus = internalMutation({
	args: {
		accountId: v.string(),
		status: v.union(
			v.literal("active"),
			v.literal("error"),
			v.literal("disconnected"),
		),
	},
	handler: async (ctx, args) => {
		const account = await ctx.db
			.query("socialAccounts")
			.withIndex("by_accountId", (q) => q.eq("accountId", args.accountId))
			.unique();
		if (account) {
			await ctx.db.patch(account._id, { status: args.status });
		}
	},
});

export const internalAddPost = internalMutation({
	args: {
		userId: v.id("users"),
		accountIds: v.array(v.id("socialAccounts")),
		text: v.string(),
		mediaUrls: v.array(v.string()),
		platforms: v.array(v.string()),
		scheduledAt: v.optional(v.number()),
		status: v.union(
			v.literal("draft"),
			v.literal("scheduled"),
			v.literal("published"),
			v.literal("failed"),
		),
		platformPostIds: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("posts", {
			userId: args.userId,
			accountIds: args.accountIds,
			text: args.text,
			mediaUrls: args.mediaUrls,
			platforms: args.platforms,
			scheduledAt: args.scheduledAt ?? undefined,
			status: args.status,
			publishedAt: args.status === "published" ? Date.now() : undefined,
			platformPostIds: args.platformPostIds ?? undefined,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
	},
});

export const internalUpdatePostStatus = internalMutation({
	args: {
		postId: v.id("posts"),
		status: v.union(
			v.literal("draft"),
			v.literal("scheduled"),
			v.literal("published"),
			v.literal("failed"),
		),
		platformPostIds: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId);
		if (post) {
			const updates: Record<string, any> = {
				status: args.status,
				updatedAt: Date.now(),
			};
			if (args.platformPostIds !== undefined) {
				updates.platformPostIds = args.platformPostIds;
			}
			if (args.status === "published" && !post.publishedAt) {
				updates.publishedAt = Date.now();
			}
			await ctx.db.patch(args.postId, updates);
		}
	},
});

export const syncPosts = mutation({
	args: {
		posts: v.array(
			v.object({
				_id: v.string(), // Zernio post _id
				text: v.optional(v.string()), // Zernio uses "text" or "content"
				content: v.optional(v.string()),
				profileId: v.string(),
				socialAccountIds: v.array(v.string()), // Zernio account IDs (strings), not Convex IDs
				scheduledAt: v.optional(v.number()),
				publishedAt: v.optional(v.number()),
				media: v.array(v.string()), // media URLs
				status: v.string(), // Zernio status: published/scheduled/draft/failed
				createdAt: v.number(),
				updatedAt: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		for (const post of args.posts) {
			// Map Zernio status to Convex status
			let convexStatus: "draft" | "scheduled" | "published" | "failed";
			switch (post.status) {
				case "published":
					convexStatus = "published";
					break;
				case "scheduled":
					convexStatus = "scheduled";
					break;
				case "failed":
					convexStatus = "failed";
					break;
				default:
					convexStatus = "draft";
			}

			// Resolve Zernio account IDs to Convex account IDs and get userId
			const resolvedAccountIds: Id<"socialAccounts">[] = [];
			let userId: Id<"users"> | null = null;

			for (const zernioAccountId of post.socialAccountIds) {
				const account = await ctx.db
					.query("socialAccounts")
					.withIndex("by_accountId", (q) => q.eq("accountId", zernioAccountId))
					.first();
				if (account && !userId) {
					userId = account.userId;
				}
				if (account) {
					resolvedAccountIds.push(account._id);
				}
			}

			if (!userId) {
				console.warn(`syncPosts: skipped post ${post._id} — no matching social account`);
				continue;
			}

			// Upsert: check if post with this externalPostId exists
			const existing = await ctx.db
				.query("posts")
				.withIndex("by_externalPostId", (q) => q.eq("externalPostId", post._id))
				.first();

			const postData = {
				userId,
				accountIds: resolvedAccountIds,
				externalPostId: post._id,
				text: post.text ?? post.content ?? "",
				mediaUrls: post.media,
				platforms: [] as string[],
				status: convexStatus,
				scheduledAt: post.scheduledAt ?? undefined,
				publishedAt: post.publishedAt ?? undefined,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt,
			};

			if (existing) {
				await ctx.db.patch(existing._id, postData);
			} else {
				await ctx.db.insert("posts", postData);
			}
		}
	},
});

export const syncAccounts = mutation({
	args: {
		accounts: v.array(
			v.object({
				_id: v.string(), // Zernio account ID
				platform: v.string(),
				username: v.string(),
				displayName: v.string(),
				isActive: v.boolean(),
				profilePicture: v.optional(v.string()),
				profileId: v.string(),
				createdAt: v.number(),
				updatedAt: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		// Get userId from auth context
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		for (const account of args.accounts) {
			// Upsert: check if account with this accountId (Zernio _id) exists
			const existing = await ctx.db
				.query("socialAccounts")
				.withIndex("by_accountId", (q) => q.eq("accountId", account._id))
				.first();

			const accountData = {
				userId: user._id,
				platform: account.platform,
				accountId: account._id,
				accountName: account.displayName || account.username,
				avatarUrl: account.profilePicture ?? undefined,
				status: account.isActive
					? ("active" as const)
					: ("disconnected" as const),
				connectedAt: account.createdAt,
			};

			if (existing) {
				await ctx.db.patch(existing._id, accountData);
			} else {
				await ctx.db.insert("socialAccounts", accountData);
			}
		}
	},
});

// --- Social Accounts ---

export const listByUser = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) return [];
		return await ctx.db
			.query("socialAccounts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.take(args.limit ?? 50);
	},
});

export const addSocialAccount = mutation({
	args: {
		platform: v.string(),
		accountId: v.string(),
		accountName: v.string(),
		avatarUrl: v.optional(v.string()),
		tokens: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		await ctx.db.insert("socialAccounts", {
			userId: user._id,
			platform: args.platform,
			accountId: args.accountId,
			accountName: args.accountName,
			avatarUrl: args.avatarUrl ?? undefined,
			status: "active",
			connectedAt: Date.now(),
			tokens: args.tokens ?? undefined,
		});
	},
});

export const updateSocialAccountStatus = mutation({
	args: {
		accountId: v.string(),
		status: v.union(
			v.literal("active"),
			v.literal("error"),
			v.literal("disconnected"),
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

		const account = await ctx.db
			.query("socialAccounts")
			.withIndex("by_accountId", (q) => q.eq("accountId", args.accountId))
			.unique();
		if (!account || account.userId !== user._id)
			throw new Error("Account not found");

		await ctx.db.patch(account._id, { status: args.status });
	},
});

export const removeSocialAccount = mutation({
	args: { accountId: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const account = await ctx.db
			.query("socialAccounts")
			.withIndex("by_accountId", (q) => q.eq("accountId", args.accountId))
			.unique();
		if (!account || account.userId !== user._id)
			throw new Error("Account not found");

		await ctx.db.delete(account._id);
	},
});

// --- Posts ---

export const listPosts = query({
	args: { status: v.optional(v.string()), limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) return [];

		let posts = await ctx.db
			.query("posts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.take(args.limit ?? 100);

		if (args.status) {
			posts = posts.filter((p) => p.status === args.status);
		}

		return posts.sort((a, b) => b.createdAt - a.createdAt);
	},
});

export const createPost = mutation({
	args: {
		accountIds: v.array(v.id("socialAccounts")),
		text: v.string(),
		mediaUrls: v.array(v.string()),
		platforms: v.array(v.string()),
		scheduledAt: v.optional(v.number()),
		status: v.union(
			v.literal("draft"),
			v.literal("scheduled"),
			v.literal("published"),
			v.literal("failed"),
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

		return await ctx.db.insert("posts", {
			userId: user._id,
			accountIds: args.accountIds,
			text: args.text,
			mediaUrls: args.mediaUrls,
			platforms: args.platforms,
			scheduledAt: args.scheduledAt ?? undefined,
			status: args.status,
			publishedAt: undefined,
			platformPostIds: undefined,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
	},
});

export const updatePost = mutation({
	args: {
		postId: v.id("posts"),
		text: v.optional(v.string()),
		mediaUrls: v.optional(v.array(v.string())),
		scheduledAt: v.optional(v.number()),
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("scheduled"),
				v.literal("published"),
				v.literal("failed"),
			),
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

		const post = await ctx.db.get(args.postId);
		if (!post || post.userId !== user._id) throw new Error("Post not found");

		const updates: Record<string, any> = { updatedAt: Date.now() };
		if (args.text !== undefined) updates.text = args.text;
		if (args.mediaUrls !== undefined) updates.mediaUrls = args.mediaUrls;
		if (args.scheduledAt !== undefined) updates.scheduledAt = args.scheduledAt;
		if (args.status !== undefined) updates.status = args.status;

		await ctx.db.patch(args.postId, updates);
	},
});

export const updatePostPlatformIds = mutation({
	args: {
		postId: v.id("posts"),
		platformPostIds: v.string(), // JSON string
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const post = await ctx.db.get(args.postId);
		if (!post || post.userId !== user._id) throw new Error("Post not found");

		await ctx.db.patch(args.postId, {
			platformPostIds: args.platformPostIds,
			status: "published",
			publishedAt: Date.now(),
			updatedAt: Date.now(),
		});
	},
});

export const deletePost = mutation({
	args: { postId: v.id("posts") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const post = await ctx.db.get(args.postId);
		if (!post || post.userId !== user._id) throw new Error("Post not found");

		await ctx.db.delete(args.postId);
	},
});

export const getScheduledPosts = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) return [];

		const now = Date.now();
		const allPosts = await ctx.db
			.query("posts")
			.withIndex("by_scheduledAt", (q) => q.lt("scheduledAt", now + 1))
			.take(args.limit ?? 50);

		return allPosts
			.filter((p) => p.userId === user._id && p.status === "scheduled")
			.sort((a, b) => (a.scheduledAt! - b.scheduledAt!));
	},
});

// --- Media ---

export const listMedia = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) return [];

		return await ctx.db
			.query("media")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.take(args.limit ?? 50);
	},
});

export const addMedia = mutation({
	args: {
		storageId: v.string(),
		filename: v.string(),
		mimeType: v.string(),
		url: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		return await ctx.db.insert("media", {
			userId: user._id,
			storageId: args.storageId,
			filename: args.filename,
			mimeType: args.mimeType,
			url: args.url,
			createdAt: Date.now(),
		});
	},
});

export const deleteMedia = mutation({
	args: { mediaId: v.id("media") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const media = await ctx.db.get(args.mediaId);
		if (!media || media.userId !== user._id) throw new Error("Media not found");

		await ctx.db.delete(args.mediaId);
	},
});
