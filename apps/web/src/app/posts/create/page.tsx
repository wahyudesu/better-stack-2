"use client";

import { Eye, EyeOff, Tag, X } from "lucide-react";
import { useState } from "react";
import { ContentEditor } from "@/components/features/create-post/content-editor";
import { PlatformBadges } from "@/components/features/create-post/platform-badges";
import { ProfileSelector } from "@/components/features/create-post/profile-selector";
import { PublishOptions } from "@/components/features/create-post/publish-options";
import { ScheduledDateTime } from "@/components/features/create-post/scheduled-datetime";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sampleProfiles } from "@/lib/data/social-data";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import type {
	ContentPost,
	PostMedia,
	ProfilePlatform,
} from "@/lib/types/social";

type PublishMode = "draft" | "schedule" | "now";

export default function CreatePostPage() {
	const [content, setContent] = useState("");
	const [media, setMedia] = useState<PostMedia[]>([]);
	const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
	const [publishMode, setPublishMode] = useState<PublishMode>("now");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [timezone, setTimezone] = useState("Asia/Jakarta");
	const [showPreview, setShowPreview] = useState(false);
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");

	const selectedProfiles = sampleProfiles.filter((p) =>
		selectedProfileIds.includes(p.id),
	);

	const platforms = [
		...new Set(selectedProfiles.map((p) => p.platform)),
	] as ProfilePlatform[];

	const handleSubmit = () => {
		const post: ContentPost = {
			id: `post-${Date.now()}`,
			title: content.slice(0, 50) || "Untitled",
			content,
			media,
			platforms,
			profileIds: selectedProfileIds,
			tags,
			createdAt: new Date(),
			updatedAt: new Date(),
			status:
				publishMode === "now"
					? "publishing"
					: publishMode === "schedule"
						? "scheduled"
						: "draft",
			scheduledAt:
				publishMode === "schedule" && scheduledDate && scheduledTime
					? new Date(`${scheduledDate}T${scheduledTime}`)
					: undefined,
		};
		console.log("Post created:", post);
		alert("Post created! Check console for payload.");
	};

	const isValid = content.trim().length > 0 && selectedProfileIds.length > 0;

	const handleAddTag = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			const newTag = tagInput.trim().toLowerCase();
			if (!tags.includes(newTag)) {
				setTags([...tags, newTag]);
			}
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((t) => t !== tagToRemove));
	};

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="flex items-center justify-between mb-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Create Post</h1>
					<p className="text-sm text-muted-foreground">
						create & publish content
					</p>
				</div>
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

			<div className={`grid gap-6 ${showPreview ? "lg:grid-cols-5" : ""}`}>
				<div className={showPreview ? "lg:col-span-3" : "max-w-3xl"}>
					<div className="space-y-4">
						{/* Profile Selection */}
						<Card className="p-4 border-primary/20 bg-primary/5">
							<div className="space-y-3">
								<span className="text-sm font-semibold">Select Profiles</span>
								<ProfileSelector
									selectedIds={selectedProfileIds}
									onChange={setSelectedProfileIds}
								/>
							</div>
						</Card>

						{/* Content Editor */}
						<Card className="p-4">
							<ContentEditor
								value={content}
								onChange={setContent}
								media={media}
								onMediaChange={setMedia}
							/>
						</Card>

						{/* Tags */}
						<Card className="p-4">
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Tag className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-medium">Tags</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-sm"
										>
											#{tag}
											<button
												type="button"
												onClick={() => removeTag(tag)}
												className="hover:text-destructive"
											>
												<X className="h-3 w-3" />
											</button>
										</span>
									))}
								</div>
								<input
									type="text"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyDown={handleAddTag}
									placeholder="Type and press Enter to add tag..."
									className="w-full text-sm bg-transparent border-0 border-b focus:border-b-2 focus:border-primary outline-none py-2 placeholder:text-muted-foreground"
								/>
							</div>
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

						{/* Submit */}
						<div className="flex justify-end">
							<Button onClick={handleSubmit} disabled={!isValid}>
								{publishMode === "now"
									? "Publish"
									: publishMode === "schedule"
										? "Schedule Post"
										: "Save Draft"}
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
									<div className="border rounded-lg p-4 bg-background min-h-50">
										{content ? (
											<div className="space-y-3">
												{media.length > 0 && (
													<div className="flex gap-2 flex-wrap">
														{media.map((m, i) => (
															<div
																key={i}
																className="w-20 h-20 bg-muted rounded-md overflow-hidden"
															>
																{m.type === "video" ? (
																	<video
																		src={m.url}
																		className="w-full h-full object-cover"
																	>
																		<track kind="captions" />
																	</video>
																) : (
																	<img
																		src={m.url}
																		alt={m.alt}
																		className="w-full h-full object-cover"
																	/>
																)}
															</div>
														))}
													</div>
												)}
												<p className="text-sm whitespace-pre-wrap">{content}</p>
											</div>
										) : (
											<p className="text-sm text-muted-foreground text-center py-8">
												Start typing to see preview...
											</p>
										)}
									</div>
									{selectedProfiles.length > 0 && (
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>Posting as:</span>
											{selectedProfiles.map((p) => (
												<span key={p.id} className="font-medium">
													{p.name}
												</span>
											))}
										</div>
									)}
									{tags.length > 0 && (
										<div className="flex items-center gap-2 flex-wrap">
											{tags.map((tag) => (
												<span
													key={tag}
													className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
												>
													#{tag}
												</span>
											))}
										</div>
									)}
								</div>
							</Card>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
