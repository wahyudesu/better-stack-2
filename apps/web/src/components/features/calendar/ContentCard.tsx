import {
	ExternalLink,
	Heart,
	MessageCircle,
	MousePointerClick,
	Play,
	TrendingUp,
	Video,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Platform } from "@/components/ui/PlatformIcon";
import { getPlatformBgColor, PlatformIcon } from "@/components/ui/PlatformIcon";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { CalendarEvent } from "@/data/mock";
import { statusBadgeStyles } from "@/lib/constants/status";
import { cn } from "@/lib/utils";

interface ContentCardProps {
	event: CalendarEvent;
	onClick?: () => void;
	variant?: "calendar" | "vertical";
	size?: "default" | "sm";
	className?: string;
	draggable?: boolean;
	onDragStart?: (e: React.DragEvent) => void;
	onDragEnd?: (e: React.DragEvent) => void;
	showDateTime?: boolean;
	cardBorderClass?: string;
}

export function ContentCard({
	event,
	onClick,
	variant = "calendar",
	size = "default",
	className,
	draggable,
	onDragStart,
	onDragEnd,
	showDateTime = true,
	cardBorderClass,
}: ContentCardProps) {
	const badgeStyle = statusBadgeStyles[event.status] || statusBadgeStyles.draft;
	const isSm = size === "sm";
	const platforms = event.platforms || [event.platform];
	const platformBgColor = getPlatformBgColor(event.platform);

	const cardContent = (
		<Card
			className={cn(
				"group/card overflow-hidden transition-all hover:shadow-md cursor-pointer",
				variant === "calendar"
					? "flex flex-col rounded-lg px-2.5 py-2 min-h-[56px] border-0"
					: "p-3",
				isSm && "text-xs",
				cardBorderClass && `ring-1 ${cardBorderClass}`,
				className,
			)}
			draggable={draggable}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onClick={() => onClick?.()}
			style={{
				backgroundColor:
					variant === "calendar" ? platformBgColor : badgeStyle.bg,
			}}
		>
			{variant === "calendar" ? (
				<div className="flex flex-col h-full">
					<div className="flex items-start min-w-0 mb-auto">
						<span className="line-clamp-2 leading-tight flex-1 text-xs">
							{event.description || event.title}
						</span>
					</div>
					<div className="flex items-center justify-between mt-auto pt-1 gap-1.5">
						<Badge
							variant="secondary"
							className="capitalize pointer-events-none h-5 rounded-sm px-1.5 text-[10px] font-medium"
							style={{
								backgroundColor: badgeStyle.bg,
								color: badgeStyle.text,
							}}
						>
							{event.status}
						</Badge>
						<AvatarGroup className="shrink-0">
							{platforms.slice(0, 3).map((platform) => (
								<Avatar key={platform} size="sm" className="size-5">
									<AvatarFallback className="bg-card">
										<PlatformIcon platform={platform as Platform} size={12} />
									</AvatarFallback>
								</Avatar>
							))}
						</AvatarGroup>
						{event.time && (
							<span className="text-[10px] opacity-70">{event.time}</span>
						)}
					</div>
				</div>
			) : (
				<>
					<div className="flex gap-3 mb-2">
						{event.thumbnail ? (
							<div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
								<Image
									src={event.thumbnail}
									alt={event.description || event.title}
									width={56}
									height={56}
									className="h-full w-full object-cover"
								/>
								{event.mediaType === "video" && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/30">
										<Play className="h-4 w-4 text-white fill-white" />
									</div>
								)}
							</div>
						) : (
							<div className="h-14 w-14 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
								<Video className="h-8 w-8 text-muted-foreground/50" />
							</div>
						)}
						<div className="flex-1 min-w-0 flex flex-col">
							<p
								className={cn(
									"text-foreground/80 line-clamp-3",
									isSm ? "text-xs" : "text-sm",
								)}
							>
								{event.description || event.title}
							</p>
						</div>
					</div>
					{showDateTime && (
						<div className="flex items-center justify-between text-xs text-foreground/70 pt-2 border-t border-white/10">
							<AvatarGroup>
								{platforms.map((platform) => (
									<Avatar key={platform} size="sm" className="size-7">
										<AvatarFallback className="bg-white/20">
											<PlatformIcon platform={platform as Platform} size={18} />
										</AvatarFallback>
									</Avatar>
								))}
							</AvatarGroup>
							<div className="flex items-center gap-2">
								<span>{event.date}</span>
								{event.time && (
									<>
										<span className="text-foreground/50">•</span>
										<span>{event.time}</span>
									</>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</Card>
	);

	return (
		<Popover>
			<PopoverTrigger>
				<div>{cardContent}</div>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				className="w-80 p-0 overflow-hidden"
				sideOffset={8}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
					<span className="text-xs text-muted-foreground">
						{event.date} • {event.platform}
					</span>
				</div>

				{/* Profile */}
				<div className="flex items-center gap-2.5 px-3 py-2.5">
					<div className="flex items-center justify-center size-8 rounded-full bg-muted">
						<span className="text-[10px] font-bold">TF</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">techfusion.id</span>
						<span className="text-[10px] text-muted-foreground">
							@{event.platform}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="flex gap-3 px-3 pb-3">
					<div className="flex-1 min-w-0">
						<p className="text-sm text-muted-foreground line-clamp-4">
							{event.description || event.title}
						</p>
						<button
							type="button"
							className="text-xs text-primary mt-1 hover:underline"
						>
							see more
						</button>
					</div>

					{event.thumbnail && (
						<div className="relative size-14 flex-shrink-0 overflow-hidden rounded-lg">
							<Image
								src={event.thumbnail}
								alt={event.description || event.title}
								fill
								className="object-cover"
							/>
							{event.mediaType === "video" && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30">
									<Play className="size-3 text-white fill-white" />
								</div>
							)}
						</div>
					)}
				</div>

				{/* Interaction Bar */}
				<div className="flex items-center justify-between px-3 py-2.5 border-t border-border/50 bg-muted/30">
					<div className="flex items-center gap-4">
						<Heart className="size-3.5 text-muted-foreground" />
						<MessageCircle className="size-3.5 text-muted-foreground" />
						<TrendingUp className="size-3.5 text-muted-foreground" />
						<MousePointerClick className="size-3.5 text-muted-foreground" />
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end px-3 py-2.5 border-t border-border/50">
					<Button
						variant="default"
						size="sm"
						className="text-xs h-8"
						onClick={() => event.postUrl && window.open(event.postUrl, "_blank")}
					>
						<ExternalLink className="size-3.5 mr-1.5" />
						View Post
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
