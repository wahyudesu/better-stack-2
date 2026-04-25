"use client";

import { useState } from "react";
import { Pause, Play, Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import { getAds } from "@/lib/api/ads";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { Ad } from "@/lib/types/ads";

interface AdsListProps {
	platform: string;
	status: string;
}

export async function AdsList({ platform, status }: AdsListProps) {
	const params: Record<string, string | number> = { limit: 50 };
	if (platform !== "all") params.platform = platform;
	if (status !== "all") params.status = status;

	const ads = await getAds(params);

	return (
		<div className="space-y-4">
			<div className="text-sm text-muted-foreground">
				{ads.length} ad{ads.length !== 1 ? "s" : ""}
			</div>

			<div className="space-y-3">
				{ads.map((ad) => (
					<AdRow key={ad._id} ad={ad} />
				))}
			</div>

			{ads.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No ads found matching your filters.
				</div>
			)}
		</div>
	);
}

function mapStatusToBadgeType(status: string): "published" | "draft" | "review" | "failed" | "scheduled" {
	switch (status) {
		case "active": return "published";
		case "paused": return "draft";
		case "pending_review": return "scheduled";
		case "rejected": return "failed";
		case "completed": return "draft";
		case "cancelled": return "draft";
		case "error": return "failed";
		default: return "draft";
	}
}

function PlatformInitial({ platform }: { platform: string }) {
	const initials: Record<string, string> = {
		facebook: "F",
		instagram: "I",
		google: "G",
		tiktok: "T",
		linkedin: "L",
		pinterest: "P",
		twitter: "X",
	};
	return <span className="text-2xl">{initials[platform] ?? "?"}</span>;
}

function AdRow({ ad }: { ad: Ad }) {
	const [localStatus, setLocalStatus] = useState(ad.status);

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-4">
					{/* Left: thumbnail + info */}
					<div className="flex items-start gap-3 min-w-0 flex-1">
						{ad.creative?.thumbnailUrl ? (
							<img
								src={ad.creative.thumbnailUrl}
								alt={ad.name}
								className="w-16 h-16 rounded-md object-cover shrink-0"
							/>
						) : (
							<div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center shrink-0">
								<PlatformInitial platform={ad.platform} />
							</div>
						)}

						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2 mb-1">
								<span className="font-medium truncate">{ad.name}</span>
								<StatusBadge status={mapStatusToBadgeType(localStatus)} />
								<Badge variant="outline" className="text-xs">
									{ad.adType}
								</Badge>
							</div>

							<div className="text-xs text-muted-foreground mb-2 line-clamp-1">
								{ad.creative?.body ?? "No copy"}
							</div>

							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<Badge variant="outline" className="text-xs capitalize">
									{ad.platform}
								</Badge>
								<span>{ad.campaignName}</span>
								<span>·</span>
								<span>{ad.adSetName}</span>
								<span>·</span>
								<span>Goal: {ad.goal.replace("_", " ")}</span>
							</div>

							{ad.rejectionReason && (
								<div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
									Rejected: {ad.rejectionReason}
								</div>
							)}
						</div>
					</div>

					{/* Right: metrics + actions */}
					<div className="flex items-center gap-4 shrink-0">
						{ad.metrics && (
							<div className="grid grid-cols-4 gap-4 text-center">
								<div>
									<div className="text-xs text-muted-foreground">Spend</div>
									<div className="text-sm font-medium">
										{formatCurrency(ad.metrics.spend)}
									</div>
								</div>
								<div>
									<div className="text-xs text-muted-foreground">Impr.</div>
									<div className="text-sm font-medium">
										{formatNumber(ad.metrics.impressions)}
									</div>
								</div>
								<div>
									<div className="text-xs text-muted-foreground">Clicks</div>
									<div className="text-sm font-medium">
										{formatNumber(ad.metrics.clicks)}
									</div>
								</div>
								<div>
									<div className="text-xs text-muted-foreground">Conv.</div>
									<div className="text-sm font-medium">
										{formatNumber(ad.metrics.conversions)}
									</div>
								</div>
							</div>
						)}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<ChevronDown className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<Eye className="h-4 w-4 mr-2" /> View Details
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Pencil className="h-4 w-4 mr-2" /> Edit
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setLocalStatus(localStatus === "paused" ? "active" : "paused")}>
									{localStatus === "paused" ? (
										<><Play className="h-4 w-4 mr-2" /> Resume</>
									) : (
										<><Pause className="h-4 w-4 mr-2" /> Pause</>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-600">
									<Trash2 className="h-4 w-4 mr-2" /> Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
