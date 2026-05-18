"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Calendar, Mail, MessageCircle, MessageSquare, Plus, Star, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	PlatformFilterDropdown,
	type PlatformFilterValue,
} from "@/components/ui/platform-filter";
import {
	getMockMessages,
	mockConversations,
	shouldUseMockData,
} from "@/data/inbox-mock";
import { inboxApi } from "@/lib/api/inbox";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { ChatPanel } from "./components/ChatPanel";
import { CommentsPanel } from "./components/CommentsPanel";
import { ConversationList } from "./components/ConversationList";
import { ReviewsPanel } from "./components/ReviewsPanel";
import type { Conversation, CustomerLabel, ServerConversation } from "./types";

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
		accountId: src.accountId,
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

export function InboxContent() {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("messages");
	const [platform, setPlatform] = useState<PlatformFilterValue>("all");

	// Comments tab state
	const [commentPlatform, setCommentPlatform] =
		useState<PlatformFilterValue>("all");

	// Reviews tab state
	const [reviewPlatform, setReviewPlatform] =
		useState<PlatformFilterValue>("all");
	const [reviewFilter, setReviewFilter] = useState<
		"all" | "replied" | "not_replied"
	>("all");

	// Campaign dialog state
	const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
	const [activeCampaignTab, setActiveCampaignTab] = useState<
		"broadcasts" | "sequences" | "comment-to-dm"
	>("broadcasts");

	// Messages tab state
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const [messageInput, setMessageInput] = useState("");
	const [mobileChatOpen, setMobileChatOpen] = useState(false);

	// Conversations query
	const { data: conversationsResult, isLoading: conversationsLoading } =
		useQuery({
			queryKey: ["inbox", "conversations", { platform }],
			queryFn: async () => {
				if (!useAuthStore.getState().clerkToken) {
					return { conversations: mockConversations, pagination: null };
				}
				const res = await inboxApi.listConversations({
					platform: platform === "all" ? undefined : platform,
					limit: 50,
				});
				if (res.error && shouldUseMockData(res.error)) {
					return { conversations: mockConversations, pagination: null };
				}
				if (res.error) throw new Error(res.error);
				return {
					conversations: res.data?.conversations ?? [],
					pagination: res.data?.pagination ?? null,
				};
			},
		});

	const conversationsData = conversationsResult?.conversations ?? [];

	const serverConversations = useMemo(() => {
		if (Array.isArray(conversationsData))
			return conversationsData.map(mapServerConversation);
		if (
			conversationsData &&
			typeof conversationsData === "object" &&
			"conversations" in conversationsData
		) {
			return (
				conversationsData as { conversations: ServerConversation[] }
			).conversations.map(mapServerConversation);
		}
		return [];
	}, [conversationsData]);

	// Messages query
	const { data: messagesData, isLoading: messagesLoading } = useQuery({
		queryKey: ["inbox", "messages", selectedConversation?.id],
		queryFn: async () => {
			if (!selectedConversation) return [];
			if (!useAuthStore.getState().clerkToken)
				return getMockMessages(selectedConversation.id);
			const res = await inboxApi.listMessages({
				conversationId: selectedConversation.id,
				accountId: selectedConversation.accountId,
				limit: 50,
				sortOrder: "desc",
			});
			if (res.error && shouldUseMockData(res.error))
				return getMockMessages(selectedConversation.id);
			if (res.error) throw new Error(res.error);
			return res.data?.messages ?? [];
		},
		enabled: !!selectedConversation,
	});

	// Mutations
	const sendMessageMutation = useMutation({
		mutationFn: async ({ text }: { text: string }) => {
			if (!selectedConversation) return;
			const res = await inboxApi.sendMessage({
				conversationId: selectedConversation.id,
				accountId: selectedConversation.accountId,
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
		mutationFn: async ({
			conversationId,
			accountId,
		}: {
			conversationId: string;
			accountId: string;
		}) => {
			const res = await inboxApi.updateConversation(conversationId, {
				accountId,
				status: "active",
			});
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
			// On mobile, open the chat sheet
			if (typeof window !== "undefined" && window.innerWidth < 1024) {
				setMobileChatOpen(true);
			}
			if (!conv.isRead)
				markAsReadMutation.mutate({
					conversationId: conv.id,
					accountId: conv.accountId,
				});
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

	const tabs = [
		{
			id: "messages",
			label: "Messages",
			icon: <MessageSquare className="h-5 w-5" />,
		},
		{
			id: "comments",
			label: "Comments",
			icon: <MessageCircle className="h-5 w-5" />,
		},
		{
			id: "reviews",
			label: "Reviews",
			icon: <Star className="h-5 w-5" />,
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
					<Button
						variant="outline"
						size="sm"
						onClick={() => setCampaignDialogOpen(true)}
					>
						<Bot className="h-4 w-4 mr-1" />
						Campaigns
					</Button>
				</div>
			</div>

			{/* Campaign Dialog */}
			<Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
				<DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle>Campaigns</DialogTitle>
					</DialogHeader>

					<div className="flex gap-4 min-h-0 flex-1 overflow-hidden">
						{/* Vertical tabs */}
						<nav className="w-[130px] shrink-0 space-y-0.5">
							<button
								type="button"
								onClick={() => setActiveCampaignTab("broadcasts")}
								className={cn(
									"flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
									activeCampaignTab === "broadcasts"
										? "bg-muted font-semibold text-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)}
							>
								<Mail className="h-4 w-4" />
								Broadcasts
							</button>
							<button
								type="button"
								onClick={() => setActiveCampaignTab("sequences")}
								className={cn(
									"flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
									activeCampaignTab === "sequences"
										? "bg-muted font-semibold text-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)}
							>
								<Calendar className="h-4 w-4" />
								Sequences
							</button>
							<button
								type="button"
								onClick={() => setActiveCampaignTab("comment-to-dm")}
								className={cn(
									"flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
									activeCampaignTab === "comment-to-dm"
										? "bg-muted font-semibold text-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)}
							>
								<Bot className="h-4 w-4" />
								Comment-to-DM
							</button>
						</nav>

						{/* Campaign content - kept inline for now, extract later if needed */}
						<div className="flex-1 min-w-0 overflow-y-auto">
							{activeCampaignTab === "broadcasts" && <CampaignBroadcastsTab />}
							{activeCampaignTab === "sequences" && <CampaignSequencesTab />}
							{activeCampaignTab === "comment-to-dm" && <CommentToDmTab />}
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Messages Tab */}
			{activeTab === "messages" && (
				<>
					{/* Conversation list - hidden on mobile when chat is open */}
					<div
						className={cn(
							"grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[600px]",
							mobileChatOpen && "hidden lg:grid"
						)}
					>
						<ConversationList
							conversations={serverConversations}
							isLoading={conversationsLoading}
							selectedId={selectedConversation?.id ?? null}
							onSelect={handleSelectConversation}
						/>
					</div>

					{/* Chat View - Desktop */}
					<Card
						className={cn(
							"hidden lg:flex lg:col-span-2 border-border/50 overflow-hidden flex-col h-[600px]",
							!selectedConversation && "items-center justify-center"
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

					{/* Chat View - Mobile Sheet */}
					<Sheet open={mobileChatOpen} onOpenChange={setMobileChatOpen}>
						<SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
							<SheetHeader className="px-4 py-3 border-b">
								<SheetTitle className="text-sm flex items-center gap-2">
									{selectedConversation ? (
										<>
											<MessageCircle className="h-4 w-4" />
											{selectedConversation.sender}
										</>
									) : (
										"Chat"
									)}
								</SheetTitle>
							</SheetHeader>
							<div className="flex-1 overflow-hidden">
								{selectedConversation ? (
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
								) : (
									<div className="text-center p-8 h-full flex items-center justify-center">
										<MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
										<p className="text-muted-foreground">
											Select a conversation
										</p>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</>
			)}

			{/* Comments Tab */}
			{activeTab === "comments" && (
				<CommentsPanel
					platform={commentPlatform}
					onPlatformChange={(v) => setCommentPlatform(v)}
				/>
			)}

			{/* Reviews Tab */}
			{activeTab === "reviews" && (
				<ReviewsPanel
					platform={reviewPlatform}
					filter={reviewFilter}
					onPlatformChange={setReviewPlatform}
					onFilterChange={setReviewFilter}
				/>
			)}
		</div>
	);
}

// ============================================================================
// CAMPAIGN SUB-TAB COMPONENTS (kept inline to avoid creating 3 more files)
// ============================================================================

function CampaignBroadcastsTab() {
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { data: broadcastsData, isLoading } = useQuery({
		queryKey: ["inbox", "broadcasts"],
		queryFn: async () => {
			const res = await import("@/lib/client").then((m) =>
				m.api.listBroadcasts({}),
			);
			if (res.error) throw new Error(res.error);
			return (res.data?.broadcasts ?? []) as Array<{
				_id: string;
				name: string;
				status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
				accountId: string;
				accountUsername?: string;
				recipientCount?: number;
				scheduledAt?: string;
				sentAt?: string;
				createdAt: string;
			}>;
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (broadcastId: string) => {
			const res = await import("@/lib/client").then((m) =>
				m.api.deleteBroadcast(broadcastId),
			);
			if (res.error) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox", "broadcasts"] });
		},
	});

	const statusBadge = (status: string) => {
		const config: Record<string, { label: string; className: string }> = {
			draft: { label: "Draft", className: "bg-gray-500/10 text-gray-500" },
			scheduled: {
				label: "Scheduled",
				className: "bg-blue-500/10 text-blue-500",
			},
			sending: {
				label: "Sending",
				className: "bg-yellow-500/10 text-yellow-500",
			},
			sent: { label: "Sent", className: "bg-green-500/10 text-green-500" },
			cancelled: {
				label: "Cancelled",
				className: "bg-red-500/10 text-red-500",
			},
		};
		return (
			<Badge className={cn("text-xs", config[status]?.className)}>
				{config[status]?.label}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{broadcastsData?.length ?? 0} broadcast
					{broadcastsData?.length !== 1 ? "s" : ""}
				</p>
				<Button
					onClick={() => setIsDialogOpen(true)}
					size="sm"
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					New Broadcast
				</Button>
			</div>

			{isLoading ? (
				<Card className="p-8 text-center">
					<p className="text-muted-foreground">Loading broadcasts...</p>
				</Card>
			) : !broadcastsData || broadcastsData.length === 0 ? (
				<Card className="p-8 text-center">
					<Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
					<p className="text-muted-foreground">No broadcasts yet</p>
				</Card>
			) : (
				<div className="space-y-3">
					{broadcastsData.map((broadcast) => (
						<Card key={broadcast._id} className="p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold">{broadcast.name}</h3>
											{statusBadge(broadcast.status)}
										</div>
										<div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
											{broadcast.recipientCount !== undefined && (
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{broadcast.recipientCount} recipients
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

function CampaignSequencesTab() {
	return (
		<div className="space-y-4">
			<Card className="p-8 text-center">
				<Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
				<p className="text-muted-foreground">No sequences yet</p>
			</Card>
		</div>
	);
}

function CommentToDmTab() {
	return (
		<div className="space-y-4">
			<Card className="p-8 text-center">
				<Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
				<p className="text-muted-foreground">No comment-to-DM rules yet</p>
			</Card>
		</div>
	);
}

// Unused - CommentToDmTab imported from ./campaigns/InboxCampaigns
