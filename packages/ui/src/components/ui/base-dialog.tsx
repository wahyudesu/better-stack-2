/**
 * Base Dialog Component.
 * Provides a consistent dialog pattern across the app.
 * Consolidates repeated dialog patterns from:
 * - CreateContentDialog
 * - EventDetailDialog
 * - template-manager-dialog
 */

"use client";

import { X } from "lucide-react";
import type * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@zenpost/ui/components/dialog";
import { cn } from "@zenpost/ui/lib/utils";

export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface BaseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	size?: DialogSize;
	showCloseButton?: boolean;
	className?: string;
}

const sizeClasses: Record<DialogSize, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
};

export function BaseDialog({
	open,
	onOpenChange,
	title,
	description,
	children,
	size = "md",
	showCloseButton = true,
	className,
}: BaseDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={cn(sizeClasses[size], className)}>
				{showCloseButton && (
					<button
						onClick={() => onOpenChange(false)}
						className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</button>
				)}

				<DialogHeader className="pr-6">
					<DialogTitle className="text-base font-semibold">{title}</DialogTitle>
					{description && (
						<DialogDescription className="text-sm">
							{description}
						</DialogDescription>
					)}
				</DialogHeader>

				<div className="py-4">{children}</div>
			</DialogContent>
		</Dialog>
	);
}
