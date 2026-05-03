"use client";

import { ScrollArea } from "@zenpost/ui/components/scroll-area";
import {
	BarChart3,
	Calendar,
	ChevronDown,
	DollarSign,
	Eye,
	MousePointer,
	Pause,
	Play,
	TrendingUp,
} from "lucide-react";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { getAds, getCampaigns } from "@/lib/api/ads";
import { formatCurrency, formatNumber } from "@/lib/metrics";
import type { Ad, AdCampaign } from "@/lib/types/ads";
import { cn } from "@/lib/utils";

interface AdsCampaignsProps {
	platform: string;
	status: string;
}

export function AdsCampaigns({ platform, status }: AdsCampaignsProps) {
	return (
		<Suspense
			fallback={
				<div className="space-y-4">
					<div className="text-sm text-muted-foreground">
						Loading campaigns...
					</div>
					<div className="space-y-3">
						{[...Array(3)].map((_, i) => (
							<CampaignRowSkeleton key={i} />
						))}
					</div>
				</div>
			}
		>
			<AdsCampaignsContent platform={platform} status={status} />
		</Suspense>
	);
}

async function AdsCampaignsContent({ platform, status }: AdsCampaignsProps) {
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

export function CampaignRowSkeleton() {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-4">
					{/* Left: campaign info */}
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2 mb-1">
							<div className="h-5 w-40 animate-pulse bg-muted rounded" />
							<div className="h-5 w-16 animate-pulse bg-muted rounded" />
						</div>
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							<div className="h-4 w-12 animate-pulse bg-muted rounded" />
							<div className="h-4 w-20 animate-pulse bg-muted rounded" />
							<div className="h-4 w-12 animate-pulse bg-muted rounded" />
							<div className="h-4 w-24 animate-pulse bg-muted rounded" />
						</div>
					</div>

					{/* Right: metrics + actions */}
					<div className="flex items-center gap-6 shrink-0">
						{/* Key metrics */}
						<div className="grid grid-cols-4 gap-4 text-center">
							{["w-10", "w-14", "w-8", "w-10"].map((w, i) => (
								<div key={i} className="space-y-1">
									<div className="h-3 w-8 animate-pulse bg-muted rounded mx-auto" />
									<div
										className={`h-4 ${w} animate-pulse bg-muted rounded mx-auto`}
									/>
								</div>
							))}
						</div>

						{/* Actions */}
						<div className="h-8 w-8 animate-pulse bg-muted rounded" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function AdCardSkeleton() {
	return (
		<Card>
			<CardContent className="p-3">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 animate-pulse bg-muted rounded-md shrink-0" />
					<div className="min-w-0 flex-1 space-y-2">
						<div className="flex items-center gap-2">
							<div className="h-4 w-28 animate-pulse bg-muted rounded" />
							<div className="h-5 w-16 animate-pulse bg-muted rounded" />
						</div>
						<div className="h-3 w-48 animate-pulse bg-muted rounded" />
						<div className="flex items-center gap-2">
							<div className="h-3 w-12 animate-pulse bg-muted rounded" />
							<div className="h-3 w-16 animate-pulse bg-muted rounded" />
							<div className="h-3 w-12 animate-pulse bg-muted rounded" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

const statusConfig = {
	active: {
		label: "Active",
		color:
			"bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
		dot: "bg-green-500",
	},
	paused: {
		label: "Paused",
		color:
			"bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
		dot: "bg-yellow-500",
	},
	pending_review: {
		label: "Pending Review",
		color:
			"bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
		dot: "bg-blue-500",
	},
	rejected: {
		label: "Rejected",
		color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
		dot: "bg-red-500",
	},
	completed: {
		label: "Completed",
		color:
			"bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
		dot: "bg-gray-500",
	},
	cancelled: {
		label: "Cancelled",
		color:
			"bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
		dot: "bg-gray-500",
	},
	error: {
		label: "Error",
		color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
		dot: "bg-red-500",
	},
} as const;

function CampaignRow({ campaign, ads }: { campaign: AdCampaign; ads: Ad[] }) {
	const [localStatus, setLocalStatus] = useState(campaign.status);
	const [sheetOpen, setSheetOpen] = useState(false);

	const handleTogglePause = () => {
		setLocalStatus(localStatus === "paused" ? "active" : "paused");
	};

	const currentStatus =
		statusConfig[localStatus as keyof typeof statusConfig] ||
		statusConfig.active;

	return (
		<>
			<Card className="hover:border-primary/30 transition-colors cursor-pointer">
				<CardContent className="p-4" onClick={() => setSheetOpen(true)}>
					<div className="flex items-start justify-between gap-4">
						{/* Left: campaign info */}
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2 mb-1">
								<span className="font-medium truncate">{campaign.name}</span>
								<span
									className={cn(
										"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
										currentStatus.color,
									)}
								>
									<span
										className={cn(
											"w-1.5 h-1.5 rounded-full",
											currentStatus.dot,
										)}
									/>
									{currentStatus.label}
								</span>
							</div>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<Badge variant="outline" className="text-xs capitalize">
									{campaign.platform}
								</Badge>
								<span className="flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									{campaign.objective.replace("_", " ")}
								</span>
								<span>
									{ads.length} ad{ads.length !== 1 ? "s" : ""}
								</span>
								<span className="flex items-center gap-1">
									<DollarSign className="h-3 w-3" />
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
										<div className="text-sm font-semibold">
											{formatCurrency(campaign.metrics.spend)}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground">Impr.</div>
										<div className="text-sm font-semibold">
											{formatNumber(campaign.metrics.impressions)}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground">CTR</div>
										<div className="text-sm font-semibold">
											{campaign.metrics.ctr.toFixed(2)}%
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground">ROAS</div>
										<div className="text-sm font-semibold">
											{campaign.metrics.roas.toFixed(2)}x
										</div>
									</div>
								</div>

								{/* Actions */}
								<DropdownMenu>
									<DropdownMenuTrigger
										className="h-8 w-8 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
										onClick={(e) => e.stopPropagation()}
									>
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
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={() => setSheetOpen(true)}>
											<BarChart3 className="h-4 w-4 mr-2" />
											View Details
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Sheet: campaign detail */}
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent
					side="right"
					className="w-[650px] sm:max-w-[650px] p-0 flex flex-col"
				>
					<SheetHeader className="p-6 pb-4 border-b space-y-0">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<SheetTitle className="text-xl">{campaign.name}</SheetTitle>
								<SheetDescription className="mt-1 flex items-center gap-2">
									<Badge variant="outline" className="text-xs capitalize">
										{campaign.platform}
									</Badge>
									<span className="capitalize">
										{campaign.objective.replace("_", " ")}
									</span>
									<span>·</span>
									<span>
										{ads.length} ad{ads.length !== 1 ? "s" : ""}
									</span>
								</SheetDescription>
							</div>
							<span
								className={cn(
									"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
									currentStatus.color,
								)}
							>
								<span
									className={cn("w-1.5 h-1.5 rounded-full", currentStatus.dot)}
								/>
								{currentStatus.label}
							</span>
						</div>

						{/* Campaign metrics summary cards */}
						{campaign.metrics && (
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
								<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0">
									<CardContent className="p-3 text-center">
										<DollarSign className="h-4 w-4 mx-auto mb-1 text-primary" />
										<div className="text-lg font-bold">
											{formatCurrency(campaign.metrics.spend)}
										</div>
										<div className="text-xs text-muted-foreground">
											Total Spend
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/30 border-0">
									<CardContent className="p-3 text-center">
										<Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
										<div className="text-lg font-bold">
											{formatNumber(campaign.metrics.impressions)}
										</div>
										<div className="text-xs text-muted-foreground">
											Impressions
										</div>
									</CardContent>
								</Card>
								<Card className="bg-muted/30 border-0">
									<CardContent className="p-3 text-center">
										<MousePointer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
										<div className="text-lg font-bold">
											{formatNumber(campaign.metrics.clicks)}
										</div>
										<div className="text-xs text-muted-foreground">Clicks</div>
									</CardContent>
								</Card>
								<Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-0">
									<CardContent className="p-3 text-center">
										<TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
										<div className="text-lg font-bold text-green-600 dark:text-green-400">
											{campaign.metrics.roas.toFixed(2)}x
										</div>
										<div className="text-xs text-muted-foreground">ROAS</div>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Additional metrics row */}
						{campaign.metrics && (
							<div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
								<span>
									CTR:{" "}
									<span className="font-medium">
										{campaign.metrics.ctr.toFixed(2)}%
									</span>
								</span>
								<span>·</span>
								<span>
									CPC:{" "}
									<span className="font-medium">
										{formatCurrency(campaign.metrics.cpc)}
									</span>
								</span>
								<span>·</span>
								<span>
									Conversions:{" "}
									<span className="font-medium">
										{formatNumber(campaign.metrics.conversions)}
									</span>
								</span>
								<span>·</span>
								<span>
									CPA:{" "}
									<span className="font-medium">
										{formatCurrency(campaign.metrics.cpa)}
									</span>
								</span>
							</div>
						)}

						{/* Budget info */}
						{campaign.budget && (
							<div className="flex items-center gap-4 mt-2 text-xs">
								<span className="flex items-center gap-1 text-muted-foreground">
									<DollarSign className="h-3 w-3" />
									Budget:
								</span>
								<span className="font-medium">
									{formatCurrency(campaign.budget.amount)}
								</span>
								<Badge variant="outline" className="text-[10px]">
									{campaign.budget.type === "daily" ? "Daily" : "Lifetime"}
								</Badge>
							</div>
						)}
					</SheetHeader>

					{/* Ads list */}
					<div className="flex-1 overflow-hidden flex flex-col">
						<div className="px-6 py-3 border-b bg-muted/30 flex items-center justify-between">
							<h3 className="font-semibold text-sm">Ads in Campaign</h3>
							<span className="text-xs text-muted-foreground">
								{ads.length} ad{ads.length !== 1 ? "s" : ""}
							</span>
						</div>
						<ScrollArea className="flex-1 px-6 py-4">
							<div className="space-y-3">
								{ads.length === 0 ? (
									<div className="text-center py-8 text-muted-foreground">
										<BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
										<p>No ads in this campaign</p>
									</div>
								) : (
									ads.map((ad) => <AdCard key={ad._id} ad={ad} />)
								)}
							</div>
						</ScrollArea>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}

function AdCard({ ad }: { ad: Ad }) {
	const [expanded, setExpanded] = useState(false);

	const adStatus =
		statusConfig[ad.status as keyof typeof statusConfig] || statusConfig.active;

	return (
		<Card className="overflow-hidden hover:border-primary/20 transition-colors">
			<CardContent className="p-0">
				<div className="flex">
					{/* Ad thumbnail */}
					<div className="w-24 h-24 shrink-0 bg-muted flex items-center justify-center">
						{ad.creative?.thumbnailUrl ? (
							<img
								src={ad.creative.thumbnailUrl}
								alt={ad.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-3xl font-bold text-muted-foreground/30">
								{ad.platform.charAt(0).toUpperCase()}
							</span>
						)}
					</div>

					{/* Ad info */}
					<div className="flex-1 p-3 min-w-0">
						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2 mb-1">
									<span className="font-medium text-sm truncate">
										{ad.name}
									</span>
									<span
										className={cn(
											"inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0",
											adStatus.color,
										)}
									>
										{adStatus.label}
									</span>
								</div>
								<div className="text-xs text-muted-foreground mb-2 line-clamp-2">
									{ad.creative?.body ?? "No ad copy"}
								</div>
								<div className="flex items-center gap-2 text-xs">
									<Badge variant="outline" className="text-[10px] capitalize">
										{ad.adType}
									</Badge>
									{ad.metrics && (
										<>
											<span className="font-medium">
												{formatCurrency(ad.metrics.spend)}
											</span>
											<span className="text-muted-foreground">·</span>
											<span className="text-muted-foreground">
												{formatNumber(ad.metrics.impressions)} impr
											</span>
										</>
									)}
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 shrink-0"
								onClick={() => setExpanded(!expanded)}
							>
								<ChevronDown
									className={cn(
										"h-4 w-4 transition-transform",
										expanded && "rotate-180",
									)}
								/>
							</Button>
						</div>
					</div>
				</div>

				{/* Expanded metrics panel */}
				{expanded && ad.metrics && (
					<div className="border-t bg-muted/30 p-4">
						<div className="grid grid-cols-4 gap-3">
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<DollarSign className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{formatCurrency(ad.metrics.spend)}
								</div>
								<div className="text-[10px] text-muted-foreground">Spend</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<Eye className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{formatNumber(ad.metrics.impressions)}
								</div>
								<div className="text-[10px] text-muted-foreground">
									Impressions
								</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<MousePointer className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{formatNumber(ad.metrics.clicks)}
								</div>
								<div className="text-[10px] text-muted-foreground">Clicks</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<TrendingUp className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{ad.metrics.ctr.toFixed(2)}%
								</div>
								<div className="text-[10px] text-muted-foreground">CTR</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<DollarSign className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{formatCurrency(ad.metrics.cpc)}
								</div>
								<div className="text-[10px] text-muted-foreground">CPC</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<MousePointer className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{formatNumber(ad.metrics.conversions)}
								</div>
								<div className="text-[10px] text-muted-foreground">
									Conversions
								</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<DollarSign className="h-3 w-3 text-muted-foreground" />
								</div>
								<div className="text-sm font-semibold">
									{formatCurrency(ad.metrics.cpa)}
								</div>
								<div className="text-[10px] text-muted-foreground">CPA</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
								</div>
								<div className="text-sm font-semibold text-green-600 dark:text-green-400">
									{ad.metrics.roas.toFixed(2)}x
								</div>
								<div className="text-[10px] text-muted-foreground">ROAS</div>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
