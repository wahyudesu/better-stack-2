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

export const syncFromClerk = mutation({
	args: {
		orgName: v.optional(v.string()),
		orgLogo: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");
		if (!identity.orgId) return null;

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		// Check if org already synced by clerkOrgId
		const existing = await ctx.db
			.query("organizations")
			.withIndex("by_clerkOrgId", (q) =>
				q.eq("clerkOrgId", identity.orgId as string),
			)
			.unique();

		if (existing) {
			// Update if name/logo changed
			const patch: Partial<Doc<"organizations">> = {};
			if (args.orgName && existing.name !== args.orgName)
				patch.name = args.orgName;
			if (args.orgLogo && existing.logoUrl !== args.orgLogo)
				patch.logoUrl = args.orgLogo;
			if (Object.keys(patch).length > 0)
				await ctx.db.patch(existing._id, patch);
			return existing._id;
		} else {
			// Create new org linked to Clerk
			const userOrgs = await ctx.db
				.query("organizations")
				.withIndex("by_userId", (q) => q.eq("userId", user._id))
				.collect();
			return await ctx.db.insert("organizations", {
				userId: user._id,
				clerkOrgId: identity.orgId as string,
				clerkOrgSlug: (identity.orgSlug as string | undefined) ?? undefined,
				clerkOrgRole: (identity.orgRole as string | undefined) ?? undefined,
				name: args.orgName ?? (identity.orgSlug as string) ?? "Organization",
				logoUrl: args.orgLogo,
				isDefault: userOrgs.length === 0,
				createdAt: Date.now(),
			});
		}
	},
});
