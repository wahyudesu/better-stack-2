"use client";

import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import { ChevronDown, Pause, Play } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAds, getCampaigns } from "@/lib/api/ads";
import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { Ad, AdCampaign } from "@/lib/types/ads";

interface AdsCampaignsProps {
	platform: string;
	status: string;
}

export async function AdsCampaigns({ platform, status }: AdsCampaignsProps) {
	const params: Record<string, string | number> = { limit: 50 };
	if (platform !== "all") params.platform = platform;
	if (status !== "all") params.status = status;

	const campaigns = await getCampaigns(params);
	const allAds = await getAds({ limit: 100 });

	return (
		<div className="space-y-4">
			{/* Campaign count */}
			<div className="text-sm text-muted-foreground">
				{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
			</div>

			{/* Campaign list */}
			<div className="space-y-3">
				{campaigns.map((campaign) => {
					const campaignAds = allAds.filter(
						(ad) => ad.platformCampaignId === campaign._id,
					);
					return (
						<CampaignRow
							key={campaign._id}
							campaign={campaign}
							ads={campaignAds}
						/>
					);
				})}
			</div>

			{campaigns.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No campaigns found matching your filters.
				</div>
			)}
		</div>
	);
}

function mapStatusToBadgeType(
	status: string,
): "published" | "draft" | "review" | "failed" | "scheduled" {
	switch (status) {
		case "active":
			return "published";
		case "paused":
			return "draft";
		case "pending_review":
			return "scheduled";
		case "rejected":
			return "failed";
		case "completed":
			return "draft";
		case "cancelled":
			return "draft";
		case "error":
			return "failed";
		default:
			return "draft";
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

function CampaignRow({ campaign, ads }: { campaign: AdCampaign; ads: Ad[] }) {
	const [localStatus, setLocalStatus] = useState(campaign.status);
	const [sheetOpen, setSheetOpen] = useState(false);

	const handleTogglePause = () => {
		setLocalStatus(localStatus === "paused" ? "active" : "paused");
	};

	return (
		<>
			<Card>
				<CardContent className="p-4">
					<div className="flex items-start justify-between gap-4">
						{/* Left: campaign info */}
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2 mb-1">
								<button
									type="button"
									onClick={() => setSheetOpen(true)}
									className="font-medium truncate hover:text-primary transition-colors text-left"
								>
									{campaign.name}
								</button>
								<StatusBadge status={mapStatusToBadgeType(localStatus)} />
							</div>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<Badge variant="outline" className="text-xs capitalize">
									{campaign.platform}
								</Badge>
								<span>Objective: {campaign.objective.replace("_", " ")}</span>
								<span>
									{ads.length} ad{ads.length !== 1 ? "s" : ""}
								</span>
								<span>
									Budget:{" "}
									{campaign.budget
										? `${formatCurrency(campaign.budget.amount)}${campaign.budget.type === "daily" ? "/day" : " total"}`
										: "—"}
								</span>
							</div>
						</div>

						{/* Right: metrics + actions */}
						{campaign.metrics && (
							<div className="flex items-center gap-6 shrink-0">
								{/* Key metrics */}
								<div className="grid grid-cols-4 gap-4 text-center">
									<div>
										<div className="text-xs text-muted-foreground">Spend</div>
										<div className="text-sm font-medium">
											{formatCurrency(campaign.metrics.spend)}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground">Impr.</div>
										<div className="text-sm font-medium">
											{formatNumber(campaign.metrics.impressions)}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground">CTR</div>
										<div className="text-sm font-medium">
											{campaign.metrics.ctr.toFixed(2)}%
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground">ROAS</div>
										<div className="text-sm font-medium">
											{campaign.metrics.roas.toFixed(2)}x
										</div>
									</div>
								</div>

								{/* Actions */}
								<DropdownMenu>
									<DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center">
										<ChevronDown className="h-4 w-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={handleTogglePause}>
											{localStatus === "paused" ? (
												<>
													<Play className="h-4 w-4 mr-2" /> Resume
												</>
											) : (
												<>
													<Pause className="h-4 w-4 mr-2" /> Pause
												</>
											)}
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setSheetOpen(true)}>
											View Ads
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Sheet: campaign ads */}
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent side="right" className="w-[500px] sm:max-w-[500px]">
					<SheetHeader>
						<SheetTitle>{campaign.name}</SheetTitle>
						<SheetDescription>
							{campaign.platform} · {campaign.objective.replace("_", " ")} ·{" "}
							{ads.length} ad{ads.length !== 1 ? "s" : ""}
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className="flex-1 mt-4">
						<div className="space-y-3 pr-4">
							{ads.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									No ads in this campaign
								</div>
							) : (
								ads.map((ad) => (
									<Card key={ad._id}>
										<CardContent className="p-3">
											<div className="flex items-start gap-3">
												{ad.creative?.thumbnailUrl ? (
													<img
														src={ad.creative.thumbnailUrl}
														alt={ad.name}
														className="w-12 h-12 rounded-md object-cover shrink-0"
													/>
												) : (
													<div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center shrink-0">
														<PlatformInitial platform={ad.platform} />
													</div>
												)}

												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-medium text-sm truncate">
															{ad.name}
														</span>
														<StatusBadge
															status={mapStatusToBadgeType(ad.status)}
														/>
													</div>
													<div className="text-xs text-muted-foreground mb-2 line-clamp-1">
														{ad.creative?.body ?? "No copy"}
													</div>
													<div className="flex items-center gap-3 text-xs text-muted-foreground">
														<span>{ad.adType}</span>
														{ad.metrics && (
															<>
																<span>·</span>
																<span>
																	Spend {formatCurrency(ad.metrics.spend)}
																</span>
																<span>·</span>
																<span>
																	Impr {formatNumber(ad.metrics.impressions)}
																</span>
															</>
														)}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))
							)}
						</div>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</>
	);
}
