import { Avatar, AvatarFallback } from "@zenpost/ui/components/avatar";
import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import { Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Conversation } from "../types";

interface ChatPanelProps {
	conversation: Conversation;
	messages: Array<{
		id: string;
		message: string;
		direction: "incoming" | "outgoing";
		createdAt: string;
		attachments?: Array<{
			type: string;
			url?: string;
			previewUrl?: string | null;
			filename?: string | null;
		}>;
		isEdited?: boolean;
		reactions?: Array<{ emoji: string; count: number }>;
	}>;
	isLoading?: boolean;
	messageInput: string;
	onMessageInputChange: (value: string) => void;
	onSendMessage: () => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	onLabelChange: (label: import("../types").CustomerLabel) => void;
	onTypingStart?: () => void;
	onMessageAction?: (action: "delete" | "react", messageId: string) => void;
	onUploadMedia?: (file: File) => Promise<string | null>;
}

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function ChatPanel({
	conversation,
	messages,
	isLoading,
	messageInput,
	onMessageInputChange,
	onSendMessage,
	onKeyDown,
	onLabelChange: _onLabelChange,
	onTypingStart,
	onMessageAction,
	onUploadMedia,
}: ChatPanelProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		messageId: string;
	} | null>(null);
	const [reactionPicker, setReactionPicker] = useState<{
		x: number;
		y: number;
		messageId: string;
	} | null>(null);
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onMessageInputChange(e.target.value);
		if (onTypingStart) {
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
			onTypingStart();
			typingTimeoutRef.current = setTimeout(() => {
				typingTimeoutRef.current = null;
			}, 2000);
		}
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !onUploadMedia) return;
		setUploading(true);
		try {
			const url = await onUploadMedia(file);
			if (url) {
				const attachment = `\n${url}`;
				onMessageInputChange(messageInput + attachment);
			}
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
		e.preventDefault();
		setContextMenu({ x: e.clientX, y: e.clientY, messageId });
	};

	const handleReaction = (emoji: string) => {
		if (reactionPicker) {
			onMessageAction?.("react", reactionPicker.messageId + ":" + emoji);
			setReactionPicker(null);
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Chat Header */}
			<div className="p-4 border-b border-border/50">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarFallback>
							{conversation.sender[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="font-semibold">{conversation.sender}</h3>
					</div>
				</div>
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
							const imageAttachment = msg.attachments?.find(
								(a) => a.type === "image" && (a.previewUrl || a.url),
							);
							const videoAttachment = msg.attachments?.find(
								(a) => a.type === "video" && (a.previewUrl || a.url),
							);
							const fileAttachment = msg.attachments?.find(
								(a) =>
									a.type === "file" ||
									a.type === "audio" ||
									(a.type === "share" && a.url),
							);
							const hasText = msg.message && msg.message.trim().length > 0;

							return (
								<div
									key={msg.id}
									className={cn(
										"flex items-end gap-2",
										isFromMe ? "justify-end" : "justify-start",
									)}
								>
									<div
										className={cn(
											"max-w-[70%] rounded-2xl px-4 py-2.5 relative group",
											isFromMe
												? "bg-primary text-primary-foreground rounded-br-sm"
												: "bg-muted rounded-bl-sm",
										)}
										onContextMenu={(e) => handleContextMenu(e, msg.id)}
									>
										{imageAttachment && (
											<img
												src={imageAttachment.previewUrl || imageAttachment.url}
												alt="Attachment"
												className={cn(
													"rounded-lg mb-2 max-w-full h-auto",
													!hasText && "max-h-48 object-cover",
												)}
											/>
										)}
										{videoAttachment && (
											<video
												src={videoAttachment.previewUrl || videoAttachment.url}
												controls
												className="rounded-lg mb-2 max-w-full max-h-48"
											/>
										)}
										{fileAttachment && (
											<div
												className={cn(
													"flex items-center gap-2 rounded-lg mb-2 px-3 py-2 border",
													isFromMe
														? "bg-primary-foreground/10 border-primary-foreground/20"
														: "bg-background/50 border-border/50",
												)}
											>
												<Paperclip className="h-4 w-4 flex-shrink-0" />
												<span className="text-sm truncate">
													{fileAttachment.filename ||
														fileAttachment.url?.split("/").pop() ||
														"File"}
												</span>
											</div>
										)}
										{hasText && (
											<p className="text-sm whitespace-pre-wrap">
												{msg.message}
											</p>
										)}
										{msg.reactions && msg.reactions.length > 0 && (
											<div className="flex gap-1 mt-1">
												{msg.reactions.map((r, i) => (
													<span
														key={i}
														className="text-xs bg-background/50 px-1.5 py-0.5 rounded-full"
													>
														{r.emoji} {r.count}
													</span>
												))}
											</div>
										)}
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												setReactionPicker({
													x: e.clientX,
													y: e.clientY,
													messageId: msg.id,
												});
											}}
											className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded-full p-1 hover:bg-muted"
										>
											<span className="text-xs">⚡</span>
										</button>
									</div>
									<span
										className={cn(
											"text-[10px]",
											isFromMe
												? "text-primary-foreground/70"
												: "text-muted-foreground",
										)}
									>
										{formatRelativeTime(msg.createdAt)}
										{msg.isEdited && " • Edited"}
									</span>
								</div>
							);
						})
					)}
				</div>
			</ScrollArea>

			{/* Context Menu */}
			{contextMenu && (
				<div
					className="fixed z-50 bg-popover border rounded-lg shadow-lg py-1 min-w-[120px]"
					style={{ left: contextMenu.x, top: contextMenu.y }}
					onMouseLeave={() => setContextMenu(null)}
				>
					<button
						type="button"
						className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted"
						onClick={() => {
							onMessageAction?.("delete", contextMenu.messageId);
							setContextMenu(null);
						}}
					>
						Delete
					</button>
				</div>
			)}

			{/* Reaction Picker */}
			{reactionPicker && (
				<div
					className="fixed z-50 bg-popover border rounded-lg shadow-lg p-2 flex gap-1"
					style={{ left: reactionPicker.x, top: reactionPicker.y }}
					onMouseLeave={() => setReactionPicker(null)}
				>
					{EMOJI_OPTIONS.map((emoji) => (
						<button
							key={emoji}
							type="button"
							className="p-1 hover:bg-muted rounded"
							onClick={() => handleReaction(emoji)}
						>
							{emoji}
						</button>
					))}
				</div>
			)}

			{/* Message Input */}
			<div className="p-4 border-t border-border/50">
				<div className="flex items-end gap-2">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileSelect}
						accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
						className="hidden"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="h-11 w-11 shrink-0"
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading}
					>
						<Paperclip className="h-5 w-5" />
					</Button>
					<div className="flex-1 relative">
						<Input
							placeholder="Type a message..."
							value={messageInput}
							onChange={handleInputChange}
							onKeyDown={onKeyDown}
							className="pr-10 min-h-[44px] resize-none"
						/>
					</div>
					<Button
						onClick={onSendMessage}
						disabled={!messageInput.trim() || uploading}
						size="icon"
						className="h-11 w-11 shrink-0"
					>
						<Send className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
