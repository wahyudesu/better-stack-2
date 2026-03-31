"use client";

import { ArrowRight, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { samplePosts } from "@/lib/data/social-data";
import type { ContentPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface RecentPostsCardProps {
	posts?: ContentPost[];
	analyticsHref?: string;
}

export function RecentPostsCard({
	posts = samplePosts.slice(0, 8),
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
				{/* 4 Column Grid Layout */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{posts.map((post) => (
						<PostCardItem key={post.id} post={post} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function PostCardItem({ post }: { post: ContentPost }) {
	const scheduledDate = post.scheduledAt || post.publishedAt || post.createdAt;
	const hasMedia = post.media && post.media.length > 0;

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
		return `${date.getDate()} ${date.toLocaleString("id-ID", { month: "short" })}`;
	};

	return (
		<div className="group relative rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer overflow-hidden">
			{/* Media Thumbnail */}
			{hasMedia ? (
				<div className="aspect-square w-full overflow-hidden bg-muted relative">
					<img
						src={post.media[0].url}
						alt={post.title}
						className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
					/>
					{/* Multiple media indicator */}
					{post.media.length > 1 && (
						<div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md flex items-center gap-1">
							<ImageIcon className="size-3" />
							<span>{post.media.length}</span>
						</div>
					)}
				</div>
			) : (
				<div className="aspect-square w-full bg-muted flex items-center justify-center">
					<ImageIcon className="size-8 text-muted-foreground/30" />
				</div>
			)}

			{/* Content Overlay */}
			<div className="p-3">
				{/* Title */}
				<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
					{post.title}
				</h3>

				{/* Bottom Row: Date + Platform */}
				<div className="flex items-center justify-between">
					<span className="text-xs text-muted-foreground">
						{formatDate(scheduledDate)}
					</span>
					<div className="flex items-center gap-1">
						{post.platforms.map((platform) => (
							<PlatformIcon key={platform} platform={platform} size={16} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
