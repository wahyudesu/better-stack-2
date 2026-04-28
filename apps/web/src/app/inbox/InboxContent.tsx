"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenpost/ui/components/avatar";
import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import {
	ArrowLeft,
	Bot,
	Briefcase,
	Check,
	Instagram,
	MessageSquare,
	MoreVertical,
	Music,
	Paperclip,
	Search,
	Send,
	Smile,
	Star,
	Tag,
	Twitter,
	Users,
	X,
	Youtube,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useAuthGate } from "@/components/auth";
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
import { Textarea } from "@/components/ui/textarea";
import {
	PlatformFilterDropdown,
	type PlatformFilterValue,
} from "@/components/ui/platform-filter";
import {
	getMockMessages,
	type MockContact,
	mockBroadcasts,
	mockComments,
	mockContacts,
	mockConversations,
	mockReviews,
	shouldUseMockData,
} from "@/data/inbox-mock";
import { api } from "@/lib/client";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn, formatRelativeTime } from "@/lib/utils";
import { InboxAutomation } from "./InboxAutomation";

// Server response shapes from Zernio API
// https://zernio.com/docs - Inbox Conversations endpoint
export interface ServerConversation {
	id: string;
	platform: string;
	accountId: string;
	accountUsername: string;
	participantId: string;
	participantName: string;
	participantPicture: string | null;
	participantVerifiedType: "blue" | "government" | "business" | "none" | null;
	lastMessage: string;
	updatedTime: string;
	status: "active" | "archived";
	unreadCount: number | null;
	url: string | null;
	instagramProfile?: {
		isFollower: boolean | null;
		isFollowing: boolean | null;
		followerCount: number | null;
		isVerified: boolean | null;
		fetchedAt: string | null;
	};
}

export interface ServerMessage {
	id: string;
	conversationId: string;
	accountId: string;
	platform: string;
	message: string;
	senderId: string;
	senderName: string | null;
	senderVerifiedType: "blue" | "government" | "business" | "none" | null;
	direction: "incoming" | "outgoing";
	createdAt: string;
	attachments: Array<{
		id: string;
		type: "image" | "video" | "audio" | "file" | "sticker" | "share";
		url: string;
		filename: string | null;
		previewUrl: string | null;
	}>;
	subject?: string | null;
	storyReply?: boolean | null;
	isStoryMention?: boolean | null;
	isEdited?: boolean;
	editedAt?: string | null;
	deliveryStatus?: "sent" | "delivered" | "read" | "failed" | "deleted" | null;
}

// Customer label for conversation (stored locally, not from Zernio)
type CustomerLabel = "vip" | "lead" | "customer" | "partner" | "none";

const labelConfig: Record<
	CustomerLabel,
	{ label: string; color: string; bgColor: string }
> = {
	vip: {
		label: "VIP",
		color: "text-yellow-600",
		bgColor: "bg-yellow-500/15 border-yellow-500/30",
	},
	lead: {
		label: "Lead",
		color: "text-blue-600",
		bgColor: "bg-blue-500/15 border-blue-500/30",
	},
	customer: {
		label: "Customer",
		color: "text-green-600",
		bgColor: "bg-green-500/15 border-green-500/30",
	},
	partner: {
		label: "Partner",
		color: "text-purple-600",
		bgColor: "bg-purple-500/15 border-purple-500/30",
	},
	none: { label: "No Label", color: "text-muted-foreground", bgColor: "" },
};

type Platform = PlatformFilterValue;
type TypeFilter = "message" | "comment";
type SortBy = "newest" | "name";
type MessageFilter = "all" | "unread" | "favorites";

interface ChatMessage {
	id: string;
	content: string;
	timestamp: string;
	isFromMe: boolean;
	mediaUrl?: string;
}

interface Conversation {
	id: string;
	platform:
		| "instagram"
		| "tiktok"
		| "twitter"
		| "youtube"
		| "facebook"
		| "linkedin"
		| "threads"
		| "reddit"
		| "bluesky"
		| "telegram"
		| "google"
		| "snapchat"
		| "discord"
		| "whatsapp";
	type: "message" | "comment";
	sender: string;
	avatar: string;
	isOnline: boolean;
	isRead: boolean;
	isStarred: boolean;
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number;
	messages: ChatMessage[];
	mediaPost?: string;
	customerLabel?: CustomerLabel;
}

const platformConfig: Record<
	string,
	{ icon: React.ElementType; color: string; bg: string; name: string }
> = {
	instagram: {
		icon: Instagram,
		color: "text-pink-500",
		bg: "bg-pink-500/10",
		name: "Instagram",
	},
	tiktok: {
		icon: Music,
		color: "text-gray-100",
		bg: "bg-gray-100/10 dark:bg-gray-800/50",
		name: "TikTok",
	},
	twitter: {
		icon: Twitter,
		color: "text-blue-400",
		bg: "bg-blue-500/10",
		name: "Twitter",
	},
	youtube: {
		icon: Youtube,
		color: "text-red-500",
		bg: "bg-red-500/10",
		name: "YouTube",
	},
	facebook: {
		icon: Users,
		color: "text-blue-600",
		bg: "bg-blue-500/10",
		name: "Facebook",
	},
	linkedin: {
		icon: Users,
		color: "text-blue-700",
		bg: "bg-blue-600/10",
		name: "LinkedIn",
	},
	threads: {
		icon: MessageSquare,
		color: "text-gray-900 dark:text-gray-100",
		bg: "bg-gray-500/10",
		name: "Threads",
	},
	reddit: {
		icon: MessageSquare,
		color: "text-orange-500",
		bg: "bg-orange-500/10",
		name: "Reddit",
	},
	bluesky: {
		icon: MessageSquare,
		color: "text-blue-500",
		bg: "bg-blue-400/10",
		name: "Bluesky",
	},
	telegram: {
		icon: MessageSquare,
		color: "text-blue-400",
		bg: "bg-blue-400/10",
		name: "Telegram",
	},
	google: {
		icon: MessageSquare,
		color: "text-green-500",
		bg: "bg-green-500/10",
		name: "Google",
	},
	snapchat: {
		icon: MessageSquare,
		color: "text-yellow-400",
		bg: "bg-yellow-400/10",
		name: "Snapchat",
	},
	discord: {
		icon: Users,
		color: "text-indigo-500",
		bg: "bg-indigo-500/10",
		name: "Discord",
	},
	whatsapp: {
		icon: MessageSquare,
		color: "text-green-500",
		bg: "bg-green-500/10",
		name: "WhatsApp",
	},
};

function getPlatformConfig(platform: string) {
	return (
		platformConfig[platform] ?? {
			icon: MessageSquare,
			color: "text-muted-foreground",
			bg: "bg-muted",
			name: platform,
		}
	);
}

// Map Zernio API conversation to client Conversation type
function mapServerConversation(src: ServerConversation): Conversation {
	const platform = src.platform as Conversation["platform"];
	return {
		id: src.id,
		platform,
		type: "message", // Zernio doesn't have type field for conversations
		sender: src.participantName || "Unknown",
		avatar:
			src.participantPicture ||
			`https://i.pravatar.cc/150?u=${src.participantId}`,
		isOnline: false, // Zernio doesn't provide online status
		isRead: src.status === "archived" || (src.unreadCount ?? 0) === 0,
		isStarred: false, // Zernio doesn't have starred field for conversations
		lastMessage: src.lastMessage || "",
		lastMessageTime: formatRelativeTime(src.updatedTime),
		unreadCount: src.unreadCount ?? 0,
		messages: [],
		mediaPost: undefined, // Zernio doesn't include media post caption in list response
		customerLabel: undefined, // Customer labels stored locally
	};
}

export function InboxContent() {
	const { gatedCallback } = useAuthGate();
	const queryClient = useQueryClient();

	const [activeTab, setActiveTab] = useState("messages");
	const [platform, setPlatform] = useState<Platform>("all");
	const [typeFilter, setTypeFilter] = useState<TypeFilter>("message");
	const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const [messageInput, setMessageInput] = useState("");
	const [sortBy, setSortBy] = useState<SortBy>("newest");

	// Fetch conversations (use mock data when API unavailable)
	const { data: conversationsData, isLoading: conversationsLoading } = useQuery(
		{
			queryKey: ["inbox", "conversations", { platform }],
			queryFn: async () => {
				const res = await api.listConversations({
					platform: platform === "all" ? undefined : platform,
					limit: 50,
				});
				// Fallback to mock data when API unavailable
				if (res.error && shouldUseMockData(res.error)) {
					return mockConversations;
				}
				if (res.error) throw new Error(res.error);
				return (res.data?.conversations ?? []) as ServerConversation[];
			},
		},
	);

	// Map server conversations to client type
	const serverConversations = useMemo(
		() => (conversationsData ?? []).map(mapServerConversation),
		[conversationsData],
	);

	// Fetch messages for selected conversation (use mock data when API unavailable)
	const { data: messagesData, isLoading: messagesLoading } = useQuery({
		queryKey: ["inbox", "messages", selectedConversation?.id],
		queryFn: async () => {
			if (!selectedConversation) return [];
			const res = await api.listMessages(selectedConversation.id, {
				limit: 50,
			});
			// Fallback to mock data when API unavailable
			if (res.error && shouldUseMockData(res.error)) {
				return getMockMessages(selectedConversation.id);
			}
			if (res.error) throw new Error(res.error);
			return (res.data?.messages ?? []) as ServerMessage[];
		},
		enabled: !!selectedConversation,
	});

	// Send message mutation
	const sendMessageMutation = useMutation({
		mutationFn: async ({
			text,
			mediaUrl,
		}: {
			text: string;
			mediaUrl?: string;
		}) => {
			if (!selectedConversation) return;
			const res = await api.sendMessage(selectedConversation.id, {
				text,
				mediaUrl,
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

	// Mark as read mutation
	const markAsReadMutation = useMutation({
		mutationFn: async (conversationId: string) => {
			const res = await api.markAsRead(conversationId);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "conversations"] });
		},
	});

	// Select conversation and mark as read
	const handleSelectConversation = useCallback(
		(conv: Conversation) => {
			setSelectedConversation(conv);
			if (!conv.isRead) {
				markAsReadMutation.mutate(conv.id);
			}
		},
		[markAsReadMutation],
	);

	// Send message handler
	const handleSendMessageInternal = useCallback(() => {
		if (!messageInput.trim()) return;
		sendMessageMutation.mutate({ text: messageInput });
	}, [messageInput, sendMessageMutation]);

	const tabs = [
		{
			id: "messages",
			label: "Messages",
			icon: <MessageSquare className="h-5 w-5" />,
		},
		{
			id: "comments",
			label: "Comments",
			icon: <Star className="h-5 w-5" />,
		},
		{
			id: "reviews",
			label: "Reviews",
			icon: <Star className="h-5 w-5" />,
		},
		{
			id: "contacts",
			label: "Contacts",
			icon: <Users className="h-5 w-5" />,
		},
		{
			id: "automation",
			label: "Automation",
			icon: <Bot className="h-5 w-5" />,
		},
	];

	// Filter conversations
	const filteredConversations = useMemo(() => {
		let result = serverConversations.filter((conv) => {
			const matchesPlatform = platform === "all" || conv.platform === platform;
			const matchesType = conv.type === typeFilter;
			const matchesSearch =
				searchQuery === "" ||
				conv.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
				conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

			// Message filter
			let matchesMessageFilter = true;
			if (messageFilter === "unread") {
				matchesMessageFilter = !conv.isRead || conv.unreadCount > 0;
			} else if (messageFilter === "favorites") {
				matchesMessageFilter = conv.isStarred;
			}

			return (
				matchesPlatform && matchesType && matchesSearch && matchesMessageFilter
			);
		});

		// Sort based on sortBy
		if (sortBy === "newest") {
			result = [...result].sort((a, b) => {
				const aTime = new Date(a.lastMessageTime).getTime();
				const bTime = new Date(b.lastMessageTime).getTime();
				return bTime - aTime;
			});
		} else if (sortBy === "name") {
			result = [...result].sort((a, b) => a.sender.localeCompare(b.sender));
		}

		return result;
	}, [
		serverConversations,
		platform,
		typeFilter,
		searchQuery,
		sortBy,
		messageFilter,
	]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessageInternal();
		}
	};

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			{/* Header */}
			<div className="mb-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">
					Inbox
				</h1>
				<p className="text-sm text-muted-foreground">
					Manage conversations and automation
				</p>
			</div>

			{/* Tabs */}
			<AnimatedTabs
				tabs={tabs}
				activeTab={activeTab}
				onChange={setActiveTab}
				variant="underline"
				className="mb-6"
			/>

			{/* Content */}
			{(activeTab === "messages" || activeTab === "inbox") && (
				<>
					{/* Filters */}
					<div className="flex items-center gap-2 mb-4">
						<PlatformFilterDropdown value={platform} onChange={setPlatform} />

						<DepthButtonMenu
							value={typeFilter}
							onChange={(v) => setTypeFilter(v as TypeFilter)}
							options={[
								{
									value: "message",
									label: "Messages",
									icon: <MessageSquare className="h-4 w-4" />,
								},
								{
									value: "comment",
									label: "Comments",
									icon: <MessageSquare className="h-4 w-4" />,
								},
							]}
							placeholder="Type"
							size="default"
						/>
					</div>

					{/* CRM Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px]">
						{/* Conversation List */}
						<Card className="lg:col-span-1 border-border/50 overflow-hidden flex flex-col">
							{/* Search & Sort */}
							<div className="p-3 border-b border-border/50 space-y-2">
								{/* Filter Tabs + Sort in one row */}
								<div className="flex items-center justify-between gap-2">
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
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search conversations..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 h-9 font-medium"
									/>
								</div>
							</div>

							{/* Conversation List */}
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
														"w-full text-left p-3 rounded-xl transition-all",
														"hover:bg-muted/50",
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
								<>
									{/* Chat Header */}
									<div className="p-4 border-b border-border/50">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage src={selectedConversation.avatar} />
													<AvatarFallback>
														{selectedConversation.sender[0].toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex items-center gap-2">
														<h3 className="font-semibold">
															{selectedConversation.sender}
														</h3>
														{/* Customer Label - Only for messages */}
														{/* Customer Label - Only for messages */}
														{selectedConversation.type === "message" && (
															<DepthButtonMenu
																value={
																	selectedConversation.customerLabel &&
																	selectedConversation.customerLabel !== "none"
																		? selectedConversation.customerLabel
																		: undefined
																}
																onChange={(label) =>
																	setSelectedConversation({
																		...selectedConversation,
																		customerLabel: label as CustomerLabel,
																	})
																}
																options={[
																	{
																		value: "vip",
																		label: "VIP",
																		icon: (
																			<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
																		),
																		description: "Very important",
																	},
																	{
																		value: "lead",
																		label: "Lead",
																		icon: (
																			<MessageSquare className="h-3 w-3 text-blue-600" />
																		),
																		description: "Potential customer",
																	},
																	{
																		value: "customer",
																		label: "Customer",
																		icon: (
																			<Check className="h-3 w-3 text-green-600" />
																		),
																		description: "Active customer",
																	},
																	{
																		value: "partner",
																		label: "Partner",
																		icon: (
																			<Tag className="h-3 w-3 text-purple-600" />
																		),
																		description: "Business partner",
																	},
																]}
																placeholder="Add Label"
																size="sm"
																panelClassName="w-44"
															/>
														)}
														<div className="flex items-center gap-1.5">
															{(() => {
																const config =
																	platformConfig[selectedConversation.platform];
																const Icon = config.icon;
																return (
																	<>
																		<Icon
																			className={cn("h-3 w-3", config.color)}
																		/>
																		<span className="text-xs text-muted-foreground">
																			{config.name}
																		</span>
																	</>
																);
															})()}
														</div>
													</div>
												</div>
												<Button variant="ghost" size="icon">
													<MoreVertical className="h-5 w-5" />
												</Button>
											</div>
										</div>

										{selectedConversation.mediaPost && (
											<div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
												<MessageSquare className="h-3 w-3" />
												<span>On: {selectedConversation.mediaPost}</span>
											</div>
										)}
									</div>

									{/* Messages */}
									<ScrollArea className="flex-1 p-4">
										<div className="space-y-4">
											{messagesLoading ? (
												<div className="text-center py-8 text-muted-foreground text-sm">
													Loading messages...
												</div>
											) : (
												(messagesData ?? []).map((msg) => {
													const isFromMe = msg.direction === "outgoing";
													return (
														<div
															key={msg.id}
															className={cn(
																"flex",
																isFromMe ? "justify-end" : "justify-start",
															)}
														>
															<div
																className={cn(
																	"max-w-[70%] rounded-2xl px-4 py-2.5",
																	isFromMe
																		? "bg-primary text-primary-foreground rounded-br-sm"
																		: "bg-muted rounded-bl-sm",
																)}
															>
																<p className="text-sm whitespace-pre-wrap">
																	{msg.message}
																</p>
																<p
																	className={cn(
																		"text-[10px] mt-1",
																		isFromMe
																			? "text-primary-foreground/70"
																			: "text-muted-foreground",
																	)}
																>
																	{formatRelativeTime(msg.createdAt)}
																</p>
															</div>
														</div>
													);
												})
											)}
										</div>
									</ScrollArea>

									{/* Message Input */}
									<div className="p-4 border-t border-border/50">
										<div className="flex items-end gap-2">
											<div className="flex-1 relative">
												<Input
													placeholder="Type a message..."
													value={messageInput}
													onChange={(e) => setMessageInput(e.target.value)}
													onKeyDown={handleKeyPress}
													className="pr-10 min-h-[44px] resize-none"
												/>
												<div className="absolute right-2 bottom-2 flex items-center gap-1">
													<Button
														variant="ghost"
														size="icon"
														className="h-7 w-7"
													>
														<Paperclip className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-7 w-7"
													>
														<Smile className="h-4 w-4" />
													</Button>
												</div>
											</div>
											<Button
												onClick={handleSendMessageInternal}
												disabled={!messageInput.trim()}
												size="icon"
												className="h-11 w-11 shrink-0"
											>
												<Send className="h-5 w-5" />
											</Button>
										</div>
									</div>
								</>
							)}
						</Card>

						{/* Mobile Chat View */}
						{selectedConversation && (
							<Card className="lg:hidden fixed inset-0 z-50 flex flex-col rounded-none">
								{/* Mobile Header */}
								<div className="p-4 border-b border-border/50 flex items-center gap-3">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setSelectedConversation(null)}
									>
										<ArrowLeft className="h-5 w-5" />
									</Button>
									<Avatar className="h-10 w-10">
										<AvatarImage src={selectedConversation.avatar} />
										<AvatarFallback>
											{selectedConversation.sender[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<h3 className="font-semibold">
											{selectedConversation.sender}
										</h3>
										<p className="text-xs text-muted-foreground capitalize">
											{selectedConversation.platform}
										</p>
									</div>
								</div>

								{/* Mobile Messages */}
								<ScrollArea className="flex-1 p-4">
									<div className="space-y-4">
										{messagesLoading ? (
											<div className="text-center py-8 text-muted-foreground text-sm">
												Loading messages...
											</div>
										) : (
											(messagesData ?? []).map((msg) => {
												const isFromMe = msg.direction === "outgoing";
												const hasImageAttachment = msg.attachments?.some(
													(a) => a.type === "image",
												);
												const imageAttachment = msg.attachments?.find(
													(a) => a.type === "image",
												);
												return (
													<div
														key={msg.id}
														className={cn(
															"flex",
															isFromMe ? "justify-end" : "justify-start",
														)}
													>
														<div
															className={cn(
																"max-w-[70%] rounded-2xl px-4 py-2.5",
																isFromMe
																	? "bg-primary text-primary-foreground rounded-br-sm"
																	: "bg-muted rounded-bl-sm",
															)}
														>
															{hasImageAttachment &&
																imageAttachment?.previewUrl && (
																	<img
																		src={imageAttachment.previewUrl}
																		alt="Attachment"
																		className="rounded-lg mb-2 max-w-full h-auto"
																	/>
																)}
															<p className="text-sm whitespace-pre-wrap">
																{msg.message}
															</p>
															<p
																className={cn(
																	"text-[10px] mt-1",
																	isFromMe
																		? "text-primary-foreground/70"
																		: "text-muted-foreground",
																)}
															>
																{formatRelativeTime(msg.createdAt)}
																{msg.isEdited && " • Edited"}
															</p>
														</div>
													</div>
												);
											})
										)}
									</div>
								</ScrollArea>

								{/* Mobile Input */}
								<div className="p-4 border-t border-border/50">
									<div className="flex items-end gap-2">
										<Input
											placeholder="Type a message..."
											value={messageInput}
											onChange={(e) => setMessageInput(e.target.value)}
											onKeyDown={handleKeyPress}
											className="flex-1"
										/>
										<Button
											onClick={handleSendMessageInternal}
											disabled={!messageInput.trim()}
											size="icon"
										>
											<Send className="h-5 w-5" />
										</Button>
									</div>
								</div>
							</Card>
						)}
					</div>
				</>
			)}

			{activeTab === "automation" && <InboxAutomation />}

			{activeTab === "comments" && <CommentsTab comments={mockComments} />}

			{activeTab === "reviews" && <ReviewsTab reviews={mockReviews} />}

			{activeTab === "contacts" && (
				<ContactsTab contacts={mockContacts as unknown as Contact[]} />
			)}
		</div>
	);
}

// ============================================================
// COMMENTS TAB
// ============================================================

interface CommentsTabProps {
	comments: Array<{
		id: string;
		platform: string;
		accountUsername: string;
		content: string;
		picture: string | null;
		permalink: string | null;
		createdTime: string;
		commentCount: number;
		likeCount: number;
	}>;
}

function CommentsTab({ comments }: CommentsTabProps) {
	const [platformFilter, setPlatformFilter] = useState<Platform>("all");
	const [replyTarget, setReplyTarget] = useState<{
		postId: string;
		commentId: string;
		platform: string;
	} | null>(null);
	const [replyText, setReplyText] = useState("");
	const [isReplying, setIsReplying] = useState(false);

	const filteredComments = comments.filter(
		(c) => platformFilter === "all" || c.platform === platformFilter,
	);

	const handleReply = async () => {
		if (!replyTarget || !replyText.trim()) return;
		setIsReplying(true);
		try {
			await api.privateReply(replyTarget.postId, replyTarget.commentId, {
				text: replyText,
			});
			setReplyTarget(null);
			setReplyText("");
		} finally {
			setIsReplying(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<PlatformFilterDropdown
					value={platformFilter}
					onChange={setPlatformFilter}
				/>
			</div>

			{replyTarget && (
				<Card className="border-border/50 p-4 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Reply Comment</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							onClick={() => {
								setReplyTarget(null);
								setReplyText("");
							}}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<Textarea
						placeholder="Write your reply..."
						value={replyText}
						onChange={(e) => setReplyText(e.target.value)}
						className="min-h-[80px] resize-none"
					/>
					<div className="flex gap-2">
						<Button
							onClick={handleReply}
							disabled={!replyText.trim() || isReplying}
						>
							{isReplying ? "Sending..." : "Send Reply"}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setReplyTarget(null);
								setReplyText("");
							}}
						>
							Cancel
						</Button>
					</div>
				</Card>
			)}

			{filteredComments.length === 0 ? (
				<Card className="border-border/50 p-8 text-center">
					<MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
					<p className="text-muted-foreground">No comments found</p>
				</Card>
			) : (
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
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

// ============================================================
// REVIEWS TAB
// ============================================================

interface ReviewsTabProps {
	reviews: Array<{
		id: string;
		platform: string;
		accountUsername: string;
		reviewer: { name: string; profileImage: string | null };
		rating: number;
		text: string;
		created: string;
		hasReply: boolean;
		reply?: { text: string };
	}>;
}

function ReviewsTab({ reviews }: ReviewsTabProps) {
	const [platformFilter, setPlatformFilter] = useState<Platform>("all");
	const [filter, setFilter] = useState<"all" | "replied" | "not_replied">(
		"all",
	);

	const filteredReviews = reviews.filter((r) => {
		if (platformFilter !== "all" && r.platform !== platformFilter) return false;
		if (filter === "replied" && !r.hasReply) return false;
		if (filter === "not_replied" && r.hasReply) return false;
		return true;
	});

	const platforms = ["all", ...new Set(reviews.map((r) => r.platform))];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<PlatformFilterDropdown
					value={platformFilter}
					onChange={setPlatformFilter}
				/>
				<DepthButtonGroup>
					<GroupedDepthButton
						position="first"
						size="sm"
						variant={filter === "all" ? "blue" : "outline"}
						onClick={() => setFilter("all")}
					>
						All
					</GroupedDepthButton>
					<GroupedDepthButton
						position="middle"
						size="sm"
						variant={filter === "not_replied" ? "blue" : "outline"}
						onClick={() => setFilter("not_replied")}
					>
						Not Replied
					</GroupedDepthButton>
					<GroupedDepthButton
						position="last"
						size="sm"
						variant={filter === "replied" ? "blue" : "outline"}
						onClick={() => setFilter("replied")}
					>
						Replied
					</GroupedDepthButton>
				</DepthButtonGroup>
			</div>

			{filteredReviews.length === 0 ? (
				<Card className="border-border/50 p-8 text-center">
					<Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
					<p className="text-muted-foreground">No reviews found</p>
				</Card>
			) : (
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
			)}
		</div>
	);
}

// ============================================================
// CAMPAIGNS TAB
// ============================================================

interface CampaignsTabProps {
	broadcasts: Array<{
		id: string;
		name: string;
		platform: string;
		accountName: string;
		status:
			| "draft"
			| "scheduled"
			| "sending"
			| "completed"
			| "failed"
			| "cancelled";
		messagePreview: string;
		scheduledAt: string | null;
		recipientCount: number;
		deliveredCount: number;
		readCount: number;
		failedCount: number;
	}>;
}

function CampaignsTab({ broadcasts }: CampaignsTabProps) {
	const [platformFilter, setPlatformFilter] = useState<Platform>("all");

	const filteredBroadcasts = broadcasts.filter(
		(b) => platformFilter === "all" || b.platform === platformFilter,
	);

	const platforms = ["all", ...new Set(broadcasts.map((b) => b.platform))];

	const getStatusBadge = (
		status: CampaignsTabProps["broadcasts"][number]["status"],
	) => {
		const config = {
			draft: { label: "Draft", bg: "bg-muted", text: "text-muted-foreground" },
			scheduled: {
				label: "Scheduled",
				bg: "bg-blue-500/10",
				text: "text-blue-600",
			},
			sending: {
				label: "Sending",
				bg: "bg-yellow-500/10",
				text: "text-yellow-600",
			},
			completed: {
				label: "Completed",
				bg: "bg-green-500/10",
				text: "text-green-600",
			},
			failed: { label: "Failed", bg: "bg-red-500/10", text: "text-red-600" },
			cancelled: {
				label: "Cancelled",
				bg: "bg-muted",
				text: "text-muted-foreground",
			},
		};
		const c = config[status];
		return (
			<Badge variant="outline" className={cn("text-xs", c.bg, c.text)}>
				{c.label}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<PlatformFilterDropdown
					value={platformFilter}
					onChange={setPlatformFilter}
				/>
			</div>

			{filteredBroadcasts.length === 0 ? (
				<Card className="border-border/50 p-8 text-center">
					<Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
					<p className="text-muted-foreground">No campaigns found</p>
				</Card>
			) : (
				<div className="space-y-3">
					{filteredBroadcasts.map((broadcast) => {
						const config = getPlatformConfig(broadcast.platform);
						const Icon = config.icon;
						const deliveryRate =
							broadcast.recipientCount > 0
								? Math.round(
										(broadcast.deliveredCount / broadcast.recipientCount) * 100,
									)
								: 0;
						return (
							<Card
								key={broadcast.id}
								className="border-border/50 p-4 hover:bg-muted/30 transition-colors"
							>
								<div className="flex items-start justify-between mb-3">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold text-sm">
												{broadcast.name}
											</h3>
											{getStatusBadge(broadcast.status)}
										</div>
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
											<div className={cn("flex items-center", config.color)}>
												<Icon className="h-3 w-3" />
											</div>
											<span>{broadcast.accountName}</span>
										</div>
									</div>
									{broadcast.scheduledAt && (
										<span className="text-xs text-muted-foreground">
											{formatRelativeTime(broadcast.scheduledAt)}
										</span>
									)}
								</div>

								<p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mb-3 truncate">
									{broadcast.messagePreview}
								</p>

								<div className="grid grid-cols-4 gap-2">
									<div className="bg-muted/50 rounded-lg p-2 text-center">
										<p className="text-lg font-bold">
											{broadcast.recipientCount}
										</p>
										<p className="text-[10px] text-muted-foreground">
											Recipients
										</p>
									</div>
									<div className="bg-muted/50 rounded-lg p-2 text-center">
										<p className="text-lg font-bold">
											{broadcast.deliveredCount}
										</p>
										<p className="text-[10px] text-muted-foreground">
											Delivered
										</p>
									</div>
									<div className="bg-muted/50 rounded-lg p-2 text-center">
										<p className="text-lg font-bold">{deliveryRate}%</p>
										<p className="text-[10px] text-muted-foreground">Rate</p>
									</div>
									<div className="bg-muted/50 rounded-lg p-2 text-center">
										<p className="text-lg font-bold text-red-500">
											{broadcast.failedCount}
										</p>
										<p className="text-[10px] text-muted-foreground">Failed</p>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

// ============================================================
// CONTACTS TAB
// ============================================================

interface Contact {
	id: string;
	name: string;
	email: string;
	company: string;
	avatarUrl: string;
	tags: string[];
	notes: string;
	platform: string;
	isSubscribed: boolean;
	lastMessageSentAt: string | null;
	messagesSentCount: number;
}

function ContactsTab({ contacts: initialContacts }: { contacts: Contact[] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [tagFilter, setTagFilter] = useState<string | null>(null);
	const [contacts, setContacts] = useState<Contact[]>(initialContacts);
	const [editingContact, setEditingContact] = useState<Contact | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState<Partial<Contact>>({});

	const allTags = useMemo(() => {
		const tags = new Set<string>();
		contacts.forEach((c) => c.tags.forEach((t) => tags.add(t)));
		return Array.from(tags).sort();
	}, [contacts]);

	const filteredContacts = contacts.filter((c) => {
		const matchesSearch =
			searchQuery === "" ||
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTag = !tagFilter || c.tags.includes(tagFilter);
		return matchesSearch && matchesTag;
	});

	const handleSave = () => {
		if (!formData.name) return;

		if (editingContact) {
			// Update existing
			setContacts((prev) =>
				prev.map((c) =>
					c.id === editingContact.id ? ({ ...c, ...formData } as Contact) : c,
				),
			);
		} else {
			// Create new
			const newContact: Contact = {
				id: `contact_${Date.now()}`,
				name: formData.name || "",
				email: formData.email || "",
				company: formData.company || "",
				avatarUrl:
					formData.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`,
				tags: formData.tags || [],
				notes: formData.notes || "",
				platform: formData.platform || "instagram",
				isSubscribed: true,
				lastMessageSentAt: null,
				messagesSentCount: 0,
			};
			setContacts((prev) => [newContact, ...prev]);
		}
		setShowForm(false);
		setEditingContact(null);
		setFormData({});
	};

	const handleEdit = (contact: Contact) => {
		setEditingContact(contact);
		setFormData(contact);
		setShowForm(true);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Delete this contact?")) return;
		setContacts((prev) => prev.filter((c) => c.id !== id));
	};

	const handleAddNew = () => {
		setEditingContact(null);
		setFormData({ platform: "instagram", tags: [] });
		setShowForm(true);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 flex-wrap">
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search contacts..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-9"
					/>
				</div>
				<DepthButtonGroup>
					<GroupedDepthButton
						position="first"
						size="sm"
						variant={!tagFilter ? "blue" : "outline"}
						onClick={() => setTagFilter(null)}
					>
						All
					</GroupedDepthButton>
					{allTags.slice(0, 3).map((tag, idx) => (
						<GroupedDepthButton
							key={tag}
							position={
								idx === Math.min(2, allTags.length - 1) ? "last" : "middle"
							}
							size="sm"
							variant={tagFilter === tag ? "blue" : "outline"}
							onClick={() => setTagFilter(tag)}
						>
							{tag}
						</GroupedDepthButton>
					))}
				</DepthButtonGroup>
				<Button onClick={() => setShowForm(!showForm)} size="sm">
					{showForm ? "Close" : "+ Add Contact"}
				</Button>
			</div>

			{/* Contact Form Modal */}
			{showForm && (
				<Card className="border-border/50 p-4 space-y-3">
					<h3 className="font-semibold">
						{editingContact ? "Edit Contact" : "New Contact"}
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Input
							placeholder="Name"
							value={formData.name || ""}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
						/>
						<Input
							placeholder="Email"
							value={formData.email || ""}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
						/>
						<Input
							placeholder="Company"
							value={formData.company || ""}
							onChange={(e) =>
								setFormData({ ...formData, company: e.target.value })
							}
						/>
						<DepthButtonMenu
							value={formData.platform || "instagram"}
							onChange={(v) =>
								setFormData({ ...formData, platform: v || "instagram" })
							}
							options={[
								{ value: "instagram", label: "Instagram" },
								{ value: "twitter", label: "Twitter" },
								{ value: "facebook", label: "Facebook" },
								{ value: "telegram", label: "Telegram" },
								{ value: "whatsapp", label: "WhatsApp" },
							]}
							placeholder="Platform"
							size="default"
						/>
					</div>
					<Input
						placeholder="Tags (comma separated)"
						value={formData.tags?.join(", ") || ""}
						onChange={(e) =>
							setFormData({
								...formData,
								tags: e.target.value
									.split(",")
									.map((t) => t.trim())
									.filter(Boolean),
							})
						}
					/>
					<Input
						placeholder="Notes"
						value={formData.notes || ""}
						onChange={(e) =>
							setFormData({ ...formData, notes: e.target.value })
						}
					/>
					<div className="flex gap-2">
						<Button onClick={handleSave}>
							{editingContact ? "Save" : "Create"}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setShowForm(false);
								setEditingContact(null);
								setFormData({});
							}}
						>
							Cancel
						</Button>
					</div>
				</Card>
			)}

			{filteredContacts.length === 0 ? (
				<Card className="border-border/50 p-8 text-center">
					<Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
					<p className="text-muted-foreground">No contacts found</p>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{filteredContacts.map((contact) => {
						const config = getPlatformConfig(contact.platform);
						const Icon = config.icon;
						return (
							<Card
								key={contact.id}
								className="border-border/50 p-4 hover:bg-muted/30 transition-colors"
							>
								<div className="flex items-start gap-3">
									<Avatar className="h-12 w-12">
										<AvatarImage src={contact.avatarUrl} />
										<AvatarFallback>
											{contact.name[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold text-sm">
												{contact.name}
											</span>
											<div className={cn("flex items-center", config.color)}>
												<Icon className="h-3 w-3" />
											</div>
										</div>
										<p className="text-xs text-muted-foreground">
											{contact.email}
										</p>
										{contact.company && (
											<p className="text-xs text-muted-foreground">
												{contact.company}
											</p>
										)}
										<div className="flex items-center gap-1 mt-2 flex-wrap">
											{contact.tags.map((tag) => (
												<Badge
													key={tag}
													variant="outline"
													className="text-[10px] px-1.5 py-0 h-4"
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7 shrink-0"
										onClick={() => handleEdit(contact)}
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</div>
								{contact.notes && (
									<p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-muted/50 rounded px-2 py-1">
										{contact.notes}
									</p>
								)}
								<div className="flex gap-1 mt-2 pt-2 border-t border-border/30">
									<Button
										variant="ghost"
										size="sm"
										className="h-7 text-xs"
										onClick={() => handleEdit(contact)}
									>
										Edit
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-7 text-xs text-destructive"
										onClick={() => handleDelete(contact.id)}
									>
										Delete
									</Button>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
