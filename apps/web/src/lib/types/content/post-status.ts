/**
 * Post status workflow.
 * Complete lifecycle: draft -> review -> scheduled -> publishing -> published
 *                                                       -> failed
 *                                                       -> cancelled
 */

export type PostStatus =
	| "draft" // Initial state, editable
	| "review" // Pending approval
	| "scheduled" // Queued for publish
	| "publishing" // Currently being published
	| "published" // Successfully published
	| "failed" // Publish failed
	| "cancelled"; // Cancelled before publish

/**
 * Status display info.
 */
export const POST_STATUS_INFO: Record<
	PostStatus,
	{ label: string; color: string }
> = {
	draft: { label: "Draft", color: "gray" },
	review: { label: "In Review", color: "yellow" },
	scheduled: { label: "Scheduled", color: "blue" },
	publishing: { label: "Publishing", color: "cyan" },
	published: { label: "Published", color: "green" },
	failed: { label: "Failed", color: "red" },
	cancelled: { label: "Cancelled", color: "gray" },
};

/**
 * Check if a post status allows editing.
 */
export function canEditPost(status: PostStatus): boolean {
	return status === "draft" || status === "failed" || status === "review";
}

/**
 * Check if a post can be cancelled.
 */
export function canCancelPost(status: PostStatus): boolean {
	return status === "scheduled" || status === "review";
}

/**
 * Check if a post is considered "active" (not archived/cancelled).
 */
export function isActivePost(status: PostStatus): boolean {
	return !["cancelled"].includes(status);
}
