"use client";

import Image from "next/image";
import type { PostMedia } from "@/lib/types/social";

interface TwitterPreviewProps {
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

export function TwitterPreview({
	content,
	media,
	account,
	tags,
	maxChars,
}: TwitterPreviewProps) {
	const displayContent = content || "Your post content will appear here...";
	const charCount = content.length;
	const isOverLimit = charCount > maxChars;

	return (
		<div className="space-y-3">
			{/* Platform badge */}
			<div className="flex items-center gap-2">
				<span
					className="text-xs font-medium px-2 py-1 rounded-full text-white"
					style={{ backgroundColor: "#1DA1F2" }}
				>
					X (Twitter)
				</span>
				<span
					className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
				>
					{charCount}/{maxChars}
				</span>
			</div>

			{/* Account info */}
			<div className="flex items-start gap-3">
				<div className="w-9 h-9 rounded-full bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
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
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1">
						<span className="text-sm font-medium">{account.name}</span>
						<span className="text-xs text-muted-foreground">
							@{account.username}
						</span>
					</div>
					<p className="text-sm whitespace-pre-wrap leading-relaxed mt-1">
						{displayContent}
					</p>
				</div>
			</div>

			{/* Tags */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-1 pl-12">
					{tags.map((tag) => (
						<span key={tag} className="text-xs text-blue-500">
							#{tag}
						</span>
					))}
				</div>
			)}

			{/* Media */}
			{media.length > 0 && (
				<div
					className={`grid gap-1 rounded-xl overflow-hidden ${
						media.length === 1
							? "grid-cols-1"
							: media.length <= 2
								? "grid-cols-2"
								: "grid-cols-2"
					}`}
				>
					{media.slice(0, 4).map((m, i) => (
						<div key={i} className="relative aspect-video bg-muted">
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
