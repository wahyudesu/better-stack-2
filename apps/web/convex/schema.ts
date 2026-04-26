import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    apiKey: v.optional(v.string()),
    email: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  socialAccounts: defineTable({
    userId: v.id("users"),
    platform: v.string(), // twitter, instagram, facebook, etc
    accountId: v.string(), // Zernio account ID
    accountName: v.string(),
    avatarUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("error"), v.literal("disconnected")),
    connectedAt: v.number(),
    tokens: v.optional(v.string()), // encrypted platform tokens
  })
    .index("by_userId", ["userId"])
    .index("by_platform", ["platform"])
    .index("by_accountId", ["accountId"]),

  posts: defineTable({
    userId: v.id("users"),
    accountIds: v.array(v.id("socialAccounts")),
    text: v.string(),
    mediaUrls: v.array(v.string()),
    platforms: v.array(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("failed")
    ),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    platformPostIds: v.optional(v.string()), // JSON: { twitter: "123", instagram: "456" }
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_scheduledAt", ["scheduledAt"]),

  media: defineTable({
    userId: v.id("users"),
    storageId: v.string(), // Convex storage ID
    filename: v.string(),
    mimeType: v.string(),
    url: v.string(), // Convex getUrl result
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),
});
