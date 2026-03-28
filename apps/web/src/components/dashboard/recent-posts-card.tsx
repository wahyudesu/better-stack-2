"use client";

import { ArrowRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { StatusType } from "@/components/ui/status-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { samplePosts } from "@/lib/data/social-data";
import type { ContentPost } from "@/lib/types";

export interface RecentPostsCardProps {
	posts?: ContentPost[];
	analyticsHref?: string;
}

export function RecentPostsCard({
	posts = samplePosts.slice(0, 5),
	analyticsHref = "/analytics",
}: RecentPostsCardProps) {
	return (
		<div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-3 sm:p-4">
			<div className="flex items-center justify-between mb-3 sm:mb-4">
				<h3 className="text-base font-semibold">Recent Posts</h3>
				<Link
					href={analyticsHref as any}
					className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors group"
				>
					Lihat Semua
					<ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
				</Link>
			</div>
			{/* Single column layout on all screen sizes */}
			<div className="grid grid-cols-1 gap-3">
				{posts.map((post) => (
					<PostListItem key={post.id} post={post} />
				))}
			</div>
		</div>
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
		<div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
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
				className="flex-shrink-0 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
				aria-label="More options"
			>
				<MoreHorizontal className="size-4 text-muted-foreground" />
			</button>
		</div>
	);
}
