"use client";

import {
	Ban,
	ExternalLink,
	Heart,
	MessageCircle,
	MousePointerClick,
	Play,
	RotateCw,
	Trash2,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { type Platform, PlatformIcon } from "@/components/ui/PlatformIcon";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { CalendarEvent } from "@/data/mock";
import { cn } from "@/lib/utils";

interface ContentItemPopoverProps {
	event: CalendarEvent;
	children: React.ReactNode;
	onDelete?: (event: CalendarEvent) => void;
	onUnpublish?: (event: CalendarEvent) => void;
	onRetry?: (event: CalendarEvent) => void;
	onViewLogs?: (event: CalendarEvent) => void;
}

export function ContentItemPopover({
	event,
	children,
	onDelete,
	onUnpublish,
	onRetry,
	onViewLogs,
}: ContentItemPopoverProps) {
	const [expanded, setExpanded] = useState(false);
	const toggleExpand = useCallback(() => setExpanded((prev) => !prev), []);

	return (
		<Popover>
			<PopoverTrigger >
				<div>{children}</div>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				className="w-72 p-0 overflow-hidden"
				sideOffset={8}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
					<span className="text-xs text-muted-foreground">
						{event.date} • {event.platform}
					</span>
				</div>

				{/* Profile */}
				<div className="flex items-center gap-2.5 px-3 py-2.5">
					<div className="flex items-center justify-center size-8 rounded-full bg-muted">
						<span className="text-[10px] font-bold">TF</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">techfusion.id</span>
						<span className="text-[10px] text-muted-foreground">
							@{event.platform}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="flex gap-3 px-3 pb-3">
					<div className="flex-1 min-w-0">
						<p
							className={cn(
								"text-sm text-muted-foreground",
								expanded ? "" : "line-clamp-4",
							)}
						>
							{event.description || event.title}
						</p>
						<button
							type="button"
							className="text-xs text-primary mt-1 hover:underline"
							onClick={toggleExpand}
						>
							{expanded ? "see less" : "see more"}
						</button>
					</div>

					{event.thumbnail && (
						<div className="relative size-14 flex-shrink-0 overflow-hidden rounded-lg">
							<Image
								src={event.thumbnail}
								alt={event.description || event.title}
								fill
								className="object-cover"
							/>
							{event.mediaType === "video" && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30">
									<Play className="size-3 text-white fill-white" />
								</div>
							)}
						</div>
					)}
				</div>

				{/* Interaction Bar */}
				<div className="flex items-center justify-between px-3 py-2.5 border-t border-border/50 bg-muted/30">
					<div className="flex items-center gap-4">
						<Heart className="size-3.5 text-muted-foreground" />
						<MessageCircle className="size-3.5 text-muted-foreground" />
						<TrendingUp className="size-3.5 text-muted-foreground" />
						<MousePointerClick className="size-3.5 text-muted-foreground" />
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between px-3 py-2.5 border-t border-border/50 gap-2">
					<div className="flex gap-1">
						{event.status === "failed" && onRetry && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8 text-orange-600 hover:text-orange-700"
								onClick={() => onRetry(event)}
							>
								<RotateCw className="size-3.5 mr-1" />
								Retry
							</Button>
						)}
						{event.status === "published" && onUnpublish && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8"
								onClick={() => onUnpublish(event)}
							>
								<Ban className="size-3.5 mr-1" />
								Unpublish
							</Button>
						)}
						{onViewLogs && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8"
								onClick={() => onViewLogs(event)}
							>
								View Logs
							</Button>
						)}
						{onDelete && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8 text-destructive hover:text-destructive"
								onClick={() => onDelete(event)}
							>
								<Trash2 className="size-3.5 mr-1" />
								Delete
							</Button>
						)}
					</div>
					<Button
						variant="default"
						size="sm"
						className="text-xs h-8"
						onClick={() =>
							event.postUrl && window.open(event.postUrl, "_blank")
						}
					>
						<ExternalLink className="size-3.5 mr-1.5" />
						View Post
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
