"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Eye,
	EyeOff,
	Heart,
	MessageSquare,
	MoreHorizontal,
	Search,
	SortDesc,
	Star,
	Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	PlatformFilterDropdown,
	type PlatformFilterValue,
} from "@/components/ui/platform-filter";
import { Textarea } from "@/components/ui/textarea";
import { mockComments } from "@/data/inbox-mock";
import { inboxApi } from "@/lib/api/inbox";
import { cn } from "@/lib/utils";
import type { CommentedPost } from "../types";
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

type SortBy = "newest" | "oldest" | "most_comments" | "most_likes";

type CommentsPanelProps = {
	platform: PlatformFilterValue;
	onPlatformChange: (v: PlatformFilterValue) => void;
};

function SkeletonCard() {
	return (
		<Card className="border-border/50 p-4 animate-pulse">
			<div className="flex items-start gap-3">
				<div className="w-16 h-16 rounded-lg bg-muted" />
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<div className="h-3 w-16 bg-muted rounded" />
						<div className="h-3 w-20 bg-muted rounded" />
					</div>
					<div className="h-4 bg-muted rounded w-full" />
					<div className="h-4 bg-muted rounded w-3/4" />
					<div className="flex items-center gap-4 mt-1">
						<div className="h-3 w-8 bg-muted rounded" />
						<div className="h-3 w-8 bg-muted rounded" />
					</div>
				</div>
			</div>
		</Card>
	);
}

export function CommentsPanel(props: CommentsPanelProps) {
	const [replyTarget, setReplyTarget] = useState<{
		postId: string;
		commentId: string;
		accountId: string;
	} | null>(null);
	const [replyText, setReplyText] = useState("");
	const [isReplying, setIsReplying] = useState(false);
	const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
	const [hiddenComments, setHiddenComments] = useState<Set<string>>(new Set());
	const [deletingComment, setDeletingComment] = useState<string | null>(null);
	const [privateReplyTarget, setPrivateReplyTarget] = useState<{
		postId: string;
		commentId: string;
		accountId: string;
	} | null>(null);
	const [privateReplyText, setPrivateReplyText] = useState("");
	const [isPrivateReplying, setIsPrivateReplying] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortBy>("newest");

	// Fetch commented posts from API
	const { data: postsResult, isLoading } = useQuery({
		queryKey: ["inbox", "commented-posts", { platform: props.platform }],
		queryFn: async () => {
			// Use mock data when no real auth
			const res = await inboxApi.listCommentedPosts({
				platform: props.platform !== "all" ? props.platform : undefined,
				limit: 50,
			});
			if (res.error) {
				// Fallback to mock on error
				return { posts: mockComments, pagination: null, isMock: true };
			}
			return {
				posts: (res.data?.posts ?? []) as unknown as CommentedPost[],
				pagination: res.data?.pagination ?? null,
				isMock: false,
			};
		},
	});

	// Normalize posts — API returns array of Record<string, unknown>, mock is CommentedPost[]
	const rawPosts = postsResult?.posts ?? [];
	const posts: CommentedPost[] = useMemo(() => {
		if (rawPosts.length === 0) return [];
		// Check if posts need normalization (API response vs already normalized)
		const first = rawPosts[0] as CommentedPost | Record<string, unknown>;
		if (
			first &&
			typeof first === "object" &&
			!("platform" in first)
		) {
			return (rawPosts as unknown as Record<string, unknown>[]).map((p) => ({
				id: String(p.id),
				accountId: String(p.accountId),
				accountUsername: String(p.accountUsername ?? ""),
				platform: p.platform as string as CommentedPost["platform"],
				content: String(p.content ?? ""),
				createdTime: String(p.createdTime ?? new Date().toISOString()),
				permalink: (p.permalink as string | null) ?? null,
				picture: (p.picture as string | null) ?? null,
				commentCount: Number(p.commentCount ?? 0),
				likeCount: Number(p.likeCount ?? 0),
			}));
		}
		return rawPosts as CommentedPost[];
	}, [rawPosts]);

	// Apply search filter
	const filteredPosts = useMemo(() => {
		let result = posts;
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(p) =>
					p.content.toLowerCase().includes(q) ||
					p.accountUsername.toLowerCase().includes(q),
			);
		}
		return result;
	}, [posts, searchQuery]);

	// Apply sort
	const sortedPosts = useMemo(() => {
		const sorted = [...filteredPosts];
		switch (sortBy) {
			case "newest":
				sorted.sort(
					(a, b) =>
						new Date(b.createdTime).getTime() -
						new Date(a.createdTime).getTime(),
				);
				break;
			case "oldest":
				sorted.sort(
					(a, b) =>
						new Date(a.createdTime).getTime() -
						new Date(b.createdTime).getTime(),
				);
				break;
			case "most_comments":
				sorted.sort((a, b) => b.commentCount - a.commentCount);
				break;
			case "most_likes":
				sorted.sort((a, b) => b.likeCount - a.likeCount);
				break;
		}
		return sorted;
	}, [filteredPosts, sortBy]);

	const handleLike = useCallback(
		async (postId: string, commentId: string, accountId: string) => {
			const key = `${postId}-${commentId}`;
			if (likedComments.has(key)) {
				setLikedComments((prev) => {
					const next = new Set(prev);
					next.delete(key);
					return next;
				});
				await inboxApi.unlikeComment({ postId, commentId, accountId });
			} else {
				setLikedComments((prev) => {
					const next = new Set(prev);
					next.add(key);
					return next;
				});
				await inboxApi.likeComment({ postId, commentId, accountId });
			}
		},
		[likedComments],
	);

	const handleHide = useCallback(
		async (postId: string, commentId: string, accountId: string) => {
			const key = `${postId}-${commentId}`;
			if (hiddenComments.has(key)) {
				setHiddenComments((prev) => {
					const next = new Set(prev);
					next.delete(key);
					return next;
				});
				await inboxApi.unhideComment({ postId, commentId, accountId });
			} else {
				setHiddenComments((prev) => {
					const next = new Set(prev);
					next.add(key);
					return next;
				});
				await inboxApi.hideComment({ postId, commentId, accountId });
			}
		},
		[hiddenComments],
	);

	const handleDelete = useCallback(
		async (postId: string, commentId: string, accountId: string) => {
			setDeletingComment(`${postId}-${commentId}`);
			try {
				await inboxApi.deleteComment({ postId, commentId, accountId });
			} finally {
				setDeletingComment(null);
			}
		},
		[],
	);

	const handleReply = async () => {
		if (!replyTarget || !replyText.trim()) return;
		setIsReplying(true);
		try {
			await inboxApi.replyToComment({
				postId: replyTarget.postId,
				accountId: replyTarget.accountId,
				message: replyText,
				commentId: replyTarget.commentId,
			});
			setReplyTarget(null);
			setReplyText("");
		} finally {
			setIsReplying(false);
		}
	};

	const handlePrivateReply = async () => {
		if (!privateReplyTarget || !privateReplyText.trim()) return;
		setIsPrivateReplying(true);
		try {
			await inboxApi.sendPrivateReply({
				postId: privateReplyTarget.postId,
				commentId: privateReplyTarget.commentId,
				accountId: privateReplyTarget.accountId,
				message: privateReplyText,
			});
			setPrivateReplyTarget(null);
			setPrivateReplyText("");
		} finally {
			setIsPrivateReplying(false);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 flex-1">
						<PlatformFilterDropdown
							value={props.platform}
							onChange={props.onPlatformChange}
						/>
						<div className="relative flex-1 max-w-[300px]">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search posts..."
								className="h-9 w-full pl-10 pr-4 rounded-lg border border-input bg-background text-sm"
							/>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent">
							<SortDesc className="h-4 w-4" />
						</DropdownMenuTrigger>
					</DropdownMenu>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			</div>
		);
	}

	if (sortedPosts.length === 0) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 flex-1">
						<PlatformFilterDropdown
							value={props.platform}
							onChange={props.onPlatformChange}
						/>
						<div className="relative flex-1 max-w-[300px]">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search posts..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-9 w-full pl-10 pr-4 rounded-lg border border-input bg-background text-sm"
							/>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent">
							<SortDesc className="h-4 w-4" />
						</DropdownMenuTrigger>
					</DropdownMenu>
				</div>
				<Card className="border-border/50 p-8 text-center">
					<MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
					<p className="text-muted-foreground">No comments found</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Filters row */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 flex-1">
					<PlatformFilterDropdown
						value={props.platform}
						onChange={props.onPlatformChange}
					/>
					<div className="relative flex-1 max-w-[300px]">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search posts..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-9 w-full pl-10 pr-4 rounded-lg border border-input bg-background text-sm"
						/>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent">
						<SortDesc className="h-4 w-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuRadioGroup
							value={sortBy}
							onValueChange={(v) => setSortBy(v as SortBy)}
						>
							<DropdownMenuRadioItem value="newest">
								Terbaru
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="oldest">
								Terdahulu
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="most_comments">
								Comment Terbanyak
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="most_likes">
								Like Terbanyak
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{sortedPosts.map((post) => {
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

									{/* Action buttons */}
									<div className="flex items-center gap-1 mt-2 flex-wrap">
										<Button
											variant="ghost"
											size="sm"
											className="h-7 px-2 text-xs"
											onClick={() => {
												setPrivateReplyTarget(null);
												setPrivateReplyText("");
												setReplyTarget({
													postId: post.id,
													commentId: post.id,
													accountId: post.accountId,
												});
											}}
										>
											<MessageSquare className="h-3.5 w-3.5 mr-1" />
											Reply
										</Button>

										<Button
											variant="ghost"
											size="sm"
											className="h-7 px-2 text-xs"
											onClick={() =>
												handleLike(post.id, post.id, post.accountId)
											}
										>
											<Heart
												className={cn(
													"h-3.5 w-3.5 mr-1",
													likedComments.has(`${post.id}-${post.id}`) &&
														"fill-red-500 text-red-500",
												)}
											/>
											Like
										</Button>

										{(post.platform === "instagram" ||
											post.platform === "facebook") && (
											<Button
												variant="ghost"
												size="sm"
												className="h-7 px-2 text-xs"
												onClick={() => {
													setReplyTarget(null);
													setReplyText("");
													setPrivateReplyTarget({
														postId: post.id,
														commentId: post.id,
														accountId: post.accountId,
													});
												}}
											>
												<MessageSquare className="h-3.5 w-3.5 mr-1" />
												DM
											</Button>
										)}

										<DropdownMenu>
											<DropdownMenuTrigger
												className="h-7 px-2 text-xs data-[state=open]:bg-accent rounded-md border border-input bg-background hover:bg-accent"
											>
												<MoreHorizontal className="h-3.5 w-3.5" />
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start">
												<DropdownMenuItem
													onClick={() =>
														handleHide(post.id, post.id, post.accountId)
													}
												>
													{hiddenComments.has(`${post.id}-${post.id}`) ? (
														<>
															<Eye className="h-4 w-4 mr-2" />
															Unhide
														</>
													) : (
														<>
															<EyeOff className="h-4 w-4 mr-2" />
															Hide
														</>
													)}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleDelete(post.id, post.id, post.accountId)
													}
													className="text-destructive"
													disabled={deletingComment === `${post.id}-${post.id}`}
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									{/* Reply textarea */}
									{replyTarget?.commentId === post.id && (
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
									)}

									{/* Private reply textarea */}
									{privateReplyTarget?.commentId === post.id && (
										<div className="mt-3 pt-3 border-t border-border/50 space-y-2">
											<Textarea
												placeholder="Send a private message..."
												value={privateReplyText}
												onChange={(e) => setPrivateReplyText(e.target.value)}
												className="min-h-[60px] resize-none text-sm"
											/>
											<div className="flex gap-2">
												<Button
													onClick={handlePrivateReply}
													disabled={
														!privateReplyText.trim() || isPrivateReplying
													}
													size="sm"
												>
													{isPrivateReplying ? "Sending..." : "Send DM"}
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setPrivateReplyTarget(null);
														setPrivateReplyText("");
													}}
												>
													Cancel
												</Button>
											</div>
										</div>
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
