import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

// List all social accounts for the current user
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

		const accounts = await ctx.db
			.query("socialAccounts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		return accounts.map((acc) => ({
			_id: acc._id,
			platform: acc.platform,
			accountId: acc.accountId,
			accountName: acc.accountName,
			avatarUrl: acc.avatarUrl,
			status: acc.status,
			connectedAt: acc.connectedAt,
		}));
	},
});

// Internal mutation to write accounts to DB (called by action)
export const writeAccountsToDb = mutation({
	args: {
		accounts: v.array(
			v.object({
				externalId: v.string(),
				platform: v.string(),
				accountName: v.string(),
				avatarUrl: v.optional(v.string()),
				status: v.string(),
				connectedAt: v.number(),
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

		const existingAccounts = await ctx.db
			.query("socialAccounts")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();

		const existingByAccountId = new Map(
			existingAccounts.map((a) => [a.accountId, a]),
		);

		const now = Date.now();
		const newExternalIds = new Set(args.accounts.map((a) => a.externalId));

		for (const acc of args.accounts) {
			const existing = existingByAccountId.get(acc.externalId);

			if (existing) {
				await ctx.db.patch(existing._id, {
					accountName: acc.accountName,
					avatarUrl: acc.avatarUrl,
					status: acc.status as any,
				});
			} else {
				await ctx.db.insert("socialAccounts", {
					userId: user._id,
					platform: acc.platform,
					accountId: acc.externalId,
					accountName: acc.accountName,
					avatarUrl: acc.avatarUrl,
					status: acc.status as any,
					connectedAt: acc.connectedAt,
				});
			}
		}

		// Mark disconnected
		for (const existing of existingAccounts) {
			if (!newExternalIds.has(existing.accountId)) {
				await ctx.db.patch(existing._id, { status: "disconnected" });
			}
		}

		await ctx.db.patch(user._id, {
			lastSyncedAt: now,
			updatedAt: now,
		});

		return { success: true, synced: args.accounts.length };
	},
});

// Action to sync from Zernio (can use fetch)
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
			`${process.env.ZERNIO_API_URL || "https://api.zernio.com"}/v1/accounts`,
			{
				headers: {
					Authorization: `Bearer ${userInfo.apiKey}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!zernioResponse.ok) {
			throw new Error("Failed to fetch accounts from Zernio");
		}

		const { accounts: zernioAccounts } = (await zernioResponse.json()) as {
			accounts: Array<{
				_id: string;
				platform: string;
				username?: string;
				displayName?: string;
				profilePicture?: string;
				isActive?: boolean;
				status?: string;
				createdAt?: string;
			}>;
		};

		const accounts = zernioAccounts.map((zAcc) => ({
			externalId: zAcc._id,
			platform: zAcc.platform,
			accountName: zAcc.displayName || zAcc.username || "",
			avatarUrl: zAcc.profilePicture,
			status: zAcc.isActive !== false ? "active" : "error",
			connectedAt: zAcc.createdAt
				? new Date(zAcc.createdAt).getTime()
				: Date.now(),
		}));

		return ctx.runMutation(api.socialAccounts.writeAccountsToDb, { accounts });
	},
});

// Delete a social account
export const deleteAccount = mutation({
	args: { accountId: v.id("socialAccounts") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
			.unique();
		if (!user) throw new Error("User not found");

		const account = await ctx.db.get(args.accountId);
		if (!account || account.userId !== user._id) {
			throw new Error("Account not found");
		}

		await ctx.db.delete(args.accountId);
		return { success: true };
	},
});
