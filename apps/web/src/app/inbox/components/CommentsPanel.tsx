"use client";

import { MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	PlatformFilterDropdown,
	type PlatformFilterValue,
} from "@/components/ui/platform-filter";
import { Textarea } from "@/components/ui/textarea";
import { mockComments } from "@/data/inbox-mock";
import type { CommentAutomation } from "@/lib/client";
import { api } from "@/lib/client";
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

interface CommentsPanelProps {
	platform: PlatformFilterValue;
	onPlatformChange: (v: PlatformFilterValue) => void;
}

export function CommentsPanel({
	platform,
	onPlatformChange,
}: CommentsPanelProps) {
	const [replyTarget, setReplyTarget] = useState<{
		postId: string;
		commentId: string;
		platform: string;
	} | null>(null);
	const [replyText, setReplyText] = useState("");
	const [isReplying, setIsReplying] = useState(false);

	const filteredComments = mockComments.filter(
		(c) => platform === "all" || c.platform === platform,
	);

	const handleReply = async () => {
		if (!replyTarget || !replyText.trim()) return;
		setIsReplying(true);
		try {
			await api.privateReply(replyTarget.postId, replyTarget.commentId, {
				accountId: replyTarget.postId,
				message: replyText,
			});
			setReplyTarget(null);
			setReplyText("");
		} finally {
			setIsReplying(false);
		}
	};

	if (filteredComments.length === 0) {
		return (
			<Card className="border-border/50 p-8 text-center">
				<MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
				<p className="text-muted-foreground">No comments found</p>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<PlatformFilterDropdown value={platform} onChange={onPlatformChange} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{filteredComments.map((post) => {
					const config = getPlatformConfig(post.platform);
					const Icon = config.icon;
					return (
						<Card
							key={post.id}
							className="border-border/50 p-4 hover:bg-muted/30 transition-colors"
						>
							<div className="flex items-start gap-3">
								{post.picture && (
									<img
										src={post.picture}
										alt="Post"
										className="w-16 h-16 rounded-lg object-cover shrink-0"
									/>
								)}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<div className={cn("flex items-center", config.color)}>
											<Icon className="h-3 w-3" />
										</div>
										<span className="text-xs text-muted-foreground">
											@{post.accountUsername}
										</span>
										<span className="text-xs text-muted-foreground">
											{formatRelativeTime(post.createdTime)}
										</span>
									</div>
									<p className="text-sm mb-2 line-clamp-2">{post.content}</p>
									<div className="flex items-center gap-4 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<MessageSquare className="h-3.5 w-3.5" />
											{post.commentCount}
										</span>
										<span className="flex items-center gap-1">
											<Star className="h-3.5 w-3.5" />
											{post.likeCount}
										</span>
									</div>
									{replyTarget?.commentId === post.id ? (
										<div className="mt-3 pt-3 border-t border-border/50 space-y-2">
											<Textarea
												placeholder="Write your reply..."
												value={replyText}
												onChange={(e) => setReplyText(e.target.value)}
												className="min-h-[60px] resize-none text-sm"
											/>
											<div className="flex gap-2">
												<Button
													onClick={handleReply}
													disabled={!replyText.trim() || isReplying}
													size="sm"
												>
													{isReplying ? "Sending..." : "Send"}
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setReplyTarget(null);
														setReplyText("");
													}}
												>
													Cancel
												</Button>
											</div>
										</div>
									) : (
										<Button
											variant="outline"
											size="sm"
											className="mt-2 h-7 text-xs"
											onClick={() =>
												setReplyTarget({
													postId: post.id,
													commentId: post.id,
													platform: post.platform,
												})
											}
										>
											Reply
										</Button>
									)}
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
