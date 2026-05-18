"use client";

import { Avatar, AvatarFallback } from "@zenpost/ui/components/avatar";
import { Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	PlatformFilterDropdown,
	type PlatformFilterValue,
} from "@/components/ui/platform-filter";
import { mockReviews } from "@/data/inbox-mock";
import { cn } from "@/lib/utils";
import { getPlatformConfig } from "../types";

function formatRelativeTime(dateStr: string) {
	const date = new Date(dateStr);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);
	if (minutes < 1) return "now";
	if (minutes < 60) return `${minutes}m`;
	if (hours < 24) return `${hours}h`;
	if (days < 7) return `${days}d`;
	return date.toLocaleDateString();
}

interface ReviewsPanelProps {
	platform: PlatformFilterValue;
	filter: "all" | "replied" | "not_replied";
	onPlatformChange: (v: PlatformFilterValue) => void;
	onFilterChange: (v: "all" | "replied" | "not_replied") => void;
}

export function ReviewsPanel(props: ReviewsPanelProps) {
	const filteredReviews = mockReviews;

	if (filteredReviews.length === 0) {
		return (
			<Card className="border-border/50 p-8 text-center">
				<Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
				<p className="text-muted-foreground">No reviews found</p>
			</Card>
		);
	}

	return (
		<div className="space-y-3">
			{filteredReviews.map((review) => {
				const config = getPlatformConfig(review.platform);
				const Icon = config.icon;
				return (
					<Card
						key={review.id}
						className="border-border/50 p-4 hover:bg-muted/30 transition-colors"
					>
						<div className="flex items-start gap-3">
							<Avatar className="h-10 w-10">
								<AvatarFallback>
									{review.reviewer.name[0].toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span className="font-semibold text-sm">
										{review.reviewer.name}
									</span>
									<div className="flex items-center">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={cn(
													"h-3.5 w-3.5",
													star <= review.rating
														? "fill-yellow-400 text-yellow-400"
														: "text-muted-foreground/30",
												)}
											/>
										))}
									</div>
									<div className={cn("flex items-center", config.color)}>
										<Icon className="h-3 w-3" />
									</div>
									<span className="text-xs text-muted-foreground">
										{formatRelativeTime(review.created)}
									</span>
								</div>
								<p className="text-sm text-muted-foreground mb-2">
									{review.text}
								</p>
								{review.hasReply && review.reply?.text && (
									<div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm">
										<span className="text-xs font-medium text-primary">
											Reply:
										</span>{" "}
										{review.reply.text}
									</div>
								)}
								{!review.hasReply && (
									<Badge variant="outline" className="mt-2 text-xs">
										Not Replied
									</Badge>
								)}
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
