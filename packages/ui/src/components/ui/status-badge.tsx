/**
 * Status Badge Component.
 * Centralizes status badge pattern used across:
 * - ContentCard
 * - generated-post-card
 * - ListView
 */

"use client";

import type * as React from "react";
import { cn } from "@zenpost/ui/lib/utils";

const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
	// Published - Success state (green)
	published: {
		bg: "hsl(142 76% 36% / 0.15)",
		text: "hsl(142 76% 36%)",
	},
	// Scheduled - Primary/pending state (blue)
	scheduled: {
		bg: "hsl(var(--primary) / 0.15)",
		text: "hsl(var(--primary))",
	},
	// Draft - Neutral/inactive state (gray)
	draft: {
		bg: "hsl(var(--muted) / 0.5)",
		text: "hsl(var(--muted-foreground))",
	},
	// Review - Warning/attention state (yellow/orange)
	review: {
		bg: "hsl(38 92% 50% / 0.15)",
		text: "hsl(38 92% 50%)",
	},
	// Publishing - In-progress state (blue/indigo)
	publishing: {
		bg: "hsl(221 83% 53% / 0.15)",
		text: "hsl(221 83% 53%)",
	},
	// Failed - Error state (red)
	failed: {
		bg: "hsl(0 84% 60% / 0.15)",
		text: "hsl(0 84% 60%)",
	},
	// Cancelled - Neutral/stopped state (gray)
	cancelled: {
		bg: "hsl(var(--muted) / 0.3)",
		text: "hsl(var(--muted-foreground))",
	},
	// Legacy "pending" - maps to "review" for backward compatibility
	pending: {
		bg: "hsl(38 92% 50% / 0.15)",
		text: "hsl(38 92% 50%)",
	},
};

export type StatusType = keyof typeof statusBadgeStyles;

export interface StatusBadgeProps {
	status: StatusType;
	className?: string;
	children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
	const styles = statusBadgeStyles[status] || statusBadgeStyles.draft;

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
				styles.bg,
				styles.text,
				className,
			)}
		>
			{children || status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
}
