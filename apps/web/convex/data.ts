import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

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
    status: v.union(v.literal("active"), v.literal("error"), v.literal("disconnected")),
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
      v.literal("failed")
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
      v.literal("failed")
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

// --- Social Accounts ---

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
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
      .collect();
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
    status: v.union(v.literal("active"), v.literal("error"), v.literal("disconnected")),
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
    if (!account || account.userId !== user._id) throw new Error("Account not found");

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
    if (!account || account.userId !== user._id) throw new Error("Account not found");

    await ctx.db.delete(account._id);
  },
});

// --- Posts ---

export const listPosts = query({
  args: { status: v.optional(v.string()) },
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
      .collect();

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
      v.literal("failed")
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
    status: v.optional(v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published"), v.literal("failed"))),
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
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();
    if (!user) return [];

    const now = Date.now();
    return await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .collect()
      .then((posts) =>
        posts.filter((p) => p.userId === user._id && p.scheduledAt && p.scheduledAt <= now)
      );
  },
});

// --- Media ---

export const listMedia = query({
  args: {},
  handler: async (ctx) => {
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
      .collect();
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