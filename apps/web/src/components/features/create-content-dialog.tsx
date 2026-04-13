"use client";

import { Calendar, Clock, Plus, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FilePreview, type UploadedFile } from "@/components/ui/file-preview";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Tabs, TabsContent, TabsList, TabsTab } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PLATFORMS } from "@/lib/constants/platforms";
import type { ProfilePlatform } from "@/lib/types/social";
import { cn } from "@/lib/utils";

// Platform options for selection
const PLATFORM_OPTIONS: { value: ProfilePlatform; label: string }[] = [
	{ value: "instagram", label: "Instagram" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "twitter", label: "Twitter/X" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "youtube", label: "YouTube" },
	{ value: "facebook", label: "Facebook" },
	{ value: "pinterest", label: "Pinterest" },
];

type PostMode = "now" | "schedule";
type PostType = "quick" | "custom";

interface CreateContentDialogProps {
	trigger?: React.ReactNode;
	onCreatePost?: (data: CreatePostData) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export interface CreatePostData {
	content: string;
	platforms: ProfilePlatform[];
	postType: PostType;
	mode: PostMode;
	scheduledAt?: Date;
	media: UploadedFile[];
}

export function CreateContentDialog({
	trigger,
	onCreatePost,
	open: controlledOpen,
	onOpenChange,
}: CreateContentDialogProps) {
	const [open, setOpen] = useState(false);
	const [content, setContent] = useState("");
	const [selectedPlatforms, setSelectedPlatforms] = useState<ProfilePlatform[]>(
		[],
	);
	const [postType, setPostType] = useState<PostType>("quick");
	const [mode, setMode] = useState<PostMode>("now");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);

	const isControlled = controlledOpen !== undefined;
	const isOpen = isControlled ? controlledOpen : open;

	const setIsOpen = useCallback(
		(value: boolean) => {
			if (isControlled && onOpenChange) {
				onOpenChange(value);
			} else {
				setOpen(value);
			}
		},
		[isControlled, onOpenChange],
	);

	const handleTogglePlatform = (platform: ProfilePlatform) => {
		setSelectedPlatforms((prev) =>
			prev.includes(platform)
				? prev.filter((p) => p !== platform)
				: [...prev, platform],
		);
	};

	const handleFileUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			const newFiles: UploadedFile[] = files.map((file) => {
				const preview = file.type.startsWith("image/")
					? URL.createObjectURL(file)
					: undefined;
				return {
					id: `${Date.now()}-${Math.random()}`,
					name: file.name,
					size: file.size,
					type: file.type,
					file,
					preview,
				};
			});
			setMediaFiles((prev) => [...prev, ...newFiles]);
		},
		[],
	);

	const handleRemoveMedia = useCallback((id: string) => {
		setMediaFiles((prev) => {
			const file = prev.find((f) => f.id === id);
			if (file?.preview) {
				URL.revokeObjectURL(file.preview);
			}
			return prev.filter((f) => f.id !== id);
		});
	}, []);

	const handleCreatePost = useCallback(() => {
		if (!content.trim() || selectedPlatforms.length === 0) return;

		const scheduledAt =
			mode === "schedule" && scheduledDate && scheduledTime
				? new Date(`${scheduledDate}T${scheduledTime}`)
				: undefined;

		const postData: CreatePostData = {
			content,
			platforms: selectedPlatforms,
			postType,
			mode,
			scheduledAt,
			media: mediaFiles,
		};

		onCreatePost?.(postData);

		// Reset form
		setContent("");
		setSelectedPlatforms([]);
		setPostType("quick");
		setMode("now");
		setScheduledDate("");
		setScheduledTime("");
		setMediaFiles([]);

		setIsOpen(false);
	}, [
		content,
		selectedPlatforms,
		postType,
		mode,
		scheduledDate,
		scheduledTime,
		mediaFiles,
		onCreatePost,
		setIsOpen,
	]);

	const handleOpenChange = useCallback(
		(value: boolean) => {
			if (!value) {
				// Reset form on close
				setContent("");
				setSelectedPlatforms([]);
				setPostType("quick");
				setMode("now");
				setScheduledDate("");
				setScheduledTime("");
				setMediaFiles([]);
			}
			setIsOpen(value);
		},
		[setIsOpen],
	);

	const isFormValid = content.trim() && selectedPlatforms.length > 0;
	const isScheduleValid = mode === "now" || (scheduledDate && scheduledTime);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{trigger && <DialogTrigger render={() => trigger as any} />}
			<DialogContent className="max-w-lg gap-0 p-0">
				<DialogHeader className="px-6 pt-6 pb-4">
					<DialogTitle>Create New Post</DialogTitle>
					<DialogDescription>
						Create content for your social media platforms
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 px-6 pb-6 overflow-y-auto max-h-[calc(100vh-200px)]">
					{/* Platform Selection */}
					<div className="space-y-3">
						<label className="text-sm font-medium">Select Platforms</label>
						<div className="grid grid-cols-3 gap-2">
							{PLATFORM_OPTIONS.map((platform) => {
								const isSelected = selectedPlatforms.includes(platform.value);
								return (
									<button
										key={platform.value}
										type="button"
										onClick={() => handleTogglePlatform(platform.value)}
										className={cn(
											"flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
											isSelected
												? "border-primary bg-primary/5"
												: "border-border hover:border-primary/50",
										)}
									>
										<Checkbox
											checked={isSelected}
											className="pointer-events-none"
										/>
										<PlatformIcon platform={platform.value} size={16} />
										<span className="text-xs font-medium">
											{platform.label}
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Post Type Tabs */}
					<Tabs
						value={postType}
						onValueChange={(v) => setPostType(v as PostType)}
					>
						<TabsList className="w-full">
							<TabsTab value="quick">Quick Post</TabsTab>
							<TabsTab value="custom">Custom Post</TabsTab>
						</TabsList>

						<TabsContent value="quick" className="mt-4 space-y-4">
							<p className="text-sm text-muted-foreground">
								Create a quick post for your selected platforms. Perfect for
								daily updates and simple content.
							</p>
						</TabsContent>

						<TabsContent value="custom" className="mt-4 space-y-4">
							<p className="text-sm text-muted-foreground">
								Customize your post with advanced options. Add hashtags, CTAs,
								and platform-specific tweaks.
							</p>
						</TabsContent>
					</Tabs>

					{/* Content Input */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							{postType === "quick" ? "What's on your mind?" : "Content"}
						</label>
						<Textarea
							placeholder="Write your caption here..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="min-h-32 resize-y"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{content.length} characters</span>
							{selectedPlatforms.length > 0 && (
								<span>{selectedPlatforms.join(", ")}</span>
							)}
						</div>
					</div>

					{/* Media Upload */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Media</label>
						<label
							htmlFor="media-upload"
							className={cn(
								"flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer",
								"hover:border-primary hover:bg-primary/5",
							)}
						>
							<Plus className="size-5 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								Add images or videos
							</span>
						</label>
						<input
							id="media-upload"
							type="file"
							multiple
							accept="image/*,video/*"
							className="hidden"
							onChange={handleFileUpload}
						/>
						<FilePreview files={mediaFiles} onRemove={handleRemoveMedia} />
					</div>

					{/* Post Mode Selection */}
					<div className="space-y-3">
						<label className="text-sm font-medium">When to post?</label>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => setMode("now")}
								className={cn(
									"flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
									mode === "now"
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50",
								)}
							>
								<Send className="size-4" />
								<span className="text-sm font-medium">Post Now</span>
							</button>
							<button
								type="button"
								onClick={() => setMode("schedule")}
								className={cn(
									"flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
									mode === "schedule"
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50",
								)}
							>
								<Clock className="size-4" />
								<span className="text-sm font-medium">Schedule</span>
							</button>
						</div>
					</div>

					{/* Schedule Date & Time */}
					{mode === "schedule" && (
						<div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/50">
							<div className="space-y-2">
								<label
									htmlFor="schedule-date"
									className="text-xs font-medium text-muted-foreground"
								>
									Date
								</label>
								<div className="relative">
									<input
										id="schedule-date"
										type="date"
										min={new Date().toISOString().split("T")[0]}
										value={scheduledDate}
										onChange={(e) => setScheduledDate(e.target.value)}
										className={cn(
											"w-full h-10 px-3 pr-10 rounded-lg border border-input bg-input/30 text-sm outline-none",
											"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
										)}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="schedule-time"
									className="text-xs font-medium text-muted-foreground"
								>
									Time
								</label>
								<div className="relative">
									<input
										id="schedule-time"
										type="time"
										value={scheduledTime}
										onChange={(e) => setScheduledTime(e.target.value)}
										className={cn(
											"w-full h-10 px-3 pr-10 rounded-lg border border-input bg-input/30 text-sm outline-none",
											"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
										)}
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="px-6 pb-6 pt-2">
					<Button variant="outline" onClick={() => handleOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleCreatePost}
						disabled={!isFormValid || !isScheduleValid}
					>
						{mode === "now" ? (
							<>
								<Send className="size-4" />
								Post Now
							</>
						) : (
							<>
								<Calendar className="size-4" />
								Schedule Post
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default CreateContentDialog;
