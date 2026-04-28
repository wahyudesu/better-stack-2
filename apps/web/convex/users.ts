import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Ensure user exists in DB when they authenticate via Clerk
export const ensureUser = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const tokenIdentifier = identity.tokenIdentifier;
		const email = identity.email ?? "";
		const displayName = identity.name ?? "";
		const avatarUrl = identity.pictureUrl ?? undefined;

		const existing = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", tokenIdentifier))
			.unique();

		if (existing) {
			// Update existing user info
			await ctx.db.patch(existing._id, {
				email,
				displayName: displayName || existing.displayName,
				avatarUrl: avatarUrl || existing.avatarUrl,
				updatedAt: Date.now(),
			});
			return existing._id;
		} else {
			// Create new user
			const userId = await ctx.db.insert("users", {
				clerkId: tokenIdentifier,
				apiKey: undefined,
				email,
				displayName,
				avatarUrl,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
			return userId;
		}
	},
});

export const upsertApiKey = mutation({
	args: { apiKey: v.union(v.string(), v.null()) },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		const tokenIdentifier = identity.tokenIdentifier;

		const existing = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", tokenIdentifier))
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				apiKey: args.apiKey ?? undefined,
				updatedAt: Date.now(),
			});
		} else {
			// Should not happen if ensureUser was called on login
			await ctx.db.insert("users", {
				clerkId: tokenIdentifier,
				apiKey: args.apiKey ?? undefined,
				email: identity.email ?? "",
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		}
	},
});

export const getApiKey = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return null;
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		return user?.apiKey ?? null;
	},
});

// Query with args for server-side Convex lookup (uses admin key)
export const getApiKeyByClerkId = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
			.unique();
		return { apiKey: user?.apiKey ?? null };
	},
});
