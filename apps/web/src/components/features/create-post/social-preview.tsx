"use client";

import { useMemo } from "react";
import type {
	PostMedia,
	ProfilePlatform,
	SocialMediaProfile,
} from "@/lib/types/social";
import { FacebookPreview } from "./preview/facebook-preview";
import { InstagramPreview } from "./preview/instagram-preview";
import { TwitterPreview } from "./preview/twitter-preview";

interface SocialPreviewProps {
	content: string;
	media: PostMedia[];
	accounts: SocialMediaProfile[];
	tags: string[];
	activePlatform: ProfilePlatform;
	onPlatformChange: (platform: ProfilePlatform) => void;
	onMaxCharsChange: (maxChars: number) => void;
}

const PLATFORM_ORDER: ProfilePlatform[] = ["instagram", "twitter", "facebook"];
const PLATFORM_LIMITS: Record<ProfilePlatform, number> = {
	instagram: 2200,
	twitter: 280,
	facebook: 63206,
	tiktok: 2200,
	linkedin: 3000,
	youtube: 5000,
	pinterest: 500,
};

export function SocialPreview({
	content,
	media,
	accounts,
	tags,
	activePlatform,
	onPlatformChange,
	onMaxCharsChange,
}: SocialPreviewProps) {
	// Get unique platforms from selected accounts
	const selectedPlatforms = useMemo(() => {
		const platforms = accounts.map((a) => a.platform);
		return [...new Set(platforms)].filter((p): p is ProfilePlatform =>
			PLATFORM_ORDER.includes(p),
		);
	}, [accounts]);

	// Get first account for active platform
	const activeAccount = useMemo(() => {
		return accounts.find((a) => a.platform === activePlatform) || accounts[0];
	}, [accounts, activePlatform]);

	// Update maxChars when platform changes
	const handlePlatformChange = (platform: ProfilePlatform) => {
		onPlatformChange(platform);
		onMaxCharsChange(PLATFORM_LIMITS[platform] ?? 2200);
	};

	// Empty state
	if (accounts.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
				Select accounts above to see preview
			</div>
		);
	}

	// Single platform - no tabs needed
	if (selectedPlatforms.length === 1) {
		const platform = selectedPlatforms[0];
		onMaxCharsChange(PLATFORM_LIMITS[platform] ?? 2200);
		return (
			<div className="space-y-4">
				{renderPreview(
					platform,
					content,
					media,
					activeAccount,
					tags,
					PLATFORM_LIMITS[platform] ?? 2200,
				)}
			</div>
		);
	}

	// Multiple platforms - show tabs
	return (
		<div className="space-y-4">
			{/* Tab bar */}
			<div className="flex items-center gap-1 border-b">
				{selectedPlatforms.map((platform) => {
					const isActive = platform === activePlatform;
					const platformColors: Record<ProfilePlatform, string> = {
						instagram: "#E1306C",
						twitter: "#1DA1F2",
						facebook: "#1877F2",
						tiktok: "#000000",
						linkedin: "#0A66C2",
						youtube: "#FF0000",
						pinterest: "#E60023",
					};
					return (
						<button
							key={platform}
							onClick={() => handlePlatformChange(platform)}
							className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
								isActive
									? "border-current"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
							style={isActive ? { borderColor: platformColors[platform] } : {}}
						>
							{platform === "twitter"
								? "X"
								: platform.charAt(0).toUpperCase() + platform.slice(1)}
						</button>
					);
				})}
			</div>

			{/* Preview content */}
			<div>
				{renderPreview(
					activePlatform,
					content,
					media,
					activeAccount,
					tags,
					PLATFORM_LIMITS[activePlatform] ?? 2200,
				)}
			</div>
		</div>
	);
}

function renderPreview(
	platform: ProfilePlatform,
	content: string,
	media: PostMedia[],
	account: SocialMediaProfile,
	tags: string[],
	maxChars: number,
) {
	const accountInfo = {
		name: account.name,
		username: account.username,
		avatarUrl: account.avatarUrl,
	};

	switch (platform) {
		case "instagram":
			return (
				<InstagramPreview
					content={content}
					media={media}
					account={accountInfo}
					tags={tags}
					maxChars={maxChars}
				/>
			);
		case "twitter":
			return (
				<TwitterPreview
					content={content}
					media={media}
					account={accountInfo}
					tags={tags}
					maxChars={maxChars}
				/>
			);
		case "facebook":
			return (
				<FacebookPreview
					content={content}
					media={media}
					account={accountInfo}
					tags={tags}
					maxChars={maxChars}
				/>
			);
		default:
			return (
				<div className="text-sm text-muted-foreground">
					Preview not available for {platform}
				</div>
			);
	}
}
