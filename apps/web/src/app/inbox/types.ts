import {
	Instagram,
	MessageSquare,
	Music,
	Twitter,
	Users,
	Youtube,
} from "lucide-react";

export type CustomerLabel = "vip" | "lead" | "customer" | "partner" | "none";

export const labelConfig: Record<
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

export type Platform =
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
	| "whatsapp"
	| "all";

export interface ChatMessage {
	id: string;
	content: string;
	timestamp: string;
	isFromMe: boolean;
	mediaUrl?: string;
}

export interface Conversation {
	id: string;
	platform: Platform;
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

export const platformConfig: Record<
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

export function getPlatformConfig(platform: string) {
	return (
		platformConfig[platform] ?? {
			icon: MessageSquare,
			color: "text-muted-foreground",
			bg: "bg-muted",
			name: platform,
		}
	);
}
