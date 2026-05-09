import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenpost/ui/components/avatar";
import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import { MoreVertical, Paperclip, Send, Smile, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Conversation, CustomerLabel } from "../types";
import { getPlatformConfig } from "../types";

interface ChatPanelProps {
	conversation: Conversation;
	messages: Array<{
		id: string;
		message: string;
		direction: "incoming" | "outgoing";
		createdAt: string;
		attachments?: Array<{ type: string; previewUrl: string | null }>;
		isEdited?: boolean;
	}>;
	isLoading?: boolean;
	messageInput: string;
	onMessageInputChange: (value: string) => void;
	onSendMessage: () => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	onLabelChange: (label: CustomerLabel) => void;
}

export function ChatPanel({
	conversation,
	messages,
	isLoading,
	messageInput,
	onMessageInputChange,
	onSendMessage,
	onKeyDown,
	onLabelChange,
}: ChatPanelProps) {
	const config = getPlatformConfig(conversation.platform);
	const Icon = config.icon;

	return (
		<>
			{/* Chat Header */}
			<div className="p-4 border-b border-border/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage src={conversation.avatar} />
							<AvatarFallback>
								{conversation.sender[0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-semibold">{conversation.sender}</h3>
								{conversation.type === "message" && (
									<DepthButtonMenu
										value={
											conversation.customerLabel &&
											conversation.customerLabel !== "none"
												? conversation.customerLabel
												: undefined
										}
										onChange={(label) => onLabelChange(label as CustomerLabel)}
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
												icon: <Tag className="h-3 w-3 text-blue-600" />,
												description: "Potential customer",
											},
											{
												value: "customer",
												label: "Customer",
												icon: <Tag className="h-3 w-3 text-green-600" />,
												description: "Active customer",
											},
											{
												value: "partner",
												label: "Partner",
												icon: <Tag className="h-3 w-3 text-purple-600" />,
												description: "Business partner",
											},
										]}
										placeholder="Add Label"
										size="sm"
										panelClassName="w-44"
									/>
								)}
								<div className="flex items-center gap-1.5">
									<Icon className={cn("h-3 w-3", config.color)} />
									<span className="text-xs text-muted-foreground">
										{config.name}
									</span>
								</div>
							</div>
						</div>
						<Button variant="ghost" size="icon">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</div>
				</div>
				{conversation.mediaPost && (
					<div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
						<Tag className="h-3 w-3" />
						<span>On: {conversation.mediaPost}</span>
					</div>
				)}
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground text-sm">
							Loading messages...
						</div>
					) : (
						messages.map((msg) => {
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
										{hasImageAttachment && imageAttachment?.previewUrl && (
											<img
												src={imageAttachment.previewUrl}
												alt="Attachment"
												className="rounded-lg mb-2 max-w-full h-auto"
											/>
										)}
										<p className="text-sm whitespace-pre-wrap">{msg.message}</p>
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

			{/* Message Input */}
			<div className="p-4 border-t border-border/50">
				<div className="flex items-end gap-2">
					<div className="flex-1 relative">
						<Input
							placeholder="Type a message..."
							value={messageInput}
							onChange={(e) => onMessageInputChange(e.target.value)}
							onKeyDown={onKeyDown}
							className="pr-10 min-h-[44px] resize-none"
						/>
						<div className="absolute right-2 bottom-2 flex items-center gap-1">
							<Button variant="ghost" size="icon" className="h-7 w-7">
								<Paperclip className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon" className="h-7 w-7">
								<Smile className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<Button
						onClick={onSendMessage}
						disabled={!messageInput.trim()}
						size="icon"
						className="h-11 w-11 shrink-0"
					>
						<Send className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</>
	);
}
