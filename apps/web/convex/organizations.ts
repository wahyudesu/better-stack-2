import { v } from "convex/values";
import { type Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

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

		const orgs = await ctx.db
			.query("organizations")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		return orgs.sort((a, b) => {
			if (a.isDefault && !b.isDefault) return -1;
			if (!a.isDefault && b.isDefault) return 1;
			return a.createdAt - b.createdAt;
		});
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		logoUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const existingOrgs = await ctx.db
			.query("organizations")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		const isDefault = existingOrgs.length === 0;

		const orgId = await ctx.db.insert("organizations", {
			userId: user._id,
			name: args.name,
			logoUrl: args.logoUrl,
			isDefault,
			createdAt: Date.now(),
		});

		return orgId;
	},
});

export const update = mutation({
	args: {
		orgId: v.id("organizations"),
		name: v.optional(v.string()),
		logoUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const org = await ctx.db.get(args.orgId);
		if (!org || org.userId !== user._id)
			throw new Error("Organization not found");

		const patch: Partial<Doc<"organizations">> = {};
		if (args.name !== undefined) patch.name = args.name;
		if (args.logoUrl !== undefined) patch.logoUrl = args.logoUrl;

		await ctx.db.patch(args.orgId, patch);
		return args.orgId;
	},
});

export const setDefault = mutation({
	args: {
		orgId: v.id("organizations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const org = await ctx.db.get(args.orgId);
		if (!org || org.userId !== user._id)
			throw new Error("Organization not found");

		const allOrgs = await ctx.db
			.query("organizations")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		for (const o of allOrgs) {
			if (o.isDefault && o._id !== args.orgId) {
				await ctx.db.patch(o._id, { isDefault: false });
			} else if (!o.isDefault && o._id === args.orgId) {
				await ctx.db.patch(o._id, { isDefault: true });
			}
		}

		return args.orgId;
	},
});
