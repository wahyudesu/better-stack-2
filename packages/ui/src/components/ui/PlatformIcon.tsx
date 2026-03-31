import {
	Instagram,
	Facebook,
	LinkedIn,
	TwitterX,
	TikTok,
	YouTube,
	Pinterest,
} from "@better-stack-2/ui/components/icons/platform-icons";

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
	instagram: { bg: "bg-gradient-to-br from-purple-500 to-pink-500", color: "#E1306C" },
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

// Icon components mapping
const iconComponents: Record<Platform, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
	instagram: Instagram,
	tiktok: TikTok,
	twitter: TwitterX,
	youtube: YouTube,
	facebook: Facebook,
	linkedin: LinkedIn,
	pinterest: Pinterest,
	// Fallbacks for platforms not yet implemented
	threads: Instagram,
	whatsapp: Facebook,
	reddit: Facebook,
	bluesky: Facebook,
	google: Facebook,
	telegram: Facebook,
	snapchat: Facebook,
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
	const platformKey = platform as Platform;
	const IconComponent = iconComponents[platformKey] || Instagram;

	return (
		<IconComponent
			className={className}
			height={size}
			width={size}
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
