"use client";

import Image from "next/image";
import type { PostMedia } from "@/lib/types/social";

interface InstagramPreviewProps {
	content: string;
	media: PostMedia[];
	account: {
		name: string;
		username: string;
		avatarUrl?: string;
	};
	tags: string[];
	maxChars: number;
}

export function InstagramPreview({
	content,
	media,
	account,
	tags,
	maxChars,
}: InstagramPreviewProps) {
	const displayContent = content || "Your post content will appear here...";
	const charCount = content.length;
	const isOverLimit = charCount > maxChars;

	return (
		<div className="space-y-3">
			{/* Platform badge */}
			<div className="flex items-center gap-2">
				<span
					className="text-xs font-medium px-2 py-1 rounded-full text-white"
					style={{ backgroundColor: "#E1306C" }}
				>
					Instagram
				</span>
				<span
					className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
				>
					{charCount}/{maxChars}
				</span>
			</div>

			{/* Account info */}
			<div className="flex items-center gap-3">
				<div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden flex-shrink-0">
					{account.avatarUrl ? (
						<Image
							src={account.avatarUrl}
							alt={account.name}
							width={36}
							height={36}
							className="object-cover w-full h-full"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
							{account.name.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
				<div className="min-w-0">
					<p className="text-sm font-medium leading-none">{account.name}</p>
					<p className="text-xs text-muted-foreground leading-none mt-0.5">
						@{account.username}
					</p>
				</div>
			</div>

			{/* Content */}
			<p className="text-sm whitespace-pre-wrap leading-relaxed">
				{displayContent}
			</p>

			{/* Tags */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{tags.map((tag) => (
						<span key={tag} className="text-xs text-blue-600">
							#{tag}
						</span>
					))}
				</div>
			)}

			{/* Media */}
			{media.length > 0 && (
				<div
					className={`grid gap-1 ${media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
				>
					{media.slice(0, 10).map((m, i) => (
						<div
							key={i}
							className="relative aspect-square bg-muted rounded-lg overflow-hidden"
						>
							{m.type === "video" ? (
								<video
									src={m.url}
									className="absolute inset-0 w-full h-full object-cover"
								/>
							) : (
								<Image
									src={m.url}
									alt={m.alt ?? ""}
									fill
									className="object-cover"
								/>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
