/**
 * Status Badge Component.
 * Centralizes status badge pattern used across:
 * - ContentCard
 * - generated-post-card
 * - ListView
 */

"use client";

import type * as React from "react";
import { statusBadgeStyles } from "@/lib/constants/ui";
import { cn } from "@/lib/utils";

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
