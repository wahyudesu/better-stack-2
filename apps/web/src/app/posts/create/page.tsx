"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { AccountSelector } from "@/components/features/create-post/account-selector";
import { ContentEditor } from "@/components/features/create-post/content-editor";
import { PublishOptions } from "@/components/features/create-post/publish-options";
import { ScheduledDateTime } from "@/components/features/create-post/scheduled-datetime";
import { SocialPreview } from "@/components/features/create-post/social-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ApiResponse, Post } from "@/lib/client";
import { api as clientApi } from "@/lib/client";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import type {
	PostMedia,
	ProfilePlatform,
	SocialMediaProfile,
} from "@/lib/types/social";

type PublishMode = "now" | "schedule" | "queue" | "draft";

export default function CreatePostPage() {
	const [content, setContent] = useState("");
	const [media, setMedia] = useState<PostMedia[]>([]);
	const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
	const [publishMode, setPublishMode] = useState<PublishMode>("now");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [timezone, setTimezone] = useState("Asia/Jakarta");
	const [showPreview, setShowPreview] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activePlatform, setActivePlatform] =
		useState<ProfilePlatform>("instagram");
	const [maxChars, setMaxChars] = useState(2200);

	// Get accounts from TanStack Query
	const { data: accountsData } = useQuery({
		queryKey: ["accounts"],
		queryFn: () => clientApi.getAccounts(),
	});
	const accounts = accountsData?.data?.accounts ?? [];

	// Transform accounts to SocialMediaProfile format
	const profiles: SocialMediaProfile[] = accounts.map((a) => ({
		id: a._id,
		platform: a.platform as ProfilePlatform,
		name: a.displayName || a.username,
		username: a.username,
		avatarUrl: a.profilePicture,
		status: a.isActive ? "active" : "disconnected",
		connectedAt: new Date(a.createdAt),
	}));

	const selectedAccounts = profiles.filter((a) =>
		selectedAccountIds.includes(a.id),
	);

	const getSubmitLabel = () => {
		switch (publishMode) {
			case "now":
				return "Publish now";
			case "schedule":
				return "Schedule Post";
			case "queue":
				return "Add to Queue";
			case "draft":
				return "Save Draft";
		}
	};

	const handleSubmit = async () => {
		if (!content.trim() || selectedAccountIds.length === 0) return;

		setIsLoading(true);
		setError(null);

		try {
			// Build media array for API
			const mediaPayload = media
				.filter((m) => m.url && !m.url.startsWith("blob:"))
				.map((m) => ({
					url: m.url,
					type: m.type,
					altText: m.alt,
				}));

			// Get profileId from first selected account
			const profileId = selectedAccounts[0]?.profileId || "";

			const postData = {
				profileId,
				content,
				socialAccountIds: selectedAccountIds,
				scheduledAt:
					publishMode === "schedule" && scheduledDate && scheduledTime
						? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
						: undefined,
				media: mediaPayload.length > 0 ? mediaPayload : undefined,
			};

			let result: ApiResponse<Post>;
			if (publishMode === "queue") {
				// Queue uses separate endpoint
				result = await clientApi.queuePost(postData);
			} else {
				result = await clientApi.createPost(postData);
			}

			if (result.error) {
				setError(result.error);
				return;
			}

			// Success - redirect to posts page
			window.location.href = "/posts";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create post");
		} finally {
			setIsLoading(false);
		}
	};

	const isValid = content.trim().length > 0 && selectedAccountIds.length > 0;

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="mb-4">
				<h1 className="text-2xl font-bold tracking-tight">Create Post</h1>
				<div className="flex items-start justify-between">
					<Card className="p-4 border-primary/20 bg-primary/5">
						<div className="space-y-3">
							<span className="text-sm font-semibold">Select Accounts</span>
							<AccountSelector
								accounts={profiles}
								selectedIds={selectedAccountIds}
								onChange={setSelectedAccountIds}
							/>
						</div>
					</Card>
					<Button
						variant={showPreview ? "default" : "outline"}
						size="sm"
						onClick={() => setShowPreview(!showPreview)}
						className="gap-2"
					>
						{showPreview ? (
							<>
								<EyeOff className="h-4 w-4" />
								Hide Preview
							</>
						) : (
							<>
								<Eye className="h-4 w-4" />
								Show Preview
							</>
						)}
					</Button>
				</div>
			</div>

			{error && (
				<div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
					{error}
				</div>
			)}

			<div className={`grid gap-6 ${showPreview ? "lg:grid-cols-5" : ""}`}>
				<div className={showPreview ? "lg:col-span-3" : "w-full"}>
					<div className="space-y-4">
						{/* Profile Selection */}

						{/* Content Editor */}
						<Card className="p-4">
							<ContentEditor
								value={content}
								onChange={setContent}
								media={media}
								onMediaChange={setMedia}
								maxChars={maxChars}
							/>
						</Card>

						{/* Publish Options */}
						<Card className="p-4">
							<div className="space-y-4">
								<PublishOptions value={publishMode} onChange={setPublishMode} />
								{publishMode === "schedule" && (
									<ScheduledDateTime
										date={scheduledDate}
										time={scheduledTime}
										timezone={timezone}
										onDateChange={setScheduledDate}
										onTimeChange={setScheduledTime}
										onTimezoneChange={setTimezone}
									/>
								)}
							</div>
						</Card>

						{/* Actions */}
						<div className="flex items-center justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => (window.location.href = "/posts")}
							>
								Cancel
							</Button>
							<Button onClick={handleSubmit} disabled={!isValid || isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Creating...
									</>
								) : (
									getSubmitLabel()
								)}
							</Button>
						</div>
					</div>
				</div>

				{showPreview && (
					<div className="lg:col-span-2">
						<div className="lg:sticky lg:top-4">
							<Card className="p-4">
								<div className="space-y-3">
									<span className="text-sm font-medium">Preview</span>
									<SocialPreview
										content={content}
										media={media}
										accounts={selectedAccounts}
										tags={[]}
										activePlatform={activePlatform}
										onPlatformChange={setActivePlatform}
										onMaxCharsChange={setMaxChars}
									/>
								</div>
							</Card>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
