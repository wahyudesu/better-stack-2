import { SocialIcon } from "react-social-icons/component";
import "react-social-icons/instagram";
import "react-social-icons/tiktok";
import "react-social-icons/x";
import "react-social-icons/youtube";
import "react-social-icons/facebook";
import "react-social-icons/linkedin";
import "react-social-icons/pinterest";
import "react-social-icons/threads";
import "react-social-icons/whatsapp";
import "react-social-icons/reddit";
import "react-social-icons/google";
import "react-social-icons/telegram";
import "react-social-icons/snapchat";
import "react-social-icons/bsky.app";

export type Platform =
	| "instagram"
	| "tiktok"
	| "twitter"
	| "youtube"
	| "facebook"
	| "linkedin"
	| "pinterest"
	| "threads"
	| "whatsapp"
	| "reddit"
	| "bluesky"
	| "google"
	| "telegram"
	| "snapchat";

// Platform color configurations
const platformColors: Record<Platform, { bg: string; color: string }> = {
	instagram: {
		bg: "bg-gradient-to-br from-purple-500 to-pink-500",
		color: "#E1306C",
	},
	tiktok: { bg: "bg-black dark:bg-white", color: "#000000" },
	twitter: { bg: "bg-black dark:bg-white", color: "#000000" },
	youtube: { bg: "bg-red-600", color: "#FF0000" },
	facebook: { bg: "bg-blue-600", color: "#1877F2" },
	linkedin: { bg: "bg-blue-700", color: "#0077B5" },
	pinterest: { bg: "bg-red-600", color: "#E60023" },
	threads: { bg: "bg-black dark:bg-white", color: "#000000" },
	whatsapp: { bg: "bg-green-500", color: "#25D366" },
	reddit: { bg: "bg-orange-600", color: "#FF4500" },
	bluesky: { bg: "bg-blue-400", color: "#0085FF" },
	google: { bg: "bg-red-500", color: "#4285F4" },
	telegram: { bg: "bg-blue-500", color: "#0088cc" },
	snapchat: { bg: "bg-yellow-400", color: "#FFFC00" },
};

// Network name mapping: our platform name -> react-social-icons network name
const networkMap: Record<string, string> = {
	bluesky: "bsky.app",
	twitter: "x",
};

interface PlatformIconProps {
	platform: Platform | string;
	size?: number;
	className?: string;
}

export function PlatformIcon({
	platform,
	size = 20,
	className,
}: PlatformIconProps) {
	const network = networkMap[platform] || platform;

	return (
		<SocialIcon
			network={network}
			style={{ height: size, width: size }}
			className={className}
		/>
	);
}

export const allPlatforms: Platform[] = [
	"instagram",
	"tiktok",
	"twitter",
	"youtube",
	"facebook",
	"linkedin",
	"pinterest",
	"threads",
	"whatsapp",
	"reddit",
	"bluesky",
	"google",
	"telegram",
	"snapchat",
];

// Helper functions for platform colors
export function getPlatformBgColor(platform: Platform | string): string {
	const platformKey = platform as Platform;
	return platformColors[platformKey]?.bg || "bg-gray-500";
}

export function getPlatformColor(platform: Platform | string): string {
	const platformKey = platform as Platform;
	return platformColors[platformKey]?.color || "#6B7280";
}
