"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";
import {
	Attachment,
	AttachmentPreview,
	AttachmentRemove,
	Attachments,
} from "@/components/ai-elements/attachments";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputFooter,
	PromptInputHeader,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
	usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";

const PromptInputAttachmentsDisplay = () => {
	const attachments = usePromptInputAttachments();

	if (attachments.files.length === 0) {
		return null;
	}

	return (
		<Attachments variant="inline">
			{attachments.files.map((attachment) => (
				<Attachment
					data={attachment}
					key={attachment.id}
					onRemove={() => attachments.remove(attachment.id)}
				>
					<AttachmentPreview />
					<AttachmentRemove />
				</Attachment>
			))}
		</Attachments>
	);
};

export type AIChatProps = {
	inputValue?: string;
	onInputChange?: (value: string) => void;
};

const ALL_REFERENCE_PROMPTS = [
	"Analisis performa konten Instagram selama seminggu terakhir",
	"Buat content pillar dari konten Instagram yang sudah ada",
	"Riset ide konten viral berdasarkan niche brand",
	"Buat content calendar social media untuk 30 hari",
	"Analisis kompetitor dan peluang konten yang bisa dimanfaatkan",
	"Optimasi caption, hook, dan CTA untuk meningkatkan conversion",
	"Rekomendasi strategi growth social media tanpa ads",
] as const;

export function AIChat({ inputValue, onInputChange }: AIChatProps) {
	const { messages, status, sendMessage } = useChat();

	const randomPrompts = useMemo(() => {
		const shuffled = [...ALL_REFERENCE_PROMPTS].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 3);
	}, []);

	const handleSubmit = (message: PromptInputMessage) => {
		const hasText = Boolean(message.text);
		const hasAttachments = Boolean(message.files?.length);

		if (!(hasText || hasAttachments)) {
			return;
		}

		sendMessage({
			text: message.text || "Sent with attachments",
			files: message.files,
		});

		// Clear input after sending
		if (onInputChange) {
			onInputChange("");
		}
	};

	return (
		<div className="flex flex-col h-full">
			<Conversation>
				<ConversationContent>
					{messages.length === 0 ? (
						<ConversationEmptyState
							icon={<Sparkles className="size-8 text-muted-foreground/30" />}
							title="Ready to chat"
							description="Ask questions about your content, get suggestions, or generate new post ideas"
						/>
					) : (
						messages.map((message) => (
							<Message
								from={message.role as UIMessage["role"]}
								key={message.id}
							>
								<MessageContent>
									{message.parts.map((part, i) => {
										switch (part.type) {
											case "text":
												return (
													<MessageResponse key={`${message.id}-${i}`}>
														{part.text}
													</MessageResponse>
												);
											default:
												return null;
										}
									})}
								</MessageContent>
							</Message>
						))
					)}
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>

			<div className="mb-3 flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
				{randomPrompts.map((prompt) => (
					<button
						key={prompt}
						type="button"
						className="rounded-xl border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted"
						onClick={() => {
							if (onInputChange) {
								onInputChange(prompt);
							}
						}}
					>
						{prompt}
					</button>
				))}
			</div>

			<PromptInput onSubmit={handleSubmit} className="" globalDrop multiple>
				<PromptInputHeader>
					<PromptInputAttachmentsDisplay />
				</PromptInputHeader>
				<PromptInputBody>
					<PromptInputTextarea
						placeholder="Ask me anything about your social media content..."
						value={inputValue}
						onChange={(e) => onInputChange?.(e.currentTarget.value)}
					/>
				</PromptInputBody>
				<PromptInputFooter>
					<PromptInputTools>
						<PromptInputActionMenu>
							<PromptInputActionMenuTrigger />
							<PromptInputActionMenuContent>
								<PromptInputActionAddAttachments />
							</PromptInputActionMenuContent>
						</PromptInputActionMenu>
					</PromptInputTools>
					<PromptInputSubmit status={status} />
				</PromptInputFooter>
			</PromptInput>
		</div>
	);
}
