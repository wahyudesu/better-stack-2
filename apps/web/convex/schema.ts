import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		apiKey: v.optional(v.string()),
		email: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_clerkId", ["clerkId"])
		.index("by_email", ["email"]),
});
