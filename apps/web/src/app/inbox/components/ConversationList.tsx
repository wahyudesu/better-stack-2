"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenpost/ui/components/avatar";
import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import { MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import {
	DepthButtonGroup,
	GroupedDepthButton,
} from "@/components/ui/depth-buttons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Conversation, CustomerLabel } from "../types";
import { getPlatformConfig, labelConfig } from "../types";

type SortBy = "newest" | "name";
type MessageFilter = "all" | "unread" | "favorites";

interface ConversationListProps {
	conversations: Conversation[];
	isLoading: boolean;
	selectedId: string | null;
	onSelect: (conv: Conversation) => void;
}

function formatInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function ConversationList({
	conversations,
	isLoading,
	selectedId,
	onSelect,
}: ConversationListProps) {
	const [sortBy, setSortBy] = useState<SortBy>("newest");
	const [messageFilter, setMessageFilter] = useState<MessageFilter>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const filtered = conversations
		.filter((conv) => {
			if (messageFilter === "unread")
				return !conv.isRead || conv.unreadCount > 0;
			if (messageFilter === "favorites") return conv.isStarred;
			return true;
		})
		.filter(
			(conv) =>
				!searchQuery ||
				conv.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
				conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
		)
		.sort((a, b) => {
			if (sortBy === "newest") {
				return (
					new Date(b.lastMessageTime).getTime() -
					new Date(a.lastMessageTime).getTime()
				);
			}
			return a.sender.localeCompare(b.sender);
		});

	return (
		<Card className="border-border/50 overflow-hidden flex flex-col h-[600px]">
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
							variant={messageFilter === "favorites" ? "blue" : "outline"}
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
					{isLoading ? (
						<div className="text-center py-8">
							<p className="text-sm text-muted-foreground">
								Loading conversations...
							</p>
						</div>
					) : filtered.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-sm text-muted-foreground">
								No conversations found
							</p>
						</div>
					) : (
						filtered.map((conv) => {
							const config = getPlatformConfig(conv.platform);
							const Icon = config.icon;
							const isSelected = selectedId === conv.id;
							return (
								<button
									type="button"
									key={conv.id}
									onClick={() => onSelect(conv)}
									className={cn(
										"w-full text-left p-3 rounded-xl transition-all hover:bg-muted/50",
										isSelected ? "bg-muted" : "",
										!conv.isRead && "bg-primary/5",
									)}
								>
									<div className="flex items-start gap-3">
										<div className="relative">
											<Avatar className="h-10 w-10">
												<AvatarImage src={conv.avatar} />
												<AvatarFallback>
													{formatInitials(conv.sender)}
												</AvatarFallback>
											</Avatar>
											{conv.isOnline && (
												<div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
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
																	labelConfig[conv.customerLabel].bgColor,
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
												<div className={cn("flex items-center", config.color)}>
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
	);
}
