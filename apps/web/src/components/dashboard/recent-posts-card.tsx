"use client";

import { ArrowRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { StatusType } from "@/components/ui/status-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { samplePosts } from "@/lib/data/social-data";
import type { ContentPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface RecentPostsCardProps {
	posts?: ContentPost[];
	analyticsHref?: string;
}

export function RecentPostsCard({
	posts = samplePosts.slice(0, 5),
	analyticsHref = "/analytics",
}: RecentPostsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Posts</CardTitle>
				<CardAction>
					<Link
						href={analyticsHref as any}
						className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors group"
					>
						Lihat Semua
						<ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
					</Link>
				</CardAction>
			</CardHeader>
			<CardContent>
				{/* Single column layout on all screen sizes */}
				<div className="grid grid-cols-1 gap-3">
					{posts.map((post) => (
						<PostListItem key={post.id} post={post} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function PostListItem({ post }: { post: ContentPost }) {
	const scheduledDate = post.scheduledAt || post.publishedAt || post.createdAt;

	// Format date using native Intl
	const formatDate = (date: Date) => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const targetDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		);

		const isToday = targetDate.getTime() === today.getTime();
		const isYesterday = targetDate.getTime() === yesterday.getTime();

		// Format time (HH:mm)
		const timeFormatter = new Intl.DateTimeFormat("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
		const timeStr = timeFormatter.format(date);

		if (isToday) {
			return `Today, ${timeStr}`;
		}
		if (isYesterday) {
			return `Yesterday, ${timeStr}`;
		}
		// Format date (dd MMM, HH:mm)
		return `${date.getDate()} ${date.toLocaleString("id-ID", { month: "short" })}, ${timeStr}`;
	};

	return (
		<div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
			{/* Date/Time */}
			<div className="flex-shrink-0 w-12 sm:w-14 text-xs text-muted-foreground">
				{formatDate(scheduledDate)}
			</div>

			{/* Content Preview */}
			<div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[280px]">
				<p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
					{post.title}
				</p>
				<p className="text-xs text-muted-foreground line-clamp-3">
					{post.content.split("\n")[0]}
				</p>
			</div>

			{/* Right Side: Platform Icons */}
			<div className="flex flex-col items-end gap-1.5">
				{/* Platform Icons - Bigger size */}
				<div className="flex items-center gap-1">
					{post.platforms.map((platform) => (
						<PlatformIcon key={platform} platform={platform} size={20} />
					))}
				</div>
			</div>

			{/* More Actions */}
			<button
				type="button"
				className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
				aria-label="More options"
			>
				<MoreHorizontal className="size-4 text-muted-foreground" />
			</button>
		</div>
	);
}
