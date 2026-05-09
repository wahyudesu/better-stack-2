"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenpost/ui/components/avatar";
import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import { Bot, MessageSquare, Star, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import {
	DepthButtonGroup,
	GroupedDepthButton,
} from "@/components/ui/depth-buttons";
import { Input } from "@/components/ui/input";
import {
	PlatformFilterDropdown,
	type PlatformFilterValue,
} from "@/components/ui/platform-filter";
import { Textarea } from "@/components/ui/textarea";
import {
	getMockMessages,
	mockComments,
	mockConversations,
	mockReviews,
	shouldUseMockData,
} from "@/data/inbox-mock";
import { api } from "@/lib/client";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { ChatPanel } from "./components/ChatPanel";
import {
	type Conversation,
	type CustomerLabel,
	getPlatformConfig,
	labelConfig,
	type ServerConversation,
	type ServerMessage,
} from "./types";

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

function mapServerConversation(src: ServerConversation): Conversation {
	return {
		id: src.id,
		platform: src.platform as Conversation["platform"],
		type: "message",
		sender: src.participantName || "Unknown",
		avatar:
			src.participantPicture ||
			`https://i.pravatar.cc/150?u=${src.participantId}`,
		isOnline: false,
		isRead: src.status === "archived" || (src.unreadCount ?? 0) === 0,
		isStarred: false,
		lastMessage: src.lastMessage || "",
		lastMessageTime: formatRelativeTime(src.updatedTime),
		unreadCount: src.unreadCount ?? 0,
		messages: [],
		mediaPost: undefined,
		customerLabel: undefined,
	};
}

type TypeFilter = "message" | "comment";
type SortBy = "newest" | "name";
type MessageFilter = "all" | "unread" | "favorites";

export function InboxContent() {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("messages");
	const [platform, setPlatform] = useState<PlatformFilterValue>("all");
	const [typeFilter, _setTypeFilter] = useState<TypeFilter>("message");
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const [messageInput, setMessageInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortBy>("newest");
	const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");

	// Comments tab state
	const [commentPlatform, setCommentPlatform] =
		useState<PlatformFilterValue>("all");
	const [replyTarget, setReplyTarget] = useState<{
		postId: string;
		commentId: string;
		platform: string;
	} | null>(null);
	const [replyText, setReplyText] = useState("");
	const [isReplying, setIsReplying] = useState(false);

	// Reviews tab state
	const [reviewPlatform, setReviewPlatform] =
		useState<PlatformFilterValue>("all");
	const [reviewFilter, setReviewFilter] = useState<
		"all" | "replied" | "not_replied"
	>("all");

	// Conversations query
	const { data: conversationsData, isLoading: conversationsLoading } = useQuery(
		{
			queryKey: ["inbox", "conversations", { platform }],
			queryFn: async () => {
				if (!useAuthStore.getState().clerkToken) return mockConversations;
				const res = await api.listConversations({
					platform: platform === "all" ? undefined : platform,
					limit: 50,
				});
				if (res.error && shouldUseMockData(res.error)) return mockConversations;
				if (res.error) throw new Error(res.error);
				return (res.data?.conversations ?? []) as ServerConversation[];
			},
		},
	);

	const serverConversations = useMemo(
		() => (conversationsData ?? []).map(mapServerConversation),
		[conversationsData],
	);

	// Messages query
	const { data: messagesData, isLoading: messagesLoading } = useQuery({
		queryKey: ["inbox", "messages", selectedConversation?.id],
		queryFn: async () => {
			if (!selectedConversation) return [];
			if (!useAuthStore.getState().clerkToken)
				return getMockMessages(selectedConversation.id);
			const res = await api.listMessages(selectedConversation.id, {
				accountId: selectedConversation.id,
				limit: 50,
				sortOrder: "desc",
			});
			if (res.error && shouldUseMockData(res.error))
				return getMockMessages(selectedConversation.id);
			if (res.error) throw new Error(res.error);
			return (res.data?.messages ?? []) as ServerMessage[];
		},
		enabled: !!selectedConversation,
	});

	// Mutations
	const sendMessageMutation = useMutation({
		mutationFn: async ({ text }: { text: string }) => {
			if (!selectedConversation) return;
			const res = await api.sendMessage(selectedConversation.id, {
				accountId: selectedConversation.id,
				message: text,
			});
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["inbox", "messages", selectedConversation?.id],
			});
			queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] });
			setMessageInput("");
		},
	});

	const markAsReadMutation = useMutation({
		mutationFn: async (conversationId: string) => {
			// Note: markAsRead now requires accountId, using conv.id as placeholder
			const res = await api.markAsRead(conversationId, conversationId);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] }),
	});

	// Handlers
	const handleSelectConversation = useCallback(
		(conv: Conversation) => {
			setSelectedConversation(conv);
			if (!conv.isRead) markAsReadMutation.mutate(conv.id);
		},
		[markAsReadMutation],
	);

	const handleSendMessage = useCallback(() => {
		if (!messageInput.trim()) return;
		sendMessageMutation.mutate({ text: messageInput });
	}, [messageInput, sendMessageMutation]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleLabelChange = useCallback(
		(label: CustomerLabel) => {
			if (!selectedConversation) return;
			setSelectedConversation({
				...selectedConversation,
				customerLabel: label,
			});
		},
		[selectedConversation],
	);

	const handleReply = async () => {
		if (!replyTarget || !replyText.trim()) return;
		setIsReplying(true);
		try {
			// accountId needed but not stored in replyTarget - using placeholder
			// TODO: pass accountId properly when triggering reply
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

	// Filter & sort conversations
	const filteredConversations = useMemo(() => {
		const result = serverConversations.filter((conv) => {
			const matchesPlatform = platform === "all" || conv.platform === platform;
			const matchesType = conv.type === typeFilter;
			const matchesSearch =
				!searchQuery ||
				conv.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
				conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
			let matchesMessageFilter = true;
			if (messageFilter === "unread")
				matchesMessageFilter = !conv.isRead || conv.unreadCount > 0;
			else if (messageFilter === "favorites")
				matchesMessageFilter = conv.isStarred;
			return (
				matchesPlatform && matchesType && matchesSearch && matchesMessageFilter
			);
		});
		if (sortBy === "newest")
			result.sort(
				(a, b) =>
					new Date(b.lastMessageTime).getTime() -
					new Date(a.lastMessageTime).getTime(),
			);
		else result.sort((a, b) => a.sender.localeCompare(b.sender));
		return result;
	}, [
		serverConversations,
		platform,
		typeFilter,
		searchQuery,
		sortBy,
		messageFilter,
	]);

	const tabs = [
		{
			id: "messages",
			label: "Messages",
			icon: <MessageSquare className="h-5 w-5" />,
		},
		{
			id: "comments",
			label: "Comments",
			icon: <MessageSquare className="h-5 w-5" />,
		},
		{
			id: "reviews",
			label: "Reviews",
			icon: <MessageSquare className="h-5 w-5" />,
		},
	];

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">
						Inbox
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage conversations and automation
					</p>
				</div>
			</div>

			{/* Tabs + Actions */}
			<div className="flex items-center justify-between mb-6">
				<AnimatedTabs
					tabs={tabs}
					activeTab={activeTab}
					onChange={setActiveTab}
					variant="underline"
				/>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Link href="/contacts">
							<Users className="h-4 w-4 mr-2" />
							Contacts
						</Link>
					</Button>
					<Button variant="outline" size="sm">
						<Link href="/inbox/campaigns">
							<Bot className="h-4 w-4 mr-2" />
							Campaigns
						</Link>
					</Button>
				</div>
			</div>

			{/* Messages Tab */}
			{activeTab === "messages" && (
				<>
					<div className="flex items-center gap-2 mb-4">
						<PlatformFilterDropdown value={platform} onChange={setPlatform} />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px]">
						{/* Conversation List */}
						<Card className="border-border/50 overflow-hidden flex flex-col">
							<div className="p-3 border-b border-border/50 space-y-2">
								<div className="flex items-center justify-between gap-2 pb-2">
									<DepthButtonGroup>
										<GroupedDepthButton
											position="first"
											size="sm"
											variant={messageFilter === "all" ? "blue" : "outline"}
											onClick={() => setMessageFilter("all")}
										>
											All
										</GroupedDepthButton>
										<GroupedDepthButton
											position="middle"
											size="sm"
											variant={messageFilter === "unread" ? "blue" : "outline"}
											onClick={() => setMessageFilter("unread")}
										>
											Unread
										</GroupedDepthButton>
										<GroupedDepthButton
											position="last"
											size="sm"
											variant={
												messageFilter === "favorites" ? "blue" : "outline"
											}
											onClick={() => setMessageFilter("favorites")}
										>
											Favorites
										</GroupedDepthButton>
									</DepthButtonGroup>
									<DepthButtonMenu
										value={sortBy}
										onChange={(v) => setSortBy(v as SortBy)}
										options={[
											{ value: "newest", label: "Terbaru" },
											{ value: "name", label: "Nama" },
										]}
										placeholder="Sort"
										size="sm"
									/>
								</div>
								<div className="relative">
									<Input
										placeholder="Search conversations..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 h-9 font-medium"
									/>
								</div>
							</div>

							<ScrollArea className="flex-1">
								<div className="p-2 space-y-1">
									{conversationsLoading ? (
										<div className="text-center py-8">
											<p className="text-sm text-muted-foreground">
												Loading conversations...
											</p>
										</div>
									) : filteredConversations.length === 0 ? (
										<div className="text-center py-8">
											<p className="text-sm text-muted-foreground">
												No conversations found
											</p>
										</div>
									) : (
										filteredConversations.map((conv) => {
											const config = getPlatformConfig(conv.platform);
											const Icon = config.icon;
											const isSelected = selectedConversation?.id === conv.id;
											return (
												<button
													type="button"
													key={conv.id}
													onClick={() => handleSelectConversation(conv)}
													className={cn(
														"w-full text-left p-3 rounded-xl transition-all hover:bg-muted/50",
														isSelected ? "bg-muted" : "",
														!conv.isRead && "bg-primary/5",
													)}
												>
													<div className="flex items-start gap-3">
														<div className="relative">
															<Avatar className="h-12 w-12">
																<AvatarImage src={conv.avatar} />
																<AvatarFallback>
																	{conv.sender[0].toUpperCase()}
																</AvatarFallback>
															</Avatar>
															{conv.isOnline && (
																<div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
															)}
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center justify-between mb-1">
																<div className="flex items-center gap-1.5">
																	<span className="font-semibold text-sm truncate">
																		{conv.sender}
																	</span>
																	{conv.isStarred && (
																		<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
																	)}
																	{conv.type === "message" &&
																		conv.customerLabel &&
																		conv.customerLabel !== "none" && (
																			<Badge
																				variant="outline"
																				className={cn(
																					"text-[9px] px-1.5 py-0 h-4 border",
																					labelConfig[conv.customerLabel]
																						.bgColor,
																					labelConfig[conv.customerLabel].color,
																				)}
																			>
																				{labelConfig[conv.customerLabel].label}
																			</Badge>
																		)}
																</div>
																<span className="text-xs text-muted-foreground whitespace-nowrap">
																	{conv.lastMessageTime}
																</span>
															</div>
															<div className="flex items-center gap-1.5 mb-1">
																<div
																	className={cn(
																		"flex items-center",
																		config.color,
																	)}
																>
																	<Icon className="h-3 w-3" />
																</div>
																<span className="text-[10px] text-muted-foreground capitalize">
																	{config.name}
																</span>
															</div>
															<p className="text-xs text-muted-foreground truncate">
																{conv.lastMessage}
															</p>
														</div>
														{conv.unreadCount > 0 && (
															<Badge className="h-5 min-w-5 px-1 flex items-center justify-center bg-primary text-primary-foreground text-[10px]">
																{conv.unreadCount}
															</Badge>
														)}
													</div>
												</button>
											);
										})
									)}
								</div>
							</ScrollArea>
						</Card>

						{/* Chat View */}
						<Card
							className={cn(
								"hidden lg:flex lg:col-span-2 border-border/50 overflow-hidden flex-col",
								!selectedConversation && "items-center justify-center",
							)}
						>
							{!selectedConversation ? (
								<div className="text-center p-8">
									<MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
									<p className="text-muted-foreground">
										Select a conversation to start messaging
									</p>
								</div>
							) : (
								<ChatPanel
									conversation={selectedConversation}
									messages={messagesData ?? []}
									isLoading={messagesLoading}
									messageInput={messageInput}
									onMessageInputChange={setMessageInput}
									onSendMessage={handleSendMessage}
									onKeyDown={handleKeyPress}
									onLabelChange={handleLabelChange}
								/>
							)}
						</Card>
					</div>
				</>
			)}

			{/* Comments Tab */}
			{activeTab === "comments" && (
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<PlatformFilterDropdown
							value={commentPlatform}
							onChange={setCommentPlatform}
						/>
					</div>
					{mockComments.filter(
						(c) => commentPlatform === "all" || c.platform === commentPlatform,
					).length === 0 ? (
						<Card className="border-border/50 p-8 text-center">
							<MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
							<p className="text-muted-foreground">No comments found</p>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{mockComments
								.filter(
									(c) =>
										commentPlatform === "all" || c.platform === commentPlatform,
								)
								.map((post) => {
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
														<div
															className={cn("flex items-center", config.color)}
														>
															<Icon className="h-3 w-3" />
														</div>
														<span className="text-xs text-muted-foreground">
															@{post.accountUsername}
														</span>
														<span className="text-xs text-muted-foreground">
															{formatRelativeTime(post.createdTime)}
														</span>
													</div>
													<p className="text-sm mb-2 line-clamp-2">
														{post.content}
													</p>
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
					)}
				</div>
			)}

			{/* Reviews Tab */}
			{activeTab === "reviews" && (
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<PlatformFilterDropdown
							value={reviewPlatform}
							onChange={setReviewPlatform}
						/>
						<DepthButtonGroup>
							<GroupedDepthButton
								position="first"
								size="sm"
								variant={reviewFilter === "all" ? "blue" : "outline"}
								onClick={() => setReviewFilter("all")}
							>
								All
							</GroupedDepthButton>
							<GroupedDepthButton
								position="middle"
								size="sm"
								variant={reviewFilter === "not_replied" ? "blue" : "outline"}
								onClick={() => setReviewFilter("not_replied")}
							>
								Not Replied
							</GroupedDepthButton>
							<GroupedDepthButton
								position="last"
								size="sm"
								variant={reviewFilter === "replied" ? "blue" : "outline"}
								onClick={() => setReviewFilter("replied")}
							>
								Replied
							</GroupedDepthButton>
						</DepthButtonGroup>
					</div>
					{mockReviews.filter((r) => {
						if (reviewPlatform !== "all" && r.platform !== reviewPlatform)
							return false;
						if (reviewFilter === "replied" && !r.hasReply) return false;
						if (reviewFilter === "not_replied" && r.hasReply) return false;
						return true;
					}).length === 0 ? (
						<Card className="border-border/50 p-8 text-center">
							<Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
							<p className="text-muted-foreground">No reviews found</p>
						</Card>
					) : (
						<div className="space-y-3">
							{mockReviews
								.filter((r) => {
									if (reviewPlatform !== "all" && r.platform !== reviewPlatform)
										return false;
									if (reviewFilter === "replied" && !r.hasReply) return false;
									if (reviewFilter === "not_replied" && r.hasReply)
										return false;
									return true;
								})
								.map((review) => {
									const config = getPlatformConfig(review.platform);
									const Icon = config.icon;
									return (
										<Card
											key={review.id}
											className="border-border/50 p-4 hover:bg-muted/30 transition-colors"
										>
											<div className="flex items-start gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage
														src={
															review.reviewer.profileImage ||
															`https://i.pravatar.cc/150?u=${review.reviewer.name}`
														}
													/>
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
														<div
															className={cn("flex items-center", config.color)}
														>
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
					)}
				</div>
			)}
		</div>
	);
}
