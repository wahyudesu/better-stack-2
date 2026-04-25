import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
				apiKey: args.apiKey,
				updatedAt: Date.now(),
			});
		} else {
			await ctx.db.insert("users", {
				clerkId: tokenIdentifier,
				apiKey: args.apiKey,
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
